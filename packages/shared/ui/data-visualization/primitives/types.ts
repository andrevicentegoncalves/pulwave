/**
 * Chart Primitives Type Definitions
 *
 * Library-agnostic interfaces for chart primitives.
 * Adapters implement these interfaces for each library (Recharts, VISX, etc.)
 */
import { type ComponentType, type ReactNode } from 'react';

// =============================================================================
// CORE TYPES
// =============================================================================

export type DataPoint = Record<string, unknown>;
export type DataAccessor<T = unknown> = (d: DataPoint, index: number) => T;

export interface ChartMargins {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

// =============================================================================
// SCALE TYPES
// =============================================================================

export type ScaleType = 'linear' | 'log' | 'pow' | 'sqrt' | 'time' | 'band' | 'point' | 'ordinal';

export interface ScaleConfig {
    type: ScaleType;
    domain?: [number, number] | string[];
    range?: [number, number];
    nice?: boolean;
    padding?: number;
    paddingInner?: number;
    paddingOuter?: number;
}

// =============================================================================
// CANVAS PROPS (Chart Container)
// =============================================================================

export interface ChartCanvasProps {
    /** Chart data array */
    data?: DataPoint[];
    /** Chart width (number or '100%') */
    width?: number | string;
    /** Chart height */
    height?: number;
    /** Chart margins */
    margin?: Partial<ChartMargins>;
    /** X-axis scale configuration */
    xScale?: ScaleConfig;
    /** Y-axis scale configuration */
    yScale?: ScaleConfig;
    /** Whether to animate */
    animate?: boolean;
    /** Children (series, axes, etc.) */
    children?: ReactNode;
    /** Additional class name */
    className?: string;
}

// =============================================================================
// SERIES PROPS
// =============================================================================

export interface BaseSeriesProps {
    /** Key in data for this series values */
    dataKey: string;
    /** Data array (optional, inherits from parent) */
    data?: DataPoint[];
    /** Series display name */
    name?: string;
    /** Series color */
    color?: string;
    /** Opacity (0-1) */
    opacity?: number;
    /** Whether to animate */
    animate?: boolean;
    /** Animation duration in ms */
    animationDuration?: number;
    /** Hide this series */
    hide?: boolean;
    /** Children (cells, labels, etc.) */
    children?: ReactNode;
}

export interface BarSeriesProps extends BaseSeriesProps {
    /** Fill color (alias for color) */
    fill?: string;
    /** Stroke color */
    stroke?: string;
    /** Stroke width */
    strokeWidth?: number;
    /** Corner radius */
    radius?: number | [number, number, number, number];
    /** Max bar width */
    maxBarSize?: number;
    /** Bar size (width) */
    barSize?: number | string;
    /** Stack ID for stacking */
    stackId?: string;
    /** Background behind bars */
    background?: boolean | { fill?: string };
    /** Per-bar colors */
    colors?: string[];
}

export interface LineSeriesProps extends BaseSeriesProps {
    /** Stroke color (alias for color) */
    stroke?: string;
    /** Stroke width */
    strokeWidth?: number;
    /** Line type: linear, monotone, step, etc. */
    type?: 'linear' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter' | 'basis' | 'natural';
    /** Show data points */
    dot?: boolean | React.ReactElement;
    /** Active dot style */
    activeDot?: boolean | React.ReactElement;
    /** Connect null data points */
    connectNulls?: boolean;
}

export interface AreaSeriesProps extends LineSeriesProps {
    /** Fill color for area */
    fill?: string;
    /** Fill opacity */
    fillOpacity?: number;
    /** Stack ID for stacking */
    stackId?: string;
    /** Baseline for area: 0 means fill to zero, 'dataMin' to min value */
    baseValue?: number | 'dataMin' | 'dataMax' | 'auto';
}

export interface ScatterSeriesProps extends BaseSeriesProps {
    /** Fill color */
    fill?: string;
    /** X-axis data key */
    xDataKey?: string;
    /** Y-axis data key */
    yDataKey?: string;
    /** Z-axis data key (for size) */
    zDataKey?: string;
    /** Point shape */
    shape?: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye' | React.ReactElement;
}

export interface PieSeriesProps extends BaseSeriesProps {
    /** Inner radius (for donut) */
    innerRadius?: number | string;
    /** Outer radius */
    outerRadius?: number | string;
    /** Start angle in degrees */
    startAngle?: number;
    /** End angle in degrees */
    endAngle?: number;
    /** Padding angle between slices */
    paddingAngle?: number;
    /** Label key or custom label */
    label?: boolean | string | React.ReactElement;
    /** Label line */
    labelLine?: boolean;
    /** Corner radius */
    cornerRadius?: number;
    /** Per-slice colors */
    colors?: string[];
}

export interface RadarSeriesProps extends BaseSeriesProps {
    /** Fill color */
    fill?: string;
    /** Fill opacity */
    fillOpacity?: number;
    /** Stroke color */
    stroke?: string;
    /** Stroke width */
    strokeWidth?: number;
    /** Show dots */
    dot?: boolean | React.ReactElement;
}

// =============================================================================
// AXIS PROPS
// =============================================================================

export interface AxisProps {
    /** Axis orientation */
    orientation: 'top' | 'bottom' | 'left' | 'right';
    /** Data key for this axis */
    dataKey?: string;
    /** Axis type */
    type?: 'number' | 'category';
    /** Domain [min, max] or 'auto' */
    domain?: [number | 'auto' | 'dataMin' | 'dataMax', number | 'auto' | 'dataMin' | 'dataMax'];
    /** Number of ticks */
    tickCount?: number;
    /** Custom tick values */
    ticks?: (string | number)[];
    /** Format tick values */
    tickFormatter?: (value: unknown, index: number) => string;
    /** Tick size */
    tickSize?: number;
    /** Axis label */
    label?: string | { value: string; angle?: number; position?: string };
    /** Hide axis */
    hide?: boolean;
    /** Axis line stroke color */
    stroke?: string;
    /** Tick line stroke color */
    tickStroke?: string;
    /** Tick text color */
    tickColor?: string;
    /** Tick font size */
    tickFontSize?: number;
    /** Allow data overflow */
    allowDataOverflow?: boolean;
    /** Include zero in domain */
    includeHidden?: boolean;
}

export type XAxisProps = Omit<AxisProps, 'orientation'> & {
    orientation?: 'top' | 'bottom';
};

export type YAxisProps = Omit<AxisProps, 'orientation'> & {
    orientation?: 'left' | 'right';
    /** Y-axis ID for multi-axis charts */
    yAxisId?: string | number;
};

// =============================================================================
// GRID PROPS
// =============================================================================

export interface GridProps {
    /** Show horizontal grid lines */
    horizontal?: boolean;
    /** Show vertical grid lines */
    vertical?: boolean;
    /** Stroke color */
    stroke?: string;
    /** Stroke dash array */
    strokeDasharray?: string;
    /** Stroke opacity */
    strokeOpacity?: number;
}

// =============================================================================
// TOOLTIP PROPS
// =============================================================================

export interface TooltipProps<T = DataPoint> {
    /** Show tooltip */
    active?: boolean;
    /** Custom content renderer */
    content?: React.ReactElement | ((props: TooltipPayload<T>) => ReactNode);
    /** Cursor style */
    cursor?: boolean | React.ReactElement | { stroke?: string; strokeWidth?: number };
    /** Trigger: hover, click, or none */
    trigger?: 'hover' | 'click' | 'none';
    /** Offset from cursor */
    offset?: number;
    /** Allow escape viewport */
    allowEscapeViewBox?: { x?: boolean; y?: boolean };
    /** Formatter for values */
    formatter?: (value: unknown, name: string, props: unknown) => ReactNode;
    /** Label formatter */
    labelFormatter?: (label: unknown) => ReactNode;
}

export interface TooltipPayload<T = DataPoint> {
    active?: boolean;
    payload?: Array<{
        name: string;
        value: unknown;
        dataKey: string;
        color: string;
        payload: T;
    }>;
    label?: string;
}

// =============================================================================
// LEGEND PROPS
// =============================================================================

export interface LegendProps {
    /** Legend layout */
    layout?: 'horizontal' | 'vertical';
    /** Alignment */
    align?: 'left' | 'center' | 'right';
    /** Vertical alignment */
    verticalAlign?: 'top' | 'middle' | 'bottom';
    /** Icon size */
    iconSize?: number;
    /** Icon type */
    iconType?: 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye';
    /** Custom content */
    content?: React.ReactElement | ((props: LegendPayload) => ReactNode);
    /** On click handler */
    onClick?: (e: unknown) => void;
    /** Wrapper style */
    wrapperStyle?: React.CSSProperties;
}

export interface LegendPayload {
    payload: Array<{
        value: string;
        type: string;
        id: string;
        color: string;
    }>;
}

// =============================================================================
// REFERENCE ELEMENTS
// =============================================================================

export interface ReferenceLineProps {
    /** X value for vertical line */
    x?: string | number;
    /** Y value for horizontal line */
    y?: string | number;
    /** Stroke color */
    stroke?: string;
    /** Stroke width */
    strokeWidth?: number;
    /** Stroke dash array */
    strokeDasharray?: string;
    /** Label */
    label?: string | React.ReactElement;
    /** Show in front of data */
    isFront?: boolean;
}

export interface ReferenceAreaProps {
    /** X1 value */
    x1?: string | number;
    /** X2 value */
    x2?: string | number;
    /** Y1 value */
    y1?: string | number;
    /** Y2 value */
    y2?: string | number;
    /** Fill color */
    fill?: string;
    /** Fill opacity */
    fillOpacity?: number;
    /** Stroke color */
    stroke?: string;
    /** Label */
    label?: string | React.ReactElement;
}

// =============================================================================
// BRUSH PROPS
// =============================================================================

export interface BrushProps {
    /** Data key */
    dataKey?: string;
    /** Brush height */
    height?: number;
    /** Start index */
    startIndex?: number;
    /** End index */
    endIndex?: number;
    /** On change handler */
    onChange?: (range: { startIndex: number; endIndex: number }) => void;
    /** Fill color */
    fill?: string;
    /** Stroke color */
    stroke?: string;
}

// =============================================================================
// LABEL PROPS
// =============================================================================

export interface LabelProps {
    /** Label value */
    value?: string | number;
    /** Position */
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'insideTop' | 'insideBottom' | 'insideLeft' | 'insideRight';
    /** Offset */
    offset?: number;
    /** Fill color */
    fill?: string;
    /** Font size */
    fontSize?: number;
    /** Font weight */
    fontWeight?: number | string;
}

export interface LabelListProps {
    /** Data key */
    dataKey?: string;
    /** Position */
    position?: LabelProps['position'];
    /** Formatter */
    formatter?: (value: unknown) => string;
    /** Fill color */
    fill?: string;
    /** Font size */
    fontSize?: number;
}

// =============================================================================
// POLAR AXIS PROPS (for Radar, Polar charts)
// =============================================================================

export interface PolarAngleAxisProps {
    /** Data key */
    dataKey?: string;
    /** Type */
    type?: 'number' | 'category';
    /** Domain */
    domain?: [number, number] | string[];
    /** Tick line */
    tickLine?: boolean;
    /** Axis line */
    axisLine?: boolean;
    /** Tick formatter */
    tickFormatter?: (value: unknown) => string;
    /** Stroke color */
    stroke?: string;
}

export interface PolarRadiusAxisProps {
    /** Angle */
    angle?: number;
    /** Domain */
    domain?: [number | 'auto' | 'dataMin', number | 'auto' | 'dataMax'];
    /** Tick count */
    tickCount?: number;
    /** Tick formatter */
    tickFormatter?: (value: unknown) => string;
    /** Axis line */
    axisLine?: boolean;
    /** Tick line */
    tickLine?: boolean;
    /** Stroke color */
    stroke?: string;
}

export interface PolarGridProps {
    /** Grid type */
    gridType?: 'polygon' | 'circle';
    /** Radial lines */
    radialLines?: boolean;
    /** Stroke color */
    stroke?: string;
    /** Stroke dash array */
    strokeDasharray?: string;
}

// =============================================================================
// CELL PROPS (for individual items in Bar, Pie, etc.)
// =============================================================================

export interface CellProps {
    /** Fill color */
    fill?: string;
    /** Stroke color */
    stroke?: string;
    /** Stroke width */
    strokeWidth?: number;
    /** Cursor style */
    cursor?: string;
    /** On click handler */
    onClick?: (e: React.MouseEvent) => void;
}

// =============================================================================
// CHART PRIMITIVES INTERFACE
// =============================================================================

export interface ChartPrimitives {
    // Canvas (chart container)
    ChartCanvas: ComponentType<ChartCanvasProps>;

