import { useMemo, useState } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { ChartShell } from '../../../primitives/ChartShell';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { spiralPlotVariants, type SpiralPlotProps, type SpiralData } from './types';
import './styles/_index.scss';

/**
 * SpiralPlot Component
 *
 * Data visualization arranged in a spiral pattern.
 * Great for showing time series or sequential data.
 */
export const SpiralPlot = ({
    data = [],
    size = 400,
    innerRadius = 50,
    turns,
    barWidth = 8,
    showLabels = true,
    valueFormatter = (v: number) => v?.toLocaleString() ?? '',
    className,
}: SpiralPlotProps) => {
    const { getColor, semanticColors } = useChartContext();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const { tooltip, getHandlers } = useSVGTooltip();

    const center = size / 2;
    const maxRadius = (size / 2) - 30;

    // Calculate adaptive turns if not specified (roughly 1 turn per 12 data points)
    const computedTurns = turns ?? Math.max(0.5, Math.min(3, data.length / 12));

    // Process data into spiral positions
    const spiralData = useMemo(() => {
        const maxValue = Math.max(...data.map((d: SpiralData) => d.value), 1);
        const totalAngle = computedTurns * 2 * Math.PI;
        const radiusGrowth = (maxRadius - innerRadius) / (data.length || 1);

        return data.map((item: SpiralData, idx: number) => {
            const angle = (idx / (data.length || 1)) * totalAngle - Math.PI / 2;
            const radius = innerRadius + idx * radiusGrowth;
            const normalizedValue = item.value / maxValue;
            const barLength = normalizedValue * radiusGrowth * 1.8;

            // Bar starts at spiral position and extends radially outward
            const startX = center + radius * Math.cos(angle);
            const startY = center + radius * Math.sin(angle);
            const endX = center + (radius + barLength) * Math.cos(angle);
            const endY = center + (radius + barLength) * Math.sin(angle);

            return {
                ...item,
                startX,
                startY,
                endX,
                endY,
                angle,
                radius,
                barLength,
                color: item.color || getColor(Math.floor(idx / (Math.max(data.length, 1) / 12)) % 12),
            };
        });
    }, [data, innerRadius, maxRadius, computedTurns, center, getColor]);

    // Draw spiral guide line
    const spiralPath = useMemo(() => {
        const points = [];
        const totalAngle = computedTurns * 2 * Math.PI;
        const steps = 100;

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const angle = t * totalAngle - Math.PI / 2;
            const radius = innerRadius + t * (maxRadius - innerRadius);
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
        }

        return points.join(' ');
    }, [computedTurns, innerRadius, maxRadius, center]);

    const hoveredData = hoveredIndex !== null ? spiralData[hoveredIndex] : null;

    return (
        <ChartShell
            className={cn(spiralPlotVariants(), className)}
            height={size}
            width={size}
        >
            <svg width={size} height={size} className="chart--spiral__svg" role="img" aria-label={`Spiral plot with ${spiralData.length} data points`}>
                {/* Spiral guide line */}
                <path
                    d={spiralPath}
                    className="chart--spiral__guide-path"
                    stroke={semanticColors.grid}
                />

                {/* Data bars */}
                {spiralData.map((item: any, idx: number) => {
                    const isHovered = hoveredIndex === idx;
                    const tooltipHandlers = getHandlers(`${item.label}: ${valueFormatter(item.value)}`);

                    return (
                        <g
                            key={idx}
                            onMouseEnter={(e) => {
                                setHoveredIndex(idx);
                                tooltipHandlers.onMouseEnter(e);
                            }}
                            onMouseLeave={() => {
                                setHoveredIndex(null);
                                tooltipHandlers.onMouseLeave();
                            }}
                            className="chart--spiral__bar-group"
                        >
                            <line
                                x1={item.startX}
                                y1={item.startY}
                                x2={item.endX}
                                y2={item.endY}
                                stroke={item.color}
                                strokeWidth={isHovered ? barWidth * 1.5 : barWidth}
                                className={cn('chart--spiral__bar', {
                                    'chart--spiral__bar--hovered': isHovered
                                })}
                            />
                        </g>
                    );
                })}

                {/* Center text */}
                <text
                    x={center}
                    y={center - 5}
                    textAnchor="middle"
                    className="chart--spiral__center-text-main"
                    fill={semanticColors.text}
                >
                    {data.length}
                </text>
                <text
                    x={center}
                    y={center + 10}
                    textAnchor="middle"
                    className="chart--spiral__center-text-sub"
                    fill={semanticColors.text}
                >
                    items
                </text>
            </svg>

            <SVGTooltip tooltip={tooltip} />

            {/* Hover info */}
            {hoveredData && (
                <div className="chart--spiral__hover-info">
                    <strong>{hoveredData.label}</strong>: {valueFormatter(hoveredData.value)}
                </div>
            )}
        </ChartShell>
    );
};

export default SpiralPlot;
