/**
 * VISX Adapter
 *
 * Maps visx chart implementations to the ChartLibraryComponents interface.
 * Each chart uses visx primitives optimized for that chart type.
 */

import type { ChartLibraryComponents } from '../../ChartLibrary.types';

// Real visx chart implementations
import { BarChart } from '../../../charts/visx/cartesian/BarChart';
import { LineChart } from '../../../charts/visx/cartesian/LineChart';

// Placeholder components from ./components (to be implemented incrementally)
import {
    VISXResponsiveContainer,
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
} from './components';

/**
 * VISX implementation of ChartLibraryComponents
 *
 * Usage:
 * ```tsx
 * <ChartProvider adapter={VISXAdapter}>
 *   <LineChart data={data}>...</LineChart>
 * </ChartProvider>
 * ```
 *
 * For advanced use cases, import visx primitives directly:
 * ```tsx
 * import { XYChart, LineSeries, Axis } from '@visx/xychart';
 * ```
 */
export const VISXAdapter: ChartLibraryComponents = {
    // Container
    ResponsiveContainer: VISXResponsiveContainer,

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

export default VISXAdapter;
