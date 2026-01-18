import React, { useMemo, useState, useCallback, useRef } from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import ChartLegend from '../../../primitives/ChartLegend';
import { useChartContext } from '../../../providers/ChartProvider';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { pyramidChartVariants, type PyramidChartProps, type PyramidData } from './types';
import './styles/_index.scss';

/**
 * PyramidChart Component
 * 
 * Triangular/pyramid chart showing hierarchical data from top to bottom.
 * Great for showing funnel stages, population pyramids, or hierarchical structures.
 */
export function PyramidChart({
    data = [],
    width = 400,
    height = 350,
    showLabels = true,
    showValues = true,
    showLegend = false,
    variant = 'funnel',
    valueFormatter = (v: number) => v?.toLocaleString() ?? '',
    className,
}: PyramidChartProps) {
    const { getColor, semanticColors } = useChartContext();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const { tooltip, getHandlers } = useSVGTooltip();
    const svgRef = useRef<SVGSVGElement>(null);

    // Process data and calculate dimensions
    const segments = useMemo(() => {
        const total = data.reduce((sum: number, d: PyramidData) => sum + d.value, 0);
        const segmentHeight = (height as number) / Math.max(data.length, 1);
        const maxWidth = (width as number) * 0.9;
        const minWidth = variant === 'pyramid' ? 0 : (width as number) * 0.2;

        return data.map((item: PyramidData, idx: number) => {
            let topWidth, bottomWidth;

            if (variant === 'aligned') {
                const topRatio = idx / data.length;
                const bottomRatio = (idx + 1) / data.length;
                topWidth = maxWidth * topRatio;
                bottomWidth = maxWidth * bottomRatio;
            } else if (variant === 'stacked') {
                topWidth = maxWidth;
                bottomWidth = maxWidth;
            } else {
                const ratio = idx / (data.length - 1 || 1);
                topWidth = minWidth + (maxWidth - minWidth) * ratio;
                bottomWidth = minWidth + (maxWidth - minWidth) * ((idx + 1) / data.length);
            }

            return {
                ...item,
                color: item.color || getColor(idx),
                topWidth,
                bottomWidth: idx === data.length - 1 && variant === 'aligned' ? maxWidth : bottomWidth,
                y: idx * segmentHeight,
                height: segmentHeight,
                percentage: (item.value / (total || 1) * 100).toFixed(1),
            };
        });
    }, [data, width, height, variant, getColor]);

    const centerX = (width as number) / 2;

    const handleLegendHover = useCallback((index: number) => {
        if (!svgRef.current) return;
        setHoveredIndex(index);

        const segment = svgRef.current.querySelector(`[data-segment-index="${index}"]`);
        if (segment) {
            segment.classList.add('chart--pyramid__segment--legend-hovered');
        }
    }, []);

    const handleLegendLeave = useCallback(() => {
        if (!svgRef.current) return;
        setHoveredIndex(null);

        const segments = svgRef.current.querySelectorAll('.chart--pyramid__segment--legend-hovered');
        segments.forEach(s => s.classList.remove('chart--pyramid__segment--legend-hovered'));
    }, []);

    const getTrapezoidPath = (segment: any) => {
        const { y, height: h, topWidth, bottomWidth } = segment;
        const topLeft = centerX - topWidth / 2;
        const topRight = centerX + topWidth / 2;
        const bottomLeft = centerX - bottomWidth / 2;
        const bottomRight = centerX + bottomWidth / 2;

        return `M ${topLeft} ${y} L ${topRight} ${y} L ${bottomRight} ${y + h} L ${bottomLeft} ${y + h} Z`;
    };

    return (
        <ChartShell
            className={cn(pyramidChartVariants(), className)}
            height={height}
            width={width}
        >
            <svg ref={svgRef} width={width} height={height} className="chart--pyramid__svg" role="img" aria-label={`Pyramid chart with ${data.length} segments`}>
                {segments.map((segment: any, idx: number) => {
                    const isHovered = hoveredIndex === idx;
                    const scale = isHovered ? 1.05 : 1;
                    const centerY = segment.y + segment.height / 2;
                    const tooltipHandlers = getHandlers(`${segment.name}: ${valueFormatter(segment.value)} (${segment.percentage}%)`);

                    return (
                        <g
                            key={idx}
                            data-segment-index={idx}
                            onMouseEnter={(e) => {
                                setHoveredIndex(idx);
                                tooltipHandlers.onMouseEnter(e);
                            }}
                            onMouseLeave={() => {
                                setHoveredIndex(null);
                                tooltipHandlers.onMouseLeave();
                            }}
                            className="chart--pyramid__segment-group"
                        >
                            <path
                                d={getTrapezoidPath(segment)}
                                fill={segment.color}
                                className={cn('chart--pyramid__segment', {
                                    'chart--pyramid__segment--hovered': isHovered
                                })}
                                style={{
                                    transform: `scale(${scale})`,
                                    transformOrigin: `${centerX}px ${centerY}px`
                                }}
                            />

                            {showLabels && (isHovered || segment.topWidth > 80) && (
                                <text
                                    x={centerX}
                                    y={segment.y + segment.height / 2}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className={cn('chart--pyramid__label', {
                                        'chart--pyramid__label--hovered': isHovered
                                    })}
                                >
                                    {segment.name.length > 12 && !isHovered
                                        ? segment.name.substring(0, 10) + '…'
                                        : segment.name}
                                </text>
                            )}

                            {showValues && (
                                <text
                                    x={(width as number) * 0.95}
                                    y={segment.y + segment.height / 2}
                                    textAnchor="end"
                                    dominantBaseline="middle"
                                    className={cn('chart--pyramid__value', {
                                        'chart--pyramid__value--hovered': isHovered
                                    })}
                                    fill={isHovered ? segment.color : undefined}
                                >
                                    {valueFormatter(segment.value)} ({segment.percentage}%)
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>

            <SVGTooltip tooltip={tooltip} />

            {showLegend && (
                <ChartLegend
                    payload={segments.map((segment: any, idx: number) => ({
                        id: String(idx),
                        value: `${segment.name} (${segment.percentage}%)`,
                        color: segment.color,
                    }))}
                    activeIndex={hoveredIndex}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                />
            )}
        </ChartShell>
    );
}

export default PyramidChart;
