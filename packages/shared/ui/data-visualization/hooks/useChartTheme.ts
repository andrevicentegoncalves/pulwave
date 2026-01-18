import { useMemo, CSSProperties } from 'react';
import { useChartContext, ChartConfig } from '../providers/ChartProvider';

interface ChartThemeOverrides {
    colors?: string[];
    semanticColors?: Record<string, string>;
    typography?: any;
    config?: Partial<ChartConfig>;
}

/**
 * useChartTheme Hook
 * Provides resolved theme values for chart styling.
 */
export const useChartTheme = (overrides: ChartThemeOverrides = {}) => {
    const context = useChartContext();

    return useMemo(() => ({
        // Merge context with overrides
        ...context,
        colors: overrides.colors || context.colors,
        semanticColors: { ...context.semanticColors, ...overrides.semanticColors },
        typography: { ...context.typography, ...overrides.typography },

        // Computed style objects for Recharts components
        axisStyle: {
            stroke: context.semanticColors.axis,
            strokeWidth: 1,
            fontSize: 'var(--font-size-caption-s)',
            fontFamily: 'var(--font-family)',
            fontWeight: 400,
            fill: context.semanticColors.text,
        },

        gridStyle: {
            stroke: context.semanticColors.grid,
            strokeDasharray: '3 3',
            strokeOpacity: 0.6,
        },

        tooltipStyle: {
            backgroundColor: context.semanticColors.backgroundElevated,
            border: `1px solid ${context.semanticColors.border}`,
            borderRadius: context.borderRadius.m,
            boxShadow: context.shadows.tooltip,
            padding: context.spacing.m,
            fontSize: 'var(--font-size-caption-m)',
            fontFamily: 'var(--font-family)',
            color: context.semanticColors.text,
        } as CSSProperties,

        legendStyle: {
            fontSize: 'var(--font-size-caption-m)',
            fontFamily: 'var(--font-family)',
            color: context.semanticColors.text,
        } as CSSProperties,
    }), [context, overrides]);
};

export default useChartTheme;
