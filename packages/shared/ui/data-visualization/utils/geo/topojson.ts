/**
 * TopoJSON Utilities
 * 
 * Core utilities for handling TopoJSON geographic data.
 * Self-hosted assets are in @pulwave/ui/data-visualization/assets/geo/
 */

// ============================================================================
// DATA SOURCE CONFIGURATION
// ============================================================================

/**
 * Asset paths for self-hosted TopoJSON files.
 * Apps should copy these from node_modules/@pulwave/ui/data-visualization/assets/geo/
 * to their public folder, or configure their bundler to serve them.
 * 
 * Default paths assume assets are served from /geo/
 */
export const WORLD_TOPOJSON_URL = '/geo/world/countries-110m.json';
export const US_TOPOJSON_URL = '/geo/usa/states-10m.json';

// CDN fallback URLs (for development or when self-hosting isn't configured)
export const WORLD_TOPOJSON_CDN = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
export const US_TOPOJSON_CDN = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// ============================================================================
// TOPOJSON LOADING
// ============================================================================

/**
 * Load TopoJSON data from URL (local or remote)
 */
export const loadTopoJSON = async (url: string) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load TopoJSON: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

/**
 * Convert TopoJSON to GeoJSON features
 */
export const topoToGeoFeatures = (topojson: Record<string, unknown>, objectName: string) => {
    const objects = topojson?.objects as Record<string, unknown> | undefined;
    if (!objects?.[objectName]) {
        return [];
    }

    const object = objects[objectName] as { type: string; geometries?: unknown[] };

    if (object.type === 'GeometryCollection' && object.geometries) {
        return object.geometries.map((geometry: unknown, idx: number) => {
            const geo = geometry as { id?: string | number; properties?: Record<string, unknown>; arcs?: unknown };
            return {
                type: 'Feature',
                id: geo.id || idx,
                properties: geo.properties || {},
                geometry: decodeGeometry(
                    geo,
                    topojson.arcs as number[][][],
                    topojson.transform as { scale: [number, number]; translate: [number, number] }
                ),
            };
        });
    }

    return [];
};

/**
 * Decode arc-based geometry to coordinates
 */
const decodeGeometry = (
    geometry: { type?: string; arcs?: unknown },
    arcs: number[][][],
    transform?: { scale: [number, number]; translate: [number, number] }
) => {
    const geom = geometry as { type: string; arcs: number[][] | number[][][] };
    if (!arcs || !geom) return { type: 'Polygon', coordinates: [] };

    const decodeArc = (arcIndex: number) => {
        const reverse = arcIndex < 0;
        const arc = arcs[reverse ? ~arcIndex : arcIndex];
        if (!arc) return [];

        const coordinates: [number, number][] = [];
        let x = 0, y = 0;

        arc.forEach((point) => {
            x += point[0];
            y += point[1];

            let px = x, py = y;
            if (transform) {
                px = x * transform.scale[0] + transform.translate[0];
                py = y * transform.scale[1] + transform.translate[1];
            }
            coordinates.push([px, py]);
        });

        return reverse ? coordinates.reverse() : coordinates;
    };

    const decodeRing = (ring: number[]) => {
        const coordinates: [number, number][] = [];
        ring.forEach(arcIndex => {
            coordinates.push(...decodeArc(arcIndex));
        });
        return coordinates;
    };

    switch (geom.type) {
        case 'Polygon':
            return {
                type: 'Polygon',
                coordinates: (geom.arcs as number[][]).map(decodeRing),
            };
        case 'MultiPolygon':
            return {
                type: 'MultiPolygon',
                coordinates: (geom.arcs as number[][][]).map((polygon) =>
                    polygon.map(decodeRing)
                ),
            };
        default:
            return geom;
    }
};

// ============================================================================
// PROJECTION UTILITIES
// ============================================================================

export interface Bounds {
    minLon: number;
    maxLon: number;
    minLat: number;
    maxLat: number;
}

/**
 * Project coordinates to SVG space (Mercator-like)
 */
