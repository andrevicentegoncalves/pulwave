import { useMemo, useState, useCallback, useRef } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { ChartShell } from '../../../primitives/ChartShell';
import ChartLegend from '../../../primitives/ChartLegend';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { polarAreaChartVariants, type PolarAreaChartProps } from './types';
import './styles/_index.scss';

/**
 * PolarAreaChart Component
 *
 * Pie-like chart where all sectors have equal angle but different radii.
 * Also known as Coxcomb chart (similar to Rose but equal angles).
 */
export const PolarAreaChart = ({
    data = [],
    size = 400,
    innerRadius = 0,
    showLabels = true,
    showLegend = true,
    startAngle = 0,
    valueFormatter = (v: number) => v?.toLocaleString() ?? '',
    className,
}: PolarAreaChartProps) => {
    const { getColor, semanticColors } = useChartContext();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const { tooltip, getHandlers } = useSVGTooltip();
    const svgRef = useRef<SVGSVGElement>(null);

    const center = size / 2;
    const maxRadius = (size / 2) - 40;

    // Process data - equal angles, variable radius
    const sectors = useMemo(() => {
        const maxValue = Math.max(...data.map((d: any) => d.value), 1);
        const anglePerSector = (2 * Math.PI) / (data.length || 1);
        const startRad = (startAngle * Math.PI) / 180;

        return data.map((item: any, idx: number) => {
            const sectorStartAngle = startRad + idx * anglePerSector - Math.PI / 2;
            const sectorEndAngle = sectorStartAngle + anglePerSector;
            const radius = innerRadius + ((item.value / maxValue) * (maxRadius - innerRadius));

            return {
                ...item,
                startAngle: sectorStartAngle,
                endAngle: sectorEndAngle,
                radius,
                color: item.color || getColor(idx),
                percentage: ((item.value / maxValue) * 100).toFixed(0),
            };
        });
    }, [data, maxRadius, innerRadius, startAngle, getColor]);

    const handleLegendHover = useCallback((index: number) => {
        if (!svgRef.current) return;
        setHoveredIndex(index);

        const sector = svgRef.current.querySelector(`[data-sector-index="${index}"]`);
        if (sector) {
            sector.classList.add('chart--polar-area__sector-group--legend-hovered');
        }
    }, []);

    const handleLegendLeave = useCallback(() => {
        if (!svgRef.current) return;
        setHoveredIndex(null);

        const sectors = svgRef.current.querySelectorAll('.chart--polar-area__sector-group--legend-hovered');
        sectors.forEach(s => s.classList.remove('chart--polar-area__sector-group--legend-hovered'));
    }, []);

    // Generate sector path
    const getSectorPath = (sector: any, isHovered: boolean) => {
        const r = isHovered ? sector.radius * 1.05 : sector.radius;
        const inner = innerRadius;
        const { startAngle, endAngle } = sector;

        if (inner === 0) {
            // Pie slice from center
            const startX = center + r * Math.cos(startAngle);
            const startY = center + r * Math.sin(startAngle);
            const endX = center + r * Math.cos(endAngle);
            const endY = center + r * Math.sin(endAngle);
            const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

            return `M ${center} ${center} L ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY} Z`;
        }

        // Donut sector
        const startInnerX = center + inner * Math.cos(startAngle);
        const startInnerY = center + inner * Math.sin(startAngle);
        const endInnerX = center + inner * Math.cos(endAngle);
        const endInnerY = center + inner * Math.sin(endAngle);
        const startOuterX = center + r * Math.cos(startAngle);
        const startOuterY = center + r * Math.sin(startAngle);
        const endOuterX = center + r * Math.cos(endAngle);
        const endOuterY = center + r * Math.sin(endAngle);
        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

        return `
            M ${startInnerX} ${startInnerY}
            L ${startOuterX} ${startOuterY}
            A ${r} ${r} 0 ${largeArc} 1 ${endOuterX} ${endOuterY}
            L ${endInnerX} ${endInnerY}
            A ${inner} ${inner} 0 ${largeArc} 0 ${startInnerX} ${startInnerY}
            Z
        `;
    };

    return (
        <ChartShell
            className={cn(polarAreaChartVariants(), className)}
            height={size}
            width={size}
        >
            <div className="chart--polar-area__container">
                <svg ref={svgRef} width={size} height={size} className="chart--polar-area__svg" role="img" aria-label={`Polar area chart with ${data.length} sectors`}>
                    {/* Grid circles */}
                    {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
                        <circle
                            key={i}
                            cx={center}
                            cy={center}
                            r={innerRadius + (maxRadius - innerRadius) * ratio}
                            className="chart--polar-area__grid-circle"
                        />
                    ))}

                    {/* Sectors */}
                    {sectors.map((sector: any, idx: number) => {
                        const isHovered = hoveredIndex === idx;
                        const midAngle = (sector.startAngle + sector.endAngle) / 2;
                        const labelRadius = sector.radius + 20;
                        const tooltipHandlers = getHandlers(`${sector.name}: ${valueFormatter(sector.value)}`);

                        return (
                            <g
                                key={idx}
                                data-sector-index={idx}
                                onMouseEnter={(e) => {
                                    setHoveredIndex(idx);
                                    tooltipHandlers.onMouseEnter(e);
                                }}
                                onMouseLeave={() => {
                                    setHoveredIndex(null);
                                    tooltipHandlers.onMouseLeave();
                                }}
                                className="chart--polar-area__sector-group"
                            >
                                <path
                                    d={getSectorPath(sector, isHovered)}
                                    fill={sector.color}
                                    fillOpacity={isHovered ? 1 : 0.8}
                                    className="chart--polar-area__sector-path"
                                />

                                {/* Labels */}
                                {showLabels && (
                                    <text
                                        x={center + labelRadius * Math.cos(midAngle)}
                                        y={center + labelRadius * Math.sin(midAngle)}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="chart--polar-area__label"
                                        fill={semanticColors.text}
                                    >
                                        {sector.name}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Legend */}
                {showLegend && (
                    <ChartLegend
                        payload={sectors.map((sector: any, idx: number) => ({
                            id: String(idx),
                            value: `${sector.name}: ${valueFormatter(sector.value)}`,
                            color: sector.color,
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

export default PolarAreaChart;
