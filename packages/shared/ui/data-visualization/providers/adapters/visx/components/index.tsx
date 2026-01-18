/**
 * VISX Components - Index
 *
 * Exports all visx wrapper components.
 * These components provide a Recharts-compatible API using visx primitives.
 */

import React from 'react';
import type { ReactNode } from 'react';

// Re-export visx primitives that can be used directly
export {
    XYChart,
    Axis,
    Grid,
    LineSeries,
    BarSeries,
    AreaSeries,
    GlyphSeries,
    Tooltip as VISXTooltip,
    AnimatedAxis,
    AnimatedGrid,
    AnimatedLineSeries,
    AnimatedBarSeries,
    AnimatedAreaSeries,
    AnimatedGlyphSeries,
} from '@visx/xychart';

export { Group } from '@visx/group';
export { Pie } from '@visx/shape';
export { scaleOrdinal, scaleLinear, scaleBand, scaleTime } from '@visx/scale';
export { LegendOrdinal, LegendLinear, LegendSize, LegendThreshold } from '@visx/legend';

// Export custom wrapper components
export { VISXResponsiveContainer } from './ResponsiveContainer';
export { VISXLineChart } from './LineChart';

// ============================================================================
// PLACEHOLDER COMPONENTS
// ============================================================================
// These are placeholder implementations that maintain the ChartLibraryComponents
// interface but delegate to visx's composable approach.

interface PlaceholderProps {
    children?: ReactNode;
    [key: string]: any;
}

/**
 * Generic placeholder that passes through children
 * Used for components where visx uses composition instead of containers
 */
function Placeholder({ children, ...props }: PlaceholderProps) {
    return <>{children}</>;
}

// Container placeholders
export const BarChart = Placeholder;
export const AreaChart = Placeholder;
export const ComposedChart = Placeholder;
export const ScatterChart = Placeholder;
export const PieChart = Placeholder;
export const RadarChart = Placeholder;
export const RadialBarChart = Placeholder;
export const Treemap = Placeholder;
export const FunnelChart = Placeholder;
export const Funnel = Placeholder;
export const Sankey = Placeholder;

// Series placeholders (visx series work differently)
export const Line = Placeholder;
export const Bar = Placeholder;
export const Area = Placeholder;
export const Scatter = Placeholder;

// Radial placeholders
export const Radar = Placeholder;
export const RadialBar = Placeholder;
export const PolarAngleAxis = Placeholder;
export const PolarGrid = Placeholder;
export const PolarRadiusAxis = Placeholder;

// Axis placeholders (visx Axis works differently)
export const XAxis = Placeholder;
export const YAxis = Placeholder;
export const ZAxis = Placeholder;
export const CartesianGrid = Placeholder;

// Overlay placeholders
export const Tooltip = Placeholder;
export const Legend = Placeholder;
export const Brush = Placeholder;
export const ReferenceLine = Placeholder;
export const ReferenceArea = Placeholder;
export const ReferenceDot = Placeholder;
export const Label = Placeholder;
export const LabelList = Placeholder;

// Shape placeholders
export const Cell = Placeholder;
export const Dot = Placeholder;
export const Cross = Placeholder;
export const Rectangle = Placeholder;
export const Sector = Placeholder;
export const Curve = Placeholder;

// Utility placeholders
export const Customized = Placeholder;
export const ErrorBar = Placeholder;
