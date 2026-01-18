/**
 * Portugal Projection Utilities
 * 
 * Functions for projecting Portugal geographic coordinates to SVG space.
 */

export interface Point {
    x: number;
    y: number;
}

/**
 * Project Portugal coordinates to SVG space
 * Centered on Portugal with appropriate scale
 */
export const projectPortugal = (
    lon: number,
    lat: number,
    width: number,
    height: number
): Point => {
    const centerLon = -8;
    const centerLat = 39.5;
    const scale = width / 6;
    const x = (width / 2) + (lon - centerLon) * scale;
    const y = (height / 2) - (lat - centerLat) * scale;
    return { x, y };
};

/**
 * Get bounds for Portugal
 */
export const PORTUGAL_BOUNDS = {
    minLon: -9.5,
    maxLon: -6.2,
    minLat: 36.9,
    maxLat: 42.2,
    // Islands extend further
    withIslands: {
        minLon: -31.5, // Azores
        maxLon: -6.2,
        minLat: 30.0,  // Madeira
        maxLat: 42.2,
    }
};
