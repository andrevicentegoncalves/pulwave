import { useMemo, useCallback } from 'react';
import { useChartContext } from '../providers/ChartProvider';

export type ColorScaleType = 'sequential' | 'diverging' | 'categorical';

export interface ColorScaleOptions {
    /** Type of color scale */
    type?: ColorScaleType;
    /** Minimum value in the data range */
    min?: number;
    /** Maximum value in the data range */
    max?: number;
    /** Custom color stops (overrides type) */
    colors?: string[];
    /** Number of discrete steps (undefined = continuous) */
    steps?: number;
}

export interface ColorScaleResult {
    /** Get color for a given value */
    getColor: (value: number | null | undefined) => string;
    /** Get text color (for contrast) based on background color */
    getTextColor: (bgColor: string) => string;
    /** Color stops for legend rendering */
    colorStops: string[];
    /** Normalized min value */
    min: number;
    /** Normalized max value */
    max: number;
}

// Default color palettes using chart tokens
const SEQUENTIAL_COLORS = [
    'var(--chart-sequential-primary-1)',
    'var(--chart-sequential-primary-2)',
    'var(--chart-sequential-primary-3)',
];

const DIVERGING_COLORS = [
    'var(--chart-diverging-1)',
    'var(--chart-diverging-2)',
    'var(--chart-diverging-3)',
    'var(--chart-diverging-4)',
    'var(--chart-diverging-5)',
];

/**
 * useColorScale Hook
 * 
 * Provides color interpolation for heatmaps, choropleths, and gauges.
 * Uses chart tokens from theme/_tokens.scss.
 * 
 * @example
 * const { getColor, getTextColor, colorStops } = useColorScale({
 *   type: 'sequential',
 *   min: 0,
 *   max: 100,
 * });
 * 
 * // In render:
 * <div style={{ backgroundColor: getColor(value) }}>
 *   <span style={{ color: getTextColor(getColor(value)) }}>{value}</span>
 * </div>
 */
export const useColorScale = ({
    type = 'sequential',
    min = 0,
    max = 100,
    colors,
    steps,
}: ColorScaleOptions = {}): ColorScaleResult => {
    const { colors: themeColors } = useChartContext();

    // Determine color stops
    const colorStops = useMemo(() => {
        if (colors && colors.length >= 2) return colors;

        switch (type) {
            case 'diverging':
                return DIVERGING_COLORS;
            case 'categorical':
                return themeColors;
            case 'sequential':
            default:
                return SEQUENTIAL_COLORS;
        }
    }, [colors, type, themeColors]);

    // Get color for a value
    const getColor = useCallback((value: number | null | undefined): string => {
        if (value == null) return 'var(--chart-background-subtle-color)';

        const range = max - min;
        if (range === 0) return colorStops[Math.floor(colorStops.length / 2)];

        const ratio = Math.min(1, Math.max(0, (value - min) / range));

        // If steps defined, use discrete colors
        if (steps && steps > 0) {
            const stepIndex = Math.min(steps - 1, Math.floor(ratio * steps));
            const colorIndex = Math.floor((stepIndex / (steps - 1)) * (colorStops.length - 1));
            return colorStops[colorIndex];
        }

        // Continuous interpolation - pick from color stops
        const colorIndex = Math.floor(ratio * (colorStops.length - 1));
        return colorStops[Math.min(colorIndex, colorStops.length - 1)];
    }, [min, max, colorStops, steps]);

    // Get contrasting text color
    const getTextColor = useCallback((bgColor: string): string => {
        // Light backgrounds need dark text
        const lightPatterns = ['subtle', '100', '200', '300', 'neutral-2', 'surface', '-1'];
        const isLight = lightPatterns.some(p => bgColor.includes(p));
        return isLight ? 'var(--chart-text-color)' : 'var(--chart-text-inverse-color)';
    }, []);

    return {
        getColor,
        getTextColor,
        colorStops,
        min,
        max,
    };
};

export default useColorScale;
