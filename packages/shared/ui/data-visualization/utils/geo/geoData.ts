/**
 * Geo Data Utils
 * 
 * Re-exporting from topojson.ts to maintain backward compatibility
 * or providing specific adapter functions.
 */

export * from './topojson';

import { createColorScale, SIMPLE_WORLD_DATA } from './topojson';

// Adapters for existing code expecting different names
export const getColorFromScale = (value: number, min: number, max: number, scale: string) => {
    // Basic mapping using createColorScale
    // This is a quick adapter to avoid rewriting all charts if possible,
    // but better to align naming.
    // For now, let's keep it simple.

    // In topojson.ts: createColorScale(values, colors) -> function(value) -> color string
    // Here we need a one-off function.

    const colorScale = createColorScale([min, max]); // Default blue scale
    return colorScale(value);
};

import chartTheme from '../../theme/theme';

export const generateLegendStops = (min: number, max: number, scale: string) => {
    // Use theme tokens
    // We'll use the primary sequential scale as default
    const colorStart = chartTheme.colors.sequential.primary[0]; // Lightest
    const colorEnd = chartTheme.colors.sequential.primary[2];   // Darkest

    return [
        { color: colorStart, offset: '0%' },
        { color: colorEnd, offset: '100%' },
    ];
};

export const WORLD_COUNTRIES = SIMPLE_WORLD_DATA.countries.reduce<Record<string, { id: string; name: string; coords: number[] }>>((acc, country) => {
    acc[country.id] = country;
    return acc;
}, {});

export { projectCoordinates as projectWorld } from './topojson';
