import React, { createContext, useContext, useMemo, ReactNode } from 'react';

import { chartTheme } from '../theme/theme';
import type { ChartLibraryComponents } from './ChartLibrary.types';
import type { ChartAdapter } from '../primitives/types';
import { RechartsAdapter, RechartsPrimitivesAdapter } from './adapters';

/**
 * Chart Context
 * Provides theme, configuration, library components, and shared state to all chart components.
 */
interface ChartContextValue {
    theme: 'light' | 'dark' | 'auto';
    colorScheme: ColorScheme;
    colors: string[];
    config: ChartConfig;
    semanticColors: SemanticColors;
    typography: ChartTypography;
    spacing: ChartSpacing;
    borderRadius: ChartBorderRadius;
    shadows: ChartShadows;
    getColor: (index: number) => string;
    getColors: (count: number) => string[];
    /** Chart library components (Recharts by default) - Legacy interface */
    components: ChartLibraryComponents;
    /** Chart adapter with primitives (new interface) */
    adapter: ChartAdapter;
}

const ChartContext = createContext<ChartContextValue | null>(null);

// Export context for useChartPrimitives hook
export { ChartContext };

export type ColorScheme = 'categorical' | 'sequential' | 'diverging' | 'success' | 'warning' | 'error';

/**
 * Chart color palettes derived from design system tokens
 */
const COLOR_PALETTES: Record<ColorScheme, string[]> = {
    categorical: chartTheme.categorical,
    sequential: chartTheme.sequential.primary,
    diverging: chartTheme.diverging,
    success: [chartTheme.status.success],
    warning: [chartTheme.status.warning],
    error: [chartTheme.status.error],
};

export interface ChartConfig {
    animate: boolean;
    animationDuration: number;
    animationEasing: string;
    responsive: boolean;
    showGrid: boolean;
    showTooltip: boolean;
    showLegend: boolean;
}

/**
 * Default chart configuration
 */
const DEFAULT_CONFIG: ChartConfig = {
    animate: true,
    animationDuration: 400,
    animationEasing: 'ease-out',
    responsive: true,
    showGrid: true,
    showTooltip: true,
    showLegend: true,
};

export interface SemanticColors {
    grid: string;
    axis: string;
    text: string;
    textMuted: string;
    background: string;
    backgroundElevated: string;
    border: string;
    primary: string;
    success: string;
    warning: string;
    error: string;
}

export interface ChartTypography {
    fontFamily: string;
    fontSize: {
        label: string;
        tick: string;
        title: string;
        legend: string;
    };
    fontWeight: {
        normal: string;
        medium: string;
        bold: string;
    };
}

export interface ChartSpacing {
    xs: string;
    s: string;
    m: string;
    l: string;
    xl: string;
}

export interface ChartBorderRadius {
    s: string;
    m: string;
    l: string;
    xl: string;
}

export interface ChartShadows {
    tooltip: string;
    legend: string;
}

export interface ChartProviderProps {
    children: ReactNode;
    theme?: 'light' | 'dark' | 'auto';
    colorScheme?: ColorScheme;
    config?: Partial<ChartConfig>;
    /**
     * Legacy chart library adapter (defaults to Recharts).
     * Use this for the old ChartLibraryComponents interface.
     * @deprecated Use `primitivesAdapter` for new charts.
     */
    adapter?: ChartLibraryComponents;
    /**
     * New primitives adapter with ChartAdapter interface.
     * Use this for library-agnostic charts with useChartPrimitives().
     */
    primitivesAdapter?: ChartAdapter;
}

/**
 * ChartProvider Component
 * Wraps chart components to provide theming, configuration, and library components.
 * 
 * @example
 * // Default Recharts
 * <ChartProvider>
 *   <AreaChart data={data}>...</AreaChart>
 * </ChartProvider>
 * 
 * // Custom adapter
 * <ChartProvider adapter={VictoryAdapter}>
 *   <AreaChart data={data}>...</AreaChart>
 * </ChartProvider>
 */
