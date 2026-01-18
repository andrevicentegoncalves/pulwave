/**
 * Chart Theme Configuration
 * 
 * TypeScript interface to tokens defined in _tokens.scss
 * 
 * SINGLE SOURCE OF TRUTH: styles/partials/_tokens.scss
 * This file references those CSS custom properties.
 */

// ============================================================================
// CATEGORICAL COLORS - For distinguishing data series
// ============================================================================

export const chartColors = {
    categorical: [
        'var(--chart-color-1)',
        'var(--chart-color-2)',
        'var(--chart-color-3)',
        'var(--chart-color-4)',
        'var(--chart-color-5)',
        'var(--chart-color-6)',
        'var(--chart-color-7)',
        'var(--chart-color-8)',
        'var(--chart-color-9)',
    ],

    status: {
        success: 'var(--chart-status-success)',
        warning: 'var(--chart-status-warning)',
        error: 'var(--chart-status-error)',
        critical: 'var(--chart-status-critical)',
        info: 'var(--chart-status-info)',
        neutral: 'var(--chart-status-neutral)',
        active: 'var(--chart-status-active)',
    },

    sequential: {
        primary: [
            'var(--chart-sequential-primary-1)',
            'var(--chart-sequential-primary-2)',
            'var(--chart-sequential-primary-3)',
        ],
        neutral: [
            'var(--chart-sequential-neutral-1)',
            'var(--chart-sequential-neutral-2)',
            'var(--chart-sequential-neutral-3)',
        ],
    },

    diverging: [
        'var(--chart-diverging-1)',
        'var(--chart-diverging-2)',
        'var(--chart-diverging-3)',
        'var(--chart-diverging-4)',
        'var(--chart-diverging-5)',
    ],
};

// ============================================================================
// SEMANTIC UI TOKENS
// ============================================================================

export const chartTokens = {
    // Text
    textColor: 'var(--chart-text-color)',
    textMutedColor: 'var(--chart-text-muted-color)',
    textInverseColor: 'var(--chart-text-inverse-color)',

    // Structure
    axisColor: 'var(--chart-axis-color)',
    gridColor: 'var(--chart-grid-color)',
    borderColor: 'var(--chart-border-color)',

    // Surfaces
    backgroundColor: 'var(--chart-background-color)',
    backgroundElevatedColor: 'var(--chart-background-elevated-color)',
    backgroundSubtleColor: 'var(--chart-background-subtle-color)',

    // Special purpose
    colorInactive: 'var(--chart-color-inactive)',
    colorEmpty: 'var(--chart-color-empty)',
    colorBrand: 'var(--chart-color-brand)',
    overlayColor: 'var(--chart-overlay-color)',

    // Typography
    fontSizeTick: 'var(--chart-font-size-tick)',
    fontSizeLabel: 'var(--chart-font-size-label)',
    fontSizeTitle: 'var(--chart-font-size-title)',
    fontSizeLegend: 'var(--chart-font-size-legend)',
    fontWeightNormal: 'var(--chart-font-weight-normal)',
    fontWeightMedium: 'var(--chart-font-weight-medium)',
    fontWeightBold: 'var(--chart-font-weight-bold)',

    // Spacing
    spacingXs: 'var(--chart-spacing-xs)',
    spacingS: 'var(--chart-spacing-s)',
    spacingM: 'var(--chart-spacing-m)',
    spacingL: 'var(--chart-spacing-l)',
    spacingXl: 'var(--chart-spacing-xl)',

    // Border Radius
    radiusS: 'var(--chart-radius-s)',
    radiusM: 'var(--chart-radius-m)',
    radiusL: 'var(--chart-radius-l)',

    // Shadows
    shadowTooltip: 'var(--chart-shadow-tooltip)',
    shadowLegend: 'var(--chart-shadow-legend)',

    // Tooltip
    tooltipBg: 'var(--chart-tooltip-bg)',
    tooltipBorder: 'var(--chart-tooltip-border)',
    tooltipRadius: 'var(--chart-tooltip-radius)',
    tooltipPadding: 'var(--chart-tooltip-padding)',
    tooltipShadow: 'var(--chart-tooltip-shadow)',

    // Legend
    legendGap: 'var(--chart-legend-gap)',
    legendItemPadding: 'var(--chart-legend-item-padding)',
    legendItemRadius: 'var(--chart-legend-item-radius)',
    legendIconSize: 'var(--chart-legend-icon-size)',
    legendHoverBg: 'var(--chart-legend-hover-bg)',

    // Grid & Axis
    gridStroke: 'var(--chart-grid-stroke)',
    gridOpacity: 'var(--chart-grid-opacity)',
    axisStroke: 'var(--chart-axis-stroke)',
    axisTickColor: 'var(--chart-axis-tick-color)',

    // Animation
    animationDuration: 'var(--chart-animation-duration)',
    animationEasing: 'var(--chart-animation-easing)',
};

// ============================================================================
// COMBINED THEME EXPORT
// ============================================================================

export const chartTheme = {
    colors: chartColors,
    tokens: chartTokens,

    // Convenience aliases
    categorical: chartColors.categorical,
    status: chartColors.status,
    sequential: chartColors.sequential,
    diverging: chartColors.diverging,
};

export default chartTheme;
