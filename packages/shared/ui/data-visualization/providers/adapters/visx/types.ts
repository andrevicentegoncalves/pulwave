/**
 * VISX Adapter Types
 *
 * Type definitions for visx adapter components.
 */

import type { ReactNode } from 'react';

/**
 * Common props shared by visx chart components
 */
export interface VISXChartBaseProps {
    width?: number | string;
    height?: number | string;
    children?: ReactNode;
    margin?: { top: number; right: number; bottom: number; left: number };
}

/**
 * Data point type for XY charts
 */
export interface XYDataPoint {
    [key: string]: any;
}

/**
 * Axis configuration
 */
export interface AxisConfig {
    dataKey?: string;
    type?: 'number' | 'category';
    domain?: [number | string, number | string];
    label?: string;
    tickFormat?: (value: any) => string;
    hide?: boolean;
}

/**
 * Series configuration
 */
export interface SeriesConfig {
    dataKey: string;
    color?: string;
    name?: string;
    fill?: string;
    stroke?: string;
}

/**
 * Grid configuration
 */
export interface GridConfig {
    rows?: boolean;
    columns?: boolean;
    stroke?: string;
    strokeDasharray?: string;
}

/**
 * Tooltip configuration
 */
export interface TooltipConfig {
    snapToDataX?: boolean;
    snapToDataY?: boolean;
    showVerticalCrosshair?: boolean;
    showHorizontalCrosshair?: boolean;
    renderTooltip?: (tooltipData: any) => ReactNode;
}

/**
 * Legend configuration
 */
export interface LegendConfig {
    direction?: 'row' | 'column';
    itemDirection?: 'left-to-right' | 'top-to-bottom';
    labelFormat?: (label: string, index: number) => string;
}
