import { useMemo } from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { useChartContext } from '../../../providers/ChartProvider';
import { candlestickChartVariants, type CandlestickChartProps, type CandlestickData } from './types';
import './styles/_index.scss';

/**
 * CandlestickChart Component
 * Custom SVG implementation for financial candlestick data.
 */
export const CandlestickChart = ({
    data = [],
    height = 500,
    padding = 40,
    upColor,
    downColor,
    showVolume = true,
    className,
}: CandlestickChartProps) => {
    const { semanticColors } = useChartContext();
    const resolvedUpColor = upColor ?? semanticColors.success;
    const resolvedDownColor = downColor ?? semanticColors.error;

    // Chart dimensions and scales
    const width = 800; // Ref width for scaling
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const { minPrice, maxPrice, scaleY, scaleX, candleWidth } = useMemo(() => {
        if (data.length === 0) return { minPrice: 0, maxPrice: 100, scaleY: (v: number) => 0, scaleX: (i: number) => 0, candleWidth: 10 };

        const minPrice = Math.min(...data.map(d => d.low)) * 0.99;
        const maxPrice = Math.max(...data.map(d => d.high)) * 1.01;
        const range = maxPrice - minPrice;

        const scaleY = (val: number) => chartHeight - ((val - minPrice) / range) * chartHeight;

        // Calculate candle width and add padding to prevent overlap with y-axis
        const candleWidth = (chartWidth / data.length) * 0.7;
        const scaleX = (index: number) => {
            // Add half candle width padding on left to prevent overlap
            const availableWidth = chartWidth - candleWidth;
            return candleWidth / 2 + (index / (data.length - 1)) * availableWidth;
        };

        return { minPrice, maxPrice, scaleY, scaleX, candleWidth };
    }, [data, chartHeight, chartWidth]);

    return (
        <ChartShell
            height={height}
            className={cn(candlestickChartVariants(), className)}
            responsive={false}
        >
            <div className="chart--candlestick__wrapper">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="chart--candlestick__svg"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label={`Candlestick chart with ${data.length} data points`}
            >
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    {/* Axes lines */}
                    <line
                        x1={0}
                        y1={chartHeight}
                        x2={chartWidth}
                        y2={chartHeight}
                        stroke={semanticColors.border}
                    />
                    <line
                        x1={0}
                        y1={0}
                        x2={0}
                        y2={chartHeight}
                        stroke={semanticColors.border}
                    />

                    {/* Candlesticks */}
                    {data.map((d, i) => {
                        const x = scaleX(i);
                        const isUp = d.close >= d.open;
                        const color = isUp ? resolvedUpColor : resolvedDownColor;

                        return (
                            <g key={i}>
                                {/* Wick */}
                                <line
                                    x1={x}
                                    y1={scaleY(d.high)}
                                    x2={x}
                                    y2={scaleY(d.low)}
                                    stroke={color}
                                    className="chart--candlestick__wick"
                                />
                                {/* Body */}
                                <rect
                                    x={x - candleWidth / 2}
                                    y={scaleY(Math.max(d.open, d.close))}
                                    width={candleWidth}
                                    height={Math.max(1, Math.abs(scaleY(d.open) - scaleY(d.close)))}
                                    fill={color}
                                    stroke={color}
                                    className="chart--candlestick__body"
                                />
                            </g>
                        );
                    })}

                    {/* Y scale labels */}
                    {[...Array(5)].map((_, i) => {
                        const price = minPrice + (i * (maxPrice - minPrice)) / 4;
                        return (
                            <text
                                key={i}
                                x={-10}
                                y={scaleY(price)}
                                textAnchor="end"
                                alignmentBaseline="middle"
                                className="chart--candlestick__label"
                            >
                                {price.toFixed(2)}
                            </text>
                        );
                    })}

                    {/* X scale labels */}
                    {data.map((d, i) => {
                        if (i % Math.ceil(data.length / 5) === 0) {
                            return (
                                <text
                                    key={i}
                                    x={scaleX(i)}
                                    y={chartHeight + 20}
                                    textAnchor="middle"
                                    className="chart--candlestick__label"
                                >
                                    {d.date}
                                </text>
                            );
                        }
                        return null;
                    })}
                </g>
            </svg>
            </div>
        </ChartShell>
    );
};

export default CandlestickChart;
