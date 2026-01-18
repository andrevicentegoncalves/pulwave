import { useMemo } from 'react';
import { useChartContext } from '../providers/ChartProvider';

/**
 * Singleton element for color resolution.
 * Uses a hidden element to properly resolve CSS variables to computed colors.
 */
let colorResolverElement: HTMLDivElement | null = null;

const getColorResolver = (): HTMLDivElement | null => {
    if (typeof window === 'undefined') return null;

    if (!colorResolverElement) {
        colorResolverElement = document.createElement('div');
        colorResolverElement.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;width:0;height:0;';
        document.body.appendChild(colorResolverElement);
    }
    return colorResolverElement;
};

/**
 * Resolves any CSS color value (including CSS variables) to its computed RGB value.
 *
 * This works by setting the value as backgroundColor on a hidden element,
 * then reading the computed style which returns the fully resolved color.
 *
 * Example resolution chain:
 *   var(--chart-color-1)
 *   → var(--color-brand-primary)
 *   → var(--color-primary-600)
 *   → hsl(var(--primary-h), var(--primary-s), 27%)
 *   → rgb(4, 134, 96)  ← final computed value
 *
 * @public Exported for use in other chart components that need to resolve CSS variables for SVG
 */
export const resolveCssColor = (value: string): string => {
    if (typeof window === 'undefined') {
        return value;
    }

    // If it doesn't contain var(), it's already resolved (hex, rgb, hsl, named color)
    if (!value.includes('var(')) {
        return value;
    }

    const resolver = getColorResolver();
    if (!resolver) {
        return value;
    }

    try {
        // Apply the color value (which may contain CSS variables)
        resolver.style.backgroundColor = value;

        // Get the computed (fully resolved) color
        const computed = getComputedStyle(resolver).backgroundColor;

        // Reset for next use
        resolver.style.backgroundColor = '';

        // getComputedStyle returns colors in rgb() or rgba() format
        // Return the computed value if it's a valid color (not transparent/unset)
        if (computed && computed !== 'rgba(0, 0, 0, 0)' && computed !== 'transparent') {
            return computed;
        }
    } catch {
        // Silently fall through to return original value
    }

    return value;
};

/**
 * useChartColors Hook
 *
 * Centralizes the color resolution pattern used across all charts.
 * Handles custom colors override or falls back to theme colors.
 *
 * IMPORTANT: This hook resolves CSS variables to actual color values
 * because Recharts uses inline SVG attributes which don't support CSS custom properties.
 *
 * @param count - Number of colors needed (typically yKeys.length or data.length)
 * @param customColors - Optional custom colors array to override theme
 * @returns Resolved array of actual color values (not CSS variables)
 *
 * @example
 * const colors = useChartColors(yKeys.length, props.colors);
 */
export const useChartColors = (
    count: number,
    customColors?: string[]
): string[] => {
    const { getColors } = useChartContext();

    // Get colors and resolve CSS variables synchronously
    // This is safe because getComputedStyle is synchronous
    return useMemo(() => {
        const rawColors = customColors || getColors(count);
        return rawColors.map(resolveCssColor);
    }, [customColors, getColors, count]);
};

export default useChartColors;
