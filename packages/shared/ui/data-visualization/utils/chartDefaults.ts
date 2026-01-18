/**
 * Chart Defaults Utilities
 * 
 * Shared default configurations for chart axis, grid, margins, and animations.
 * Reduces code duplication across 60+ chart components.
 */

interface SemanticColors {
    text: string;
    textMuted: string;
    axis: string;
    border: string;
    background: string;
}

/**
 * Get standard tick styling for chart axes
 */
export const getAxisTickStyle = (semanticColors: SemanticColors, fontSize = 12) => ({
    fill: semanticColors.textMuted,
    fontSize,
});

/**
 * Get default axis configuration
 */
export const getAxisDefaults = (semanticColors: SemanticColors, options?: { showAxisLine?: boolean }) => ({
    axisLine: options?.showAxisLine !== false ? { stroke: semanticColors.axis } : false,
    tickLine: false,
    tick: getAxisTickStyle(semanticColors),
});

/**
 * Get X-axis specific defaults
 */
export const getXAxisDefaults = (semanticColors: SemanticColors) => ({
    ...getAxisDefaults(semanticColors, { showAxisLine: true }),
    dy: 8,
});

/**
 * Get Y-axis specific defaults
 */
export const getYAxisDefaults = (semanticColors: SemanticColors) => ({
    ...getAxisDefaults(semanticColors, { showAxisLine: false }),
    dx: -8,
});

/**
 * Get standard chart margins
 */
export const getChartMargins = (options?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    showLegend?: boolean;
    isHorizontal?: boolean;
    hasDualAxis?: boolean;
    hasAxisLabels?: boolean;
}) => ({
    top: options?.top ?? 10,
    right: options?.right ?? (options?.hasDualAxis ? 40 : 10),
    left: options?.left ?? (options?.isHorizontal ? 80 : (options?.hasAxisLabels ? 60 : 0)),
    bottom: options?.bottom ?? (options?.showLegend ? 30 : (options?.hasAxisLabels ? 40 : 0)),
});

/**
 * Get cursor style for tooltip hover
 */
export const getCursorStyle = (semanticColors: SemanticColors) => ({
    fill: semanticColors.border,
    opacity: 0.1,
});

/**
 * Get animation defaults
 */
export const getAnimationDefaults = (animate = true, duration = 400) => ({
    isAnimationActive: animate,
    animationDuration: duration,
});

/**
 * Get ResponsiveContainer defaults
 */
export const getResponsiveContainerDefaults = (width: string | number = '100%', height: number = 300) => ({
    width,
    height,
    minWidth: 0,
    minHeight: 0,
    debounce: 1,
});
