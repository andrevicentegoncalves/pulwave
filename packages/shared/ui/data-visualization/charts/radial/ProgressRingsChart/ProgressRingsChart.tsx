import { useState, useCallback, useRef } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { ChartShell } from '../../../primitives/ChartShell';
import ChartLegend from '../../../primitives/ChartLegend';
import { progressRingsChartVariants, type ProgressRingsChartProps, type ProgressRingData } from './types';
import './styles/_index.scss';

/**
 * ProgressRingsChart Component
 *
 * Multiple concentric circular progress rings showing different metrics.
 */
export const ProgressRingsChart = ({
    data = [],
    centerValue,
    centerLabel,
    size = 200,
    strokeWidth = 12,
    gap = 4,
    showLegend = true,
    className,
}: ProgressRingsChartProps) => {
    const { getColor, semanticColors } = useChartContext();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const center = size / 2;
    const outerRadius = (size - strokeWidth) / 2;

    // Calculate radius for each ring
    const getRingRadius = (index: number) => {
        return outerRadius - (strokeWidth + gap) * index;
    };

    // Calculate stroke dasharray for progress
    const getCircleProps = (value: number, radius: number) => {
        const circumference = 2 * Math.PI * radius;
        const progress = (value / 100) * circumference;
        return {
            circumference,
            dashArray: `${progress} ${circumference - progress}`,
        };
    };

    const handleLegendHover = useCallback((index: number) => {
        if (!svgRef.current) return;
        setHoveredIndex(index);

        const ring = svgRef.current.querySelector(`[data-ring-index="${index}"]`);
        if (ring) {
            ring.classList.add('chart--progress-rings__ring-group--legend-hovered');
        }
    }, []);

    const handleLegendLeave = useCallback(() => {
        if (!svgRef.current) return;
        setHoveredIndex(null);

        const rings = svgRef.current.querySelectorAll('.chart--progress-rings__ring-group--legend-hovered');
        rings.forEach(r => r.classList.remove('chart--progress-rings__ring-group--legend-hovered'));
    }, []);

    return (
        <ChartShell
            className={cn(progressRingsChartVariants(), className)}
            height={size}
            width={size}
            responsive={false}
        >
            <svg ref={svgRef} width={size} height={size} className="chart--progress-rings__svg" role="img" aria-label={`Progress rings chart with ${data.length} rings`}>
                {data.map((item: ProgressRingData, idx: number) => {
                    const color = item.color || getColor(idx);
                    const radius = getRingRadius(idx);
                    const { dashArray } = getCircleProps(item.value, radius);

                    const isHovered = hoveredIndex === idx;

                    return (
                        <g
                            key={idx}
                            data-ring-index={idx}
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="chart--progress-rings__ring-group"
                        >
                            {/* Background ring */}
                            <circle
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="none"
                                className="chart--progress-rings__ring-track"
                                strokeWidth={strokeWidth}
                            />
                            {/* Progress ring */}
                            <circle
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="none"
                                stroke={color}
                                strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                                strokeDasharray={dashArray}
                                strokeLinecap="round"
                                transform={`rotate(-90 ${center} ${center})`}
                                className={cn('chart--progress-rings__ring-progress', {
                                    'chart--progress-rings__ring-progress--hovered': isHovered
                                })}
                            />
                        </g>
                    );
                })}

                {/* Center text */}
                {(centerValue || centerLabel) && (() => {
                    const innerRadius = getRingRadius(data.length - 1) - strokeWidth / 2 - 8;
                    const maxTextWidth = innerRadius * 1.6;
                    const fontSize = Math.min(size / 6, maxTextWidth / 2.5);

                    return (
                        <g>
                            {centerValue && (
                                <text
                                    x={center}
                                    y={centerLabel ? center - 6 : center}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize={fontSize}
                                    className="chart--progress-rings__center-value"
                                    fill={semanticColors.text}
                                >
                                    {centerValue}
                                </text>
                            )}
                            {centerLabel && (
                                <text
                                    x={center}
                                    y={center + fontSize / 2 + 4}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize={fontSize * 0.5}
                                    className="chart--progress-rings__center-label"
                                    fill={semanticColors.textMuted}
                                >
                                    {centerLabel}
                                </text>
                            )}
                        </g>
                    );
                })()}
            </svg>

            {/* Legend */}
            {showLegend && (
                <ChartLegend
                    payload={data.map((item: ProgressRingData, idx: number) => ({
                        id: String(idx),
                        value: item.name,
                        color: item.color || getColor(idx),
                    }))}
                    activeIndex={hoveredIndex}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                />
            )}
        </ChartShell>
    );
};

export default ProgressRingsChart;