    // Cartesian Series
    BarSeries: ComponentType<BarSeriesProps>;
    LineSeries: ComponentType<LineSeriesProps>;
    AreaSeries: ComponentType<AreaSeriesProps>;
    ScatterSeries: ComponentType<ScatterSeriesProps>;

    // Radial Series
    PieSeries: ComponentType<PieSeriesProps>;
    RadarSeries: ComponentType<RadarSeriesProps>;

    // Axes
    XAxis: ComponentType<XAxisProps>;
    YAxis: ComponentType<YAxisProps>;
    PolarAngleAxis: ComponentType<PolarAngleAxisProps>;
    PolarRadiusAxis: ComponentType<PolarRadiusAxisProps>;

    // Grids
    CartesianGrid: ComponentType<GridProps>;
    PolarGrid: ComponentType<PolarGridProps>;

    // Overlays
    Tooltip: ComponentType<TooltipProps>;
    Legend: ComponentType<LegendProps>;
    Brush: ComponentType<BrushProps>;

    // Reference Elements
    ReferenceLine: ComponentType<ReferenceLineProps>;
    ReferenceArea: ComponentType<ReferenceAreaProps>;

    // Labels
    Label: ComponentType<LabelProps>;
    LabelList: ComponentType<LabelListProps>;

    // Cells
    Cell: ComponentType<CellProps>;
}

// =============================================================================
// ADAPTER CAPABILITIES
// =============================================================================

export interface ChartCapabilities {
    /** Supports brush/zoom selection */
    supportsBrush: boolean;
    /** Supports zoom */
    supportsZoom: boolean;
    /** Supports animations */
    supportsAnimation: boolean;
    /** Animation library used */
    animationType: 'css' | 'spring' | 'none';
    /** Supports responsive container */
    supportsResponsive: boolean;
    /** Chart types supported */
    supportedChartTypes: string[];
}

// =============================================================================
// ADAPTER INTERFACE
// =============================================================================

export interface ChartAdapter {
    /** Unique adapter identifier */
    id: string;
    /** Human-readable name */
    name: string;
    /** Primitive components */
    primitives: ChartPrimitives;
    /** Adapter capabilities */
    capabilities: ChartCapabilities;
}
