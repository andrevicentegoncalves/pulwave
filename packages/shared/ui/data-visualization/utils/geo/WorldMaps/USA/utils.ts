/**
 * USA Projection Utilities
 */

export interface Point {
    x: number;
    y: number;
}

/**
 * Project US coordinates (Albers USA projection simplified)
 */
export const projectUS = (
    lon: number,
    lat: number,
    width: number,
    height: number
): Point => {
    const centerLon = -98;
    const centerLat = 39;
    const scale = width / 65;
    const x = (width / 2) + (lon - centerLon) * scale * Math.cos(centerLat * Math.PI / 180);
    const y = (height / 2) - (lat - centerLat) * scale;
    return { x, y };
};

/**
 * USA mainland bounds
 */
export const USA_BOUNDS = {
    minLon: -125,
    maxLon: -66,
    minLat: 24,
    maxLat: 50,
    // Including Alaska and Hawaii
    withTerritories: {
        minLon: -180,
        maxLon: -66,
        minLat: 18,
        maxLat: 72,
    }
};
