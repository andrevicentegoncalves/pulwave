/**
 * VISX Primitives Adapter
 *
 * Implements the ChartAdapter interface using VISX primitives.
 * This adapter provides library-agnostic chart primitives backed by VISX.
 *
 * @example
 * ```tsx
 * import { VISXPrimitivesAdapter } from './adapters/visx';
 *
 * <ChartProvider adapter={VISXPrimitivesAdapter}>
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
 * VISX capabilities
 */
const VISXCapabilities: ChartCapabilities = {
    supportsBrush: false, // Requires separate @visx/brush setup
    supportsZoom: true, // Via @visx/zoom
    supportsAnimation: true,
    animationType: 'spring', // React Spring animations
    supportsResponsive: true,
    supportedChartTypes: [
        'bar',
        'line',
        'area',
        'scatter',
        // Pie/radar require different approach in visx
    ],
};

/**
 * VISX primitives implementation
 */
const VISXPrimitives: ChartPrimitives = {
    // Canvas
    ChartCanvas,

    // Cartesian Series
    BarSeries,
    LineSeries,
    AreaSeries,
    ScatterSeries,

    // Radial Series (placeholders)
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
 * VISX Primitives Adapter
 *
 * Implementation of ChartAdapter using VISX components.
 * Note: Some primitives are placeholders as VISX handles certain
 * chart types differently (e.g., Pie charts use @visx/shape).
 */
export const VISXPrimitivesAdapter: ChartAdapter = {
    id: 'visx',
    name: 'VISX',
    primitives: VISXPrimitives,
    capabilities: VISXCapabilities,
};

export default VISXPrimitivesAdapter;