export const ChartProvider = ({
    children,
    theme = 'auto',
    colorScheme = 'categorical',
    config = {},
    adapter = RechartsAdapter,
    primitivesAdapter = RechartsPrimitivesAdapter,
}: ChartProviderProps) => {
    const value = useMemo<ChartContextValue>(() => ({
        // Theme
        theme,
        colorScheme,
        colors: COLOR_PALETTES[colorScheme] || COLOR_PALETTES.categorical,

        // Configuration (merged with defaults)
        config: { ...DEFAULT_CONFIG, ...config },

        // Semantic colors from design system
        semanticColors: {
            grid: chartTheme.tokens.gridColor,
            axis: chartTheme.tokens.axisColor,
            text: chartTheme.tokens.textColor,
            textMuted: chartTheme.tokens.textMutedColor,
            background: chartTheme.tokens.backgroundColor,
            backgroundElevated: chartTheme.tokens.backgroundElevatedColor,
            border: chartTheme.tokens.borderColor,
            primary: chartTheme.tokens.colorBrand,
            success: chartTheme.status.success,
            warning: chartTheme.status.warning,
            error: chartTheme.status.error,
        },

        // Typography from design system
        typography: {
            fontFamily: 'Inter, sans-serif',
            fontSize: {
                label: chartTheme.tokens.fontSizeLabel,
                tick: chartTheme.tokens.fontSizeTick,
                title: chartTheme.tokens.fontSizeTitle,
                legend: chartTheme.tokens.fontSizeLegend,
            },
            fontWeight: {
                normal: chartTheme.tokens.fontWeightNormal,
                medium: chartTheme.tokens.fontWeightMedium,
                bold: chartTheme.tokens.fontWeightBold,
            },
        },

        // Spacing from design system
        spacing: {
            xs: chartTheme.tokens.spacingXs,
            s: chartTheme.tokens.spacingS,
            m: chartTheme.tokens.spacingM,
            l: chartTheme.tokens.spacingL,
            xl: chartTheme.tokens.spacingXl,
        },

        // Border radius from design system
        borderRadius: {
            s: chartTheme.tokens.radiusS,
            m: chartTheme.tokens.radiusM,
            l: chartTheme.tokens.radiusL,
            xl: chartTheme.tokens.radiusL, // fallback
        },

        // Shadows from design system
        shadows: {
            tooltip: chartTheme.tokens.shadowTooltip,
            legend: chartTheme.tokens.shadowLegend,
        },

        // Get color by index (cycles through palette)
        getColor: (index: number) => {
            const colors = COLOR_PALETTES[colorScheme] || COLOR_PALETTES.categorical;
            return colors[index % colors.length];
        },

        // Get all colors for a series count
        getColors: (count: number) => {
            const colors = COLOR_PALETTES[colorScheme] || COLOR_PALETTES.categorical;
            return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
        },

        // Chart library components (legacy)
        components: adapter,

        // New primitives adapter
        adapter: primitivesAdapter,
    }), [theme, colorScheme, config, adapter, primitivesAdapter]);

    return (
        <ChartContext.Provider value={value}>
            {children}
        </ChartContext.Provider>
    );
};

export const useChartContext = () => {
    const context = useContext(ChartContext);

    // Return defaults if no provider (allows standalone usage)
    if (!context) {
        return {
            theme: 'auto',
            colorScheme: 'categorical',
            colors: COLOR_PALETTES.categorical,
            config: DEFAULT_CONFIG,
            semanticColors: {
                grid: chartTheme.tokens.gridColor,
                axis: chartTheme.tokens.axisColor,
                text: chartTheme.tokens.textColor,
                textMuted: chartTheme.tokens.textMutedColor,
                background: chartTheme.tokens.backgroundColor,
                backgroundElevated: chartTheme.tokens.backgroundElevatedColor,
                border: chartTheme.tokens.borderColor,
                primary: chartTheme.tokens.colorBrand,
                success: chartTheme.status.success,
                warning: chartTheme.status.warning,
                error: chartTheme.status.error,
            },
            typography: {
                fontFamily: 'Inter, sans-serif',
                fontSize: {
                    label: chartTheme.tokens.fontSizeLabel,
                    tick: chartTheme.tokens.fontSizeTick,
                    title: chartTheme.tokens.fontSizeTitle,
                    legend: chartTheme.tokens.fontSizeLegend,
                },
                fontWeight: {
                    normal: chartTheme.tokens.fontWeightNormal,
                    medium: chartTheme.tokens.fontWeightMedium,
                    bold: chartTheme.tokens.fontWeightBold,
                },
            },
            spacing: {
                xs: chartTheme.tokens.spacingXs,
                s: chartTheme.tokens.spacingS,
                m: chartTheme.tokens.spacingM,
                l: chartTheme.tokens.spacingL,
                xl: chartTheme.tokens.spacingXl,
            },
            borderRadius: {
                s: chartTheme.tokens.radiusS,
                m: chartTheme.tokens.radiusM,
                l: chartTheme.tokens.radiusL,
                xl: chartTheme.tokens.radiusL, // fallback
            },
            shadows: {
                tooltip: chartTheme.tokens.shadowTooltip,
                legend: chartTheme.tokens.shadowLegend,
            },
            getColor: (index: number) => COLOR_PALETTES.categorical[index % COLOR_PALETTES.categorical.length],
            getColors: (count: number) => Array.from({ length: count }, (_, i) => COLOR_PALETTES.categorical[i % COLOR_PALETTES.categorical.length]),
            components: RechartsAdapter,
            adapter: RechartsPrimitivesAdapter,
        } as ChartContextValue;
    }

    return context;
};

/**
 * useChartAdapter
 * Access the current primitives adapter.
 *
 * @example
 * const { primitives, capabilities, adapterId } = useChartAdapter();
 */
export const useChartAdapter = (): ChartAdapter => {
    const { adapter } = useChartContext();
    return adapter;
};

/**
 * useChartComponents
 * Shorthand hook to access chart library components.
 *
 * @example
 * const { Line, Bar, Area } = useChartComponents();
 */
export const useChartComponents = (): ChartLibraryComponents => {
    const { components } = useChartContext();
    return components;
};

/**
 * useChartLibrary
 * Alias for useChartComponents - access chart library components.
 * Use this hook in chart components to support both Recharts and visx.
 *
 * @example
 * const { BarChart, Bar, XAxis, YAxis } = useChartLibrary();
 */
export const useChartLibrary = useChartComponents;
