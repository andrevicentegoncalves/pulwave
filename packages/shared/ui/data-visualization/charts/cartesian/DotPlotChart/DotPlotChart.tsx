import { useMemo } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { ChartShell } from '../../../primitives/ChartShell';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { dotPlotChartVariants, type DotPlotChartProps, type DotPlotData } from './types';
import './styles/_index.scss';

/**
 * DotPlotChart Component
 *
 * Displays data points along an axis with optional grouping.
 * Useful for comparing values across categories.
 */
export const DotPlotChart = ({
    data = [],
    valueKey = 'value',
    categoryKey = 'category',
    height = 300,
    dotSize = 12,
    showGrid = true,
    showLabels = true,
    showValues = true,
    valueFormatter = (v: number) => v?.toLocaleString() ?? '',
    layout = 'horizontal', // 'horizontal' (dots go right) or 'vertical' (dots go up)
    className,
}: DotPlotChartProps) => {
    const { getColor, semanticColors } = useChartContext();
    const { tooltip, getHandlers } = useSVGTooltip();

    // Early return for empty data
    if (!Array.isArray(data) || data.length === 0) {
        return (
            <ChartShell
                className={cn(dotPlotChartVariants({ layout }), 'chart--dot-plot--empty', className)}
                height={height}
            >
                <span>No data available</span>
            </ChartShell>
        );
    }

    const padding = { top: 30, right: 40, bottom: 40, left: layout === 'horizontal' ? 100 : 60 };
    const width = 600;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Calculate min/max for scale
    const [minValue, maxValue] = useMemo(() => {
        const values = data.map((d: DotPlotData) => d[valueKey]).filter(v => typeof v === 'number' && !isNaN(v));
        if (values.length === 0) return [0, 100]; // Fallback range
        const min = Math.min(0, ...values);
        const max = Math.max(...values, 1) * 1.1; // Ensure max is at least 1
        return [min, max];
    }, [data, valueKey]);

    // Scale value to position
    const scaleValue = (val: number) => {
        const range = layout === 'horizontal' ? chartWidth : chartHeight;
        const denominator = maxValue - minValue;
        if (denominator === 0) return 0; // Prevent division by zero
        return ((val - minValue) / denominator) * range;
    };

    // Generate ticks
    const ticks = useMemo(() => {
        const count = 5;
        const step = (maxValue - minValue) / count;
        return Array.from({ length: count + 1 }, (_, i) => minValue + i * step);
    }, [minValue, maxValue]);

    // Row height or column width
    const itemSpace = layout === 'horizontal'
        ? chartHeight / (data.length || 1)
        : chartWidth / (data.length || 1);

    return (
        <ChartShell
            className={cn(dotPlotChartVariants({ layout }), className)}
            height={height}
            width="100%"
            responsive={false}
        >
            <div className="chart--dot-plot__wrapper">
                <svg width={width} height={height} className="chart--dot-plot__svg" role="img" aria-label={`Dot plot chart with ${data.length} data points`}>
                {/* Grid lines */}
                {showGrid && ticks.map((tick: number, i: number) => {
                    const pos = scaleValue(tick);
                    return (
                        <g key={i}>
                            {layout === 'horizontal' ? (
                                <>
                                    <line
                                        x1={padding.left + pos}
                                        y1={padding.top}
                                        x2={padding.left + pos}
                                        y2={height - padding.bottom}
                                        className="chart--dot-plot__grid-line"
                                    />
                                    <text
                                        x={padding.left + pos}
                                        y={height - padding.bottom + 20}
                                        textAnchor="middle"
                                        className="chart--dot-plot__tick-text"
                                    >
                                        {valueFormatter(tick)}
                                    </text>
                                </>
                            ) : (
                                <>
                                    <line
                                        x1={padding.left}
                                        y1={height - padding.bottom - pos}
                                        x2={width - padding.right}
                                        y2={height - padding.bottom - pos}
                                        className="chart--dot-plot__grid-line"
                                    />
                                    <text
                                        x={padding.left - 10}
                                        y={height - padding.bottom - pos + 4}
                                        textAnchor="end"
                                        className="chart--dot-plot__tick-text"
                                    >
                                        {valueFormatter(tick)}
                                    </text>
                                </>
                            )}
                        </g>
                    );
                })}

                {/* Axis lines */}
                <line
                    x1={padding.left}
                    y1={padding.top}
                    x2={padding.left}
                    y2={height - padding.bottom}
                    className="chart--dot-plot__axis-line"
                    stroke={semanticColors.grid}
                />
                <line
                    x1={padding.left}
                    y1={height - padding.bottom}
                    x2={width - padding.right}
                    y2={height - padding.bottom}
                    className="chart--dot-plot__axis-line"
                    stroke={semanticColors.grid}
                />

                {/* Data points */}
                {data.map((item: any, idx: number) => {
                    const value = item[valueKey];
                    // Skip items with invalid values
                    if (typeof value !== 'number' || isNaN(value)) return null;

                    const category = item[categoryKey];
                    const color = item.color || getColor(idx);
                    const pos = scaleValue(value);

                    // Skip if position is NaN
                    if (isNaN(pos)) return null;

                    let cx, cy;
                    if (layout === 'horizontal') {
                        cx = padding.left + pos;
                        cy = padding.top + (idx + 0.5) * itemSpace;
                    } else {
                        cx = padding.left + (idx + 0.5) * itemSpace;
                        cy = height - padding.bottom - pos;
                    }

                    const tooltipHandlers = getHandlers(`${category}: ${valueFormatter(value)}`);

                    return (
                        <g key={idx}>
                            {/* Connecting line to axis */}
                            {layout === 'horizontal' ? (
                                <line
                                    x1={padding.left}
                                    y1={cy}
                                    x2={cx}
                                    y2={cy}
                                    stroke={color}
                                    className="chart--dot-plot__connector-line"
                                />
                            ) : (
                                <line
                                    x1={cx}
                                    y1={height - padding.bottom}
                                    x2={cx}
                                    y2={cy}
                                    stroke={color}
                                    className="chart--dot-plot__connector-line"
                                />
                            )}

                            {/* Dot */}
                            <circle
                                cx={cx}
                                cy={cy}
                                r={dotSize}
                                fill={color}
                                className="chart--dot-plot__dot"
                                {...tooltipHandlers}
                            />

                            {/* Value label */}
                            {showValues && (
                                <text
                                    x={layout === 'horizontal' ? cx + dotSize + 6 : cx}
                                    y={layout === 'horizontal' ? cy + 4 : cy - dotSize - 6}
                                    textAnchor={layout === 'horizontal' ? 'start' : 'middle'}
                                    className="chart--dot-plot__value-text"
                                >
                                    {valueFormatter(value)}
                                </text>
                            )}

                            {/* Category label */}
                            {showLabels && (
                                <text
                                    x={layout === 'horizontal' ? padding.left - 10 : cx}
                                    y={layout === 'horizontal' ? cy + 4 : height - padding.bottom + 20}
                                    textAnchor={layout === 'horizontal' ? 'end' : 'middle'}
                                    className="chart--dot-plot__label-text"
                                >
                                    {category}
                                </text>
                            )}
                        </g>
                    );
                })}
                </svg>

                <SVGTooltip tooltip={tooltip} />
            </div>
        </ChartShell>
    );
};

export default DotPlotChart;