export const projectCoordinates = (
    lon: number,
    lat: number,
    width: number,
    height: number,
    bounds: Bounds | null = null
) => {
    const b = bounds || { minLon: -180, maxLon: 180, minLat: -60, maxLat: 85 };

    const x = ((lon - b.minLon) / (b.maxLon - b.minLon)) * width;
    const y = height - ((lat - b.minLat) / (b.maxLat - b.minLat)) * height;

    return { x, y };
};

/**
 * Generate SVG path from GeoJSON geometry
 */
export const geometryToPath = (
    geometry: { type: string; coordinates?: unknown },
    width: number,
    height: number,
    bounds: Bounds
) => {
    if (!geometry?.coordinates) return '';

    const coordsToPath = (coords: [number, number][]) => {
        return coords
            .filter(c => c && c.length === 2 && !isNaN(c[0]) && !isNaN(c[1]))
            .map((coord, i) => {
                const { x, y } = projectCoordinates(coord[0], coord[1], width, height, bounds);
                return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
            })
            .join(' ');
    };

    switch (geometry.type) {
        case 'Polygon':
            return (geometry.coordinates as [number, number][][])
                .map((ring) => coordsToPath(ring) + ' Z')
                .join(' ');
        case 'MultiPolygon':
            return (geometry.coordinates as [number, number][][][])
                .map((polygon) => polygon.map((ring) => coordsToPath(ring) + ' Z').join(' '))
                .join(' ');
        default:
            return '';
    }
};

// ============================================================================
// FEATURE UTILITIES
// ============================================================================

/**
 * Get country/region name from feature properties
 */
export const getFeatureName = (feature: { properties?: Record<string, unknown>; id?: unknown }) => {
    const props = feature.properties || {};
    return (props.name || props.NAME || props.admin || props.ADMIN ||
        props.country || props.COUNTRY || `ID: ${feature.id}`) as string;
};

/**
 * Get ISO code from feature
 */
export const getFeatureCode = (feature: { properties?: Record<string, unknown>; id?: unknown }) => {
    const props = feature.properties || {};
    return (props.iso_a3 || props.ISO_A3 || props.iso_a2 || props.ISO_A2 ||
        props.code || props.CODE || feature.id) as string;
};

// ============================================================================
// COLOR UTILITIES
// ============================================================================

/**
 * Create color scale for choropleth maps
 */
export const createColorScale = (values: number[], colors = ['#E0F2FE', '#0369A1']) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return (value: number) => {
        const t = (value - min) / range;

        const c1 = hexToRgb(colors[0]);
        const c2 = hexToRgb(colors[1]);

        const r = Math.round(c1.r + (c2.r - c1.r) * t);
        const g = Math.round(c1.g + (c2.g - c1.g) * t);
        const b = Math.round(c1.b + (c2.b - c1.b) * t);

        return `rgb(${r}, ${g}, ${b})`;
    };
};

const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : { r: 0, g: 0, b: 0 };
};

// ============================================================================
// SIMPLE WORLD DATA (Fallback)
// ============================================================================

export const SIMPLE_WORLD_DATA = {
    countries: [
        { id: 'USA', name: 'United States', coords: [-98, 38] },
        { id: 'CAN', name: 'Canada', coords: [-106, 56] },
        { id: 'BRA', name: 'Brazil', coords: [-51, -14] },
        { id: 'GBR', name: 'United Kingdom', coords: [-3, 54] },
        { id: 'FRA', name: 'France', coords: [2, 46] },
        { id: 'DEU', name: 'Germany', coords: [10, 51] },
        { id: 'CHN', name: 'China', coords: [105, 35] },
        { id: 'JPN', name: 'Japan', coords: [138, 36] },
        { id: 'AUS', name: 'Australia', coords: [133, -27] },
        { id: 'IND', name: 'India', coords: [79, 21] },
        { id: 'RUS', name: 'Russia', coords: [100, 60] },
        { id: 'ZAF', name: 'South Africa', coords: [25, -29] },
        { id: 'PRT', name: 'Portugal', coords: [-8, 39] },
    ],
};
