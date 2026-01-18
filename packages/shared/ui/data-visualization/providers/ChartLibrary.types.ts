import React from 'react';

/**
 * Chart Library Component Types
 * 
 * Abstract interface for chart library components.
 * Allows swapping Recharts for other libraries (Victory, D3, etc.)
 */

// Generic component type
type ChartComponent<P = any> = React.ComponentType<P>;

/**
 * Chart Library Components Interface
 * 
 * Defines all components that a chart library must provide.
 */
export interface ChartLibraryComponents {
    // =========================================================================
    // CONTAINER COMPONENTS
    // =========================================================================

    ResponsiveContainer: ChartComponent;

    // =========================================================================
    // CHART CONTAINERS
    // =========================================================================

    LineChart: ChartComponent;
    BarChart: ChartComponent;
    AreaChart: ChartComponent;
    ComposedChart: ChartComponent;
    ScatterChart: ChartComponent;
    PieChart: ChartComponent;
    RadarChart: ChartComponent;
    RadialBarChart: ChartComponent;
    Treemap: ChartComponent;
    Funnel: ChartComponent;
    FunnelChart: ChartComponent;
    Sankey: ChartComponent;

    // =========================================================================
    // CARTESIAN SERIES
    // =========================================================================

    Line: ChartComponent;
    Bar: ChartComponent;
    Area: ChartComponent;
    Scatter: ChartComponent;

    // =========================================================================
    // RADIAL SERIES
    // =========================================================================

    Pie: ChartComponent;
    Radar: ChartComponent;
    RadialBar: ChartComponent;
    PolarAngleAxis: ChartComponent;
    PolarGrid: ChartComponent;
    PolarRadiusAxis: ChartComponent;

    // =========================================================================
    // AXIS COMPONENTS
    // =========================================================================

    XAxis: ChartComponent;
    YAxis: ChartComponent;
    ZAxis: ChartComponent;
    CartesianGrid: ChartComponent;

    // =========================================================================
    // OVERLAY COMPONENTS
    // =========================================================================

    Tooltip: ChartComponent;
    Legend: ChartComponent;
    Brush: ChartComponent;
    ReferenceLine: ChartComponent;
    ReferenceArea: ChartComponent;
    ReferenceDot: ChartComponent;
    Label: ChartComponent;
    LabelList: ChartComponent;

    // =========================================================================
    // SHAPE COMPONENTS
    // =========================================================================

    Cell: ChartComponent;
    Dot: ChartComponent;
    Cross: ChartComponent;
    Rectangle: ChartComponent;
    Sector: ChartComponent;
    Curve: ChartComponent;

    // =========================================================================
    // UTILITY
    // =========================================================================

    Customized: ChartComponent;
    ErrorBar: ChartComponent;
}

export type { ChartComponent };
