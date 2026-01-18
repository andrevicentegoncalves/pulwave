/**
 * World Projection Utilities
 */

export interface Point {
    x: number;
    y: number;
}

/**
 * Project world coordinates to SVG space (Mercator-like)
 */
export const projectWorld = (
    lon: number,
    lat: number,
    width: number,
    height: number
): Point => {
    const x = ((lon + 180) / 360) * width;
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = (height / 2) - (width * mercN / (2 * Math.PI));
    return {
        x: Math.max(0, Math.min(width, x)),
        y: Math.max(0, Math.min(height, y))
    };
};

/**
 * EU projection utilities
 */
export const projectEU = (
    lon: number,
    lat: number,
    width: number,
    height: number
): Point => {
    const centerLon = 10;
    const centerLat = 50;
    const scale = width / 50;
    const x = (width / 2) + (lon - centerLon) * scale;
    const y = (height / 2) - (lat - centerLat) * scale;
    return { x, y };
};

/**
 * World bounds
 */
export const WORLD_BOUNDS = {
    minLon: -180,
    maxLon: 180,
    minLat: -60,
    maxLat: 85,
};

/**
 * Color scale presets for choropleth maps
 */
export const COLOR_SCALES = {
    blue: ['#EFF6FF', '#BFDBFE', '#60A5FA', '#2563EB', '#1E40AF'],
    green: ['#F0FDF4', '#BBF7D0', '#4ADE80', '#16A34A', '#166534'],
    red: ['#FEF2F2', '#FECACA', '#F87171', '#DC2626', '#991B1B'],
    orange: ['#FFF7ED', '#FED7AA', '#FB923C', '#EA580C', '#9A3412'],
    purple: ['#FAF5FF', '#E9D5FF', '#A855F7', '#7C3AED', '#5B21B6'],
    teal: ['#F0FDFA', '#99F6E4', '#2DD4BF', '#0D9488', '#0F766E'],
};

/**
 * Get color from scale based on value
 */
export const getColorFromScale = (
    value: number,
    min: number,
    max: number,
    scheme: keyof typeof COLOR_SCALES = 'blue'
): string => {
    const colors = COLOR_SCALES[scheme];
    const normalized = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
    const index = Math.floor(normalized * (colors.length - 1));
    return colors[index];
};
