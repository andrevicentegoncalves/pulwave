/**
 * Recharts Primitives Adapter
 *
 * Implements the ChartAdapter interface using Recharts primitives.
 * This adapter provides library-agnostic chart primitives backed by Recharts.
 *
 * @example
 * ```tsx
 * import { RechartsPrimitivesAdapter } from './adapters/recharts';
 *
 * <ChartProvider adapter={RechartsPrimitivesAdapter}>
 *   {/* Charts use primitives via useChartPrimitives() *\/}
 * </ChartProvider>
 * ```
 */

import type { ChartAdapter, ChartPrimitives, ChartCapabilities } from '../../../primitives/types';

// Import primitive components
import {
    ChartCanvas,
    BarSeries,
    LineSeries,
    AreaSeries,
    ScatterSeries,
    PieSeries,
    RadarSeries,
    XAxis,
    YAxis,
    PolarAngleAxis,
    PolarRadiusAxis,
    CartesianGrid,
    PolarGrid,
    Tooltip,
    Legend,
    Brush,
    ReferenceLine,
    ReferenceArea,
    Label,
    LabelList,
    Cell,
} from './primitives';

/**
 * Recharts capabilities
 */
const RechartsCapabilities: ChartCapabilities = {
    supportsBrush: true,
    supportsZoom: false,
    supportsAnimation: true,
    animationType: 'css',
    supportsResponsive: true,
    supportedChartTypes: [
        'bar',
        'line',
        'area',
        'scatter',
        'pie',
        'radar',
        'radialBar',
        'composed',
        'funnel',
        'treemap',
        'sankey',
    ],
};

/**
 * Recharts primitives implementation
 */
const RechartsPrimitives: ChartPrimitives = {
    // Canvas
    ChartCanvas,

    // Cartesian Series
    BarSeries,
    LineSeries,
    AreaSeries,
    ScatterSeries,

    // Radial Series
    PieSeries,
    RadarSeries,

    // Axes
    XAxis,
    YAxis,
    PolarAngleAxis,
    PolarRadiusAxis,

    // Grids
    CartesianGrid,
    PolarGrid,

    // Overlays
    Tooltip,
    Legend,
    Brush,

    // Reference Elements
    ReferenceLine,
    ReferenceArea,

    // Labels
    Label,
    LabelList,

    // Cells
    Cell,
};

/**
 * Recharts Primitives Adapter
 *
 * Full implementation of ChartAdapter using Recharts components.
 */
export const RechartsPrimitivesAdapter: ChartAdapter = {
    id: 'recharts',
    name: 'Recharts',
    primitives: RechartsPrimitives,
    capabilities: RechartsCapabilities,
};

export default RechartsPrimitivesAdapter;
