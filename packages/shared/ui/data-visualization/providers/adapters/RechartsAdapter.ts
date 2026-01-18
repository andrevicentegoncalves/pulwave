/**
 * Recharts Adapter
 * 
 * Maps Recharts components to the ChartLibraryComponents interface.
 * This is the default implementation used by ChartProvider.
 */

import {
    ResponsiveContainer,
    LineChart,
    BarChart,
    AreaChart,
    ComposedChart,
    ScatterChart,
    PieChart,
    RadarChart,
    RadialBarChart,
    Treemap,
    FunnelChart,
    Funnel,
    Sankey,
    Line,
    Bar,
    Area,
    Scatter,
    Pie,
    Radar,
    RadialBar,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Brush,
    ReferenceLine,
    ReferenceArea,
    ReferenceDot,
    Label,
    LabelList,
    Cell,
    Dot,
    Cross,
    Rectangle,
    Sector,
    Curve,
    Customized,
    ErrorBar,
} from 'recharts';

import type { ChartLibraryComponents } from '../ChartLibrary.types';

/**
 * Recharts implementation of ChartLibraryComponents
 */
export const RechartsAdapter: ChartLibraryComponents = {
    // Container
    ResponsiveContainer,

    // Chart Containers
    LineChart,
    BarChart,
    AreaChart,
    ComposedChart,
    ScatterChart,
    PieChart,
    RadarChart,
    RadialBarChart,
    Treemap,
    FunnelChart,
    Funnel,
    Sankey,

    // Cartesian Series
    Line,
    Bar,
    Area,
    Scatter,

    // Radial Series
    Pie,
    Radar,
    RadialBar,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,

    // Axis Components
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,

    // Overlay Components
    Tooltip,
    Legend,
    Brush,
    ReferenceLine,
    ReferenceArea,
    ReferenceDot,
    Label,
    LabelList,

    // Shape Components
    Cell,
    Dot,
    Cross,
    Rectangle,
    Sector,
    Curve,

    // Utility
    Customized,
    ErrorBar,
};

export default RechartsAdapter;
