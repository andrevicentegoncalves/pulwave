/**
 * Example: Provider-Agnostic BarChart using Primitives
 *
 * This example demonstrates the Unified Primitives Layer architecture.
 * The chart consumes library-agnostic primitives via usePrimitives(),
 * allowing the underlying chart library (Recharts, VISX, etc.) to be
 * swapped at runtime without changing this component.
 *
 * Usage:
 * ```tsx
 * // With Recharts (default)
 * <ChartProvider>
 *   <PrimitivesBarChart data={salesData} xKey="month" yKeys={['revenue', 'profit']} />
 * </ChartProvider>
 *
 * // With VISX
 * <ChartProvider primitivesAdapter={VISXPrimitivesAdapter}>
 *   <PrimitivesBarChart data={salesData} xKey="month" yKeys={['revenue', 'profit']} />
 * </ChartProvider>
 * ```
 */

import React from 'react';
import { usePrimitives, useChartCapability } from '../primitives/hooks';
import type { DataPoint, ChartMargins } from '../primitives/types';

export interface PrimitivesBarChartProps<T extends DataPoint = DataPoint> {
    /** Chart data */
    data: T[];
    /** Key for X-axis values */
    xKey: keyof T;
    /** Keys for Y-axis values (each becomes a bar series) */
    yKeys: (keyof T)[];
    /** Chart width (number or '100%') */
    width?: number | string;
    /** Chart height */
    height?: number;
    /** Chart margins */
    margin?: ChartMargins;
    /** Colors for each series */
    colors?: string[];
    /** Show grid */
    showGrid?: boolean;
    /** Show tooltip */
    showTooltip?: boolean;
    /** Show legend */
    showLegend?: boolean;
    /** Enable animation */
    animate?: boolean;
    /** Bar corner radius */
    barRadius?: number;
    /** Additional class name */
    className?: string;
}

/** Default semantic chart colors */
const DEFAULT_COLORS = [
    'var(--color-chart-1)',
    'var(--color-chart-2)',
    'var(--color-chart-3)',
    'var(--color-chart-4)',
    'var(--color-chart-5)',
];

/**
 * PrimitivesBarChart
 *
 * A bar chart implementation using the Unified Primitives Layer.
 * This component is completely library-agnostic - it works with any
 * chart library that implements the ChartAdapter interface.
 */
export const PrimitivesBarChart = <T extends DataPoint = DataPoint>({
    data,
    xKey,
    yKeys,
    width = '100%',
    height = 300,
    margin = { top: 20, right: 20, bottom: 40, left: 50 },
    colors = DEFAULT_COLORS,
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    animate = true,
    barRadius = 4,
    className,
}: PrimitivesBarChartProps<T>) => {
    // Get library-agnostic primitives from context
    const {
        ChartCanvas,
        BarSeries,
        XAxis,
        YAxis,
        CartesianGrid,
        Tooltip,
        Legend,
    } = usePrimitives();

    // Check capabilities for conditional features
    const supportsAnimation = useChartCapability('supportsAnimation');
    const supportsBrush = useChartCapability('supportsBrush');

    // Log capability info in development
    if (process.env.NODE_ENV === 'development') {
        console.debug('[PrimitivesBarChart] Capabilities:', {
            supportsAnimation,
            supportsBrush,
            animate: animate && supportsAnimation,
        });
    }

    return (
        <ChartCanvas
            width={width}
            height={height}
            margin={margin}
            className={className}
            xScale={{ type: 'band', paddingInner: 0.2 }}
            yScale={{ type: 'linear', nice: true }}
        >
            {/* Grid lines */}
            {showGrid && (
                <CartesianGrid
                    horizontal
                    vertical={false}
                    strokeDasharray="3 3"
                />
            )}

            {/* Axes */}
            <XAxis
                orientation="bottom"
                dataKey={String(xKey)}
            />
            <YAxis
                orientation="left"
            />

            {/* Bar series for each yKey */}
            {yKeys.map((key, index) => (
                <BarSeries
                    key={String(key)}
                    dataKey={String(key)}
                    data={data}
                    name={String(key)}
                    fill={colors[index % colors.length]}
                    radius={barRadius}
                    animate={animate && supportsAnimation}
                />
            ))}

            {/* Tooltip */}
            {showTooltip && <Tooltip cursor />}

            {/* Legend */}
            {showLegend && <Legend />}
        </ChartCanvas>
    );
};

export default PrimitivesBarChart;

// =============================================================================
// Usage Examples
// =============================================================================

/**
 * Example 1: Basic usage with default Recharts adapter
 *
 * ```tsx
 * import { ChartProvider } from '../providers/ChartProvider';
 * import { PrimitivesBarChart } from './PrimitivesBarChart';
 *
 * const salesData = [
 *   { month: 'Jan', revenue: 4000, profit: 2400 },
 *   { month: 'Feb', revenue: 3000, profit: 1398 },
 *   { month: 'Mar', revenue: 2000, profit: 9800 },
 *   { month: 'Apr', revenue: 2780, profit: 3908 },
 * ];
 *
 * function SalesChart() {
 *   return (
 *     <ChartProvider>
 *       <PrimitivesBarChart
 *         data={salesData}
 *         xKey="month"
 *         yKeys={['revenue', 'profit']}
 *         height={400}
 *       />
 *     </ChartProvider>
 *   );
 * }
 * ```
 */

/**
 * Example 2: Switching to VISX adapter at runtime
 *
 * ```tsx
 * import { ChartProvider } from '../providers/ChartProvider';
 * import { VISXPrimitivesAdapter } from '../providers/adapters';
 * import { PrimitivesBarChart } from './PrimitivesBarChart';
 *
 * function SalesChartWithVISX() {
 *   return (
 *     <ChartProvider primitivesAdapter={VISXPrimitivesAdapter}>
 *       <PrimitivesBarChart
 *         data={salesData}
 *         xKey="month"
 *         yKeys={['revenue', 'profit']}
 *       />
 *     </ChartProvider>
 *   );
 * }
 * ```
 */

/**
 * Example 3: Using capability detection
 *
 * ```tsx
 * import { useChartCapability } from '../primitives/hooks';
 *
 * function ChartWithBrush() {
 *   const supportsBrush = useChartCapability('supportsBrush');
 *
 *   return (
 *     <ChartProvider>
 *       <PrimitivesBarChart data={data} xKey="x" yKeys={['y']} />
 *       {supportsBrush && <BrushControl />}
 *     </ChartProvider>
 *   );
 * }
 * ```
 */
