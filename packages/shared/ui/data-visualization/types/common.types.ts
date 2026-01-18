/**
 * Common Types for Data Visualization
 * 
 * Shared interfaces used across all chart components.
 */

// ============================================================================
// Data Types
// ============================================================================

/** Generic data point with any keys */
export type ChartDataPoint = Record<string, unknown>;

/** Standard data point with name/value */
export interface NameValueDataPoint {
    name: string;
    value: number;
    [key: string]: unknown;
}

/** Time series data point */
export interface TimeSeriesDataPoint {
    date: string | Date;
    [key: string]: unknown;
}

// ============================================================================
// Series Configuration
// ============================================================================

/** Configuration for a data series */
export interface SeriesConfig {
    /** Data key to read values from */
    key: string;
    /** Display name for legend/tooltip */
    name?: string;
    /** Override color for this series */
    color?: string;
    /** Whether series is initially hidden */
    hidden?: boolean;
}

/** Extended series config for cartesian charts */
export interface CartesianSeriesConfig extends SeriesConfig {
    /** Series type (for combo charts) */
    type?: 'line' | 'bar' | 'area';
    /** Which Y-axis this series belongs to */
    yAxisId?: string;
}

// ============================================================================
// Common Props
// ============================================================================

/** Base props shared by all chart components */
export interface BaseChartProps {
    /** Chart width (number in px or string like '100%') */
    width?: string | number;
    /** Chart height in px */
    height?: number;
    /** Additional CSS class name */
    className?: string;
    /** Accessibility label */
    ariaLabel?: string;
    /** Enable animations */
    animate?: boolean;
    /** Animation duration in ms */
    animationDuration?: number;
}

/** Props for charts with X/Y axes */
export interface CartesianChartProps extends BaseChartProps {
    /** Data array */
    data: ChartDataPoint[];
    /** Key for X-axis values */
    xKey: string;
    /** Keys for Y-axis values (series) */
    yKeys: string[];
    /** Display names mapping for Y keys */
    yKeyNames?: Record<string, string>;
    /** Show grid lines */
    showGrid?: boolean;
    /** Show X axis */
    showXAxis?: boolean;
    /** Show Y axis */
    showYAxis?: boolean;
    /** Show tooltip on hover */
    showTooltip?: boolean;
    /** Show legend */
    showLegend?: boolean;
    /** Legend position */
    legendPosition?: 'top' | 'bottom';
    /** Custom colors array */
    colors?: string[];
    /** X-axis tick formatter */
    xAxisFormatter?: (value: unknown) => string;
    /** Y-axis tick formatter */
    yAxisFormatter?: (value: unknown) => string;
    /** Tooltip value formatter */
    tooltipFormatter?: TooltipFormatter;
}

/** Props for radial/pie charts */
export interface RadialChartProps extends BaseChartProps {
    /** Data array */
    data: NameValueDataPoint[];
    /** Key for name/category */
    nameKey?: string;
    /** Key for value */
    valueKey?: string;
    /** Inner radius (0 for pie, >0 for donut) */
    innerRadius?: number | string;
    /** Outer radius */
    outerRadius?: number | string;
    /** Show tooltip */
    showTooltip?: boolean;
    /** Show legend */
    showLegend?: boolean;
    /** Legend position */
    legendPosition?: 'top' | 'bottom';
    /** Custom colors array */
    colors?: string[];
}

// ============================================================================
// Axis Types
// ============================================================================

/** Axis configuration */
export interface AxisConfig {
    /** Show axis line */
    axisLine?: boolean;
    /** Show tick lines */
    tickLine?: boolean;
    /** Tick formatter function */
    formatter?: (value: unknown) => string;
    /** Axis label */
    label?: string;
    /** Domain for numeric axes */
    domain?: [number | string, number | string];
}

// ============================================================================
// Legend Types
// ============================================================================

/** Legend payload item */
export interface LegendPayloadItem {
    value: string;
    dataKey?: string;
    color: string;
    inactive?: boolean;
}

// ============================================================================
// Tooltip Types
// ============================================================================

/** Tooltip formatter function signature */
export type TooltipFormatter = (
    value: unknown,
    name: string,
    entry: unknown,
    index: number
) => any;

/** Label formatter function signature */
export type LabelFormatter = (label: unknown) => string;

// ============================================================================
// Event Types
// ============================================================================

/** Chart click event data */
export interface ChartClickEvent<T = ChartDataPoint> {
    /** Data point that was clicked */
    data: T;
    /** Index in data array */
    index: number;
    /** Native event */
    event?: React.MouseEvent;
}

/** Legend click event data */
export interface LegendClickEvent {
    dataKey: string;
    value: string;
}
