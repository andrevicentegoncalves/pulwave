import { useMemo, useState, useCallback, useRef } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { ChartShell } from '../../../primitives/ChartShell';
import ChartLegend from '../../../primitives/ChartLegend';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { roseChartVariants, type RoseChartProps, type RoseData } from './types';
import './styles/_index.scss';

/**
 * RoseChart Component (Nightingale Chart)
 *
 * Pie chart variant where segment radius varies with value.
 * Also known as Nightingale or Coxcomb chart.
 */
export const RoseChart = ({
    data = [],
    size = 400,
    innerRadius = 0,
    showLabels = true,
    showLegend = true,
    startAngle = 0,
    valueFormatter = (v: number) => v?.toLocaleString() ?? '',
    className,
}: RoseChartProps) => {
    const { getColor, semanticColors } = useChartContext();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const { tooltip, getHandlers } = useSVGTooltip();
    const svgRef = useRef<SVGSVGElement>(null);

    const center = size / 2;
    const maxRadius = (size / 2) - 40;
    const minRadius = innerRadius * maxRadius;

    // Process data
    const segments = useMemo(() => {
        const total = data.reduce((sum: number, d: RoseData) => sum + d.value, 0) || 1;
        const maxValue = Math.max(...data.map((d: RoseData) => d.value), 1);
        const anglePerSegment = (2 * Math.PI) / (data.length || 1);

        let currentAngle = (startAngle * Math.PI) / 180;

        return data.map((item: RoseData, idx: number) => {
            const segmentStartAngle = currentAngle;
            const segmentEndAngle = currentAngle + anglePerSegment;
            const radius = minRadius + ((item.value / maxValue) * (maxRadius - minRadius));

            currentAngle = segmentEndAngle;

            return {
                ...item,
                color: item.color || getColor(idx),
                startAngle: segmentStartAngle,
                endAngle: segmentEndAngle,
                radius,
                percentage: ((item.value / total) * 100).toFixed(1),
            };
        });
    }, [data, maxRadius, minRadius, startAngle, getColor]);

    const handleLegendHover = useCallback((index: number) => {
        if (!svgRef.current) return;
        setHoveredIndex(index);

        const segment = svgRef.current.querySelector(`[data-segment-index="${index}"]`);
        if (segment) {
            segment.classList.add('chart--rose__segment-group--legend-hovered');
        }
    }, []);

    const handleLegendLeave = useCallback(() => {
        if (!svgRef.current) return;
        setHoveredIndex(null);

        const segments = svgRef.current.querySelectorAll('.chart--rose__segment-group--legend-hovered');
        segments.forEach(s => s.classList.remove('chart--rose__segment-group--legend-hovered'));
    }, []);

    // Generate rose petal path
    const getPetalPath = (segment: any, isHovered: boolean) => {
        const r = isHovered ? segment.radius * 1.05 : segment.radius;
        const inner = minRadius;

        const startX1 = center + inner * Math.cos(segment.startAngle - Math.PI / 2);
        const startY1 = center + inner * Math.sin(segment.startAngle - Math.PI / 2);
        const endX1 = center + inner * Math.cos(segment.endAngle - Math.PI / 2);
        const endY1 = center + inner * Math.sin(segment.endAngle - Math.PI / 2);

        const startX2 = center + r * Math.cos(segment.startAngle - Math.PI / 2);
        const startY2 = center + r * Math.sin(segment.startAngle - Math.PI / 2);
        const endX2 = center + r * Math.cos(segment.endAngle - Math.PI / 2);
        const endY2 = center + r * Math.sin(segment.endAngle - Math.PI / 2);

        const largeArc = segment.endAngle - segment.startAngle > Math.PI ? 1 : 0;

        if (inner > 0) {
            return `
                M ${startX1} ${startY1}
                L ${startX2} ${startY2}
                A ${r} ${r} 0 ${largeArc} 1 ${endX2} ${endY2}
                L ${endX1} ${endY1}
                A ${inner} ${inner} 0 ${largeArc} 0 ${startX1} ${startY1}
                Z
            `;
        }

        return `
            M ${center} ${center}
            L ${startX2} ${startY2}
            A ${r} ${r} 0 ${largeArc} 1 ${endX2} ${endY2}
            Z
        `;
    };

    return (
        <ChartShell
            className={cn(roseChartVariants(), className)}
            height={size}
            width={size}
        >
            <div className="chart--rose__container">
                <svg ref={svgRef} width={size} height={size} className="chart--rose__svg" role="img" aria-label={`Rose chart with ${data.length} segments`}>
                    {/* Grid circles */}
                    {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
                        <circle
                            key={i}
                            cx={center}
                            cy={center}
                            r={minRadius + (maxRadius - minRadius) * ratio}
                            className="chart--rose__grid-circle"
                        />
                    ))}

                    {/* Segments */}
                    {segments.map((segment: any, idx: number) => {
                        const isHovered = hoveredIndex === idx;
                        const midAngle = (segment.startAngle + segment.endAngle) / 2 - Math.PI / 2;
                        // Increase label distance - use max radius + padding instead of segment radius
                        const labelRadius = maxRadius + 50;
                        const labelX = center + labelRadius * Math.cos(midAngle);
                        const labelY = center + labelRadius * Math.sin(midAngle);

                        // Adjust text anchor based on label position for better readability
                        const angle = (midAngle + Math.PI / 2) % (2 * Math.PI);
                        let textAnchor: 'start' | 'middle' | 'end' = 'middle';
                        if (angle > 0.2 && angle < Math.PI - 0.2) {
                            textAnchor = 'start'; // Right side
                        } else if (angle > Math.PI + 0.2 && angle < 2 * Math.PI - 0.2) {
                            textAnchor = 'end'; // Left side
                        }

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
                                className="chart--rose__segment-group"
                            >
                                <path
                                    d={getPetalPath(segment, isHovered)}
                                    fill={segment.color}
                                    fillOpacity={isHovered ? 1 : 0.8}
                                    className="chart--rose__segment-path"
                                />

                                {showLabels && (
                                    <text
                                        x={labelX}
                                        y={labelY}
                                        textAnchor={textAnchor}
                                        dominantBaseline="middle"
                                        className="chart--rose__label"
                                        fill={semanticColors.text}
                                    >
                                        {segment.name}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Legend */}
                {showLegend && (
                    <ChartLegend
                        payload={segments.map((segment: any, idx: number) => ({
                            id: String(idx),
                            value: `${segment.name}: ${segment.percentage}%`,
                            color: segment.color,
                        }))}
                        activeIndex={hoveredIndex}
                        onItemHover={handleLegendHover}
                        onItemLeave={handleLegendLeave}
                    />
                )}

                <SVGTooltip tooltip={tooltip} />
            </div>
        </ChartShell>
    );
};

export default RoseChart;
