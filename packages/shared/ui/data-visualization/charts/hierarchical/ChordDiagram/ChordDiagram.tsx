import React, { useMemo, useState, useCallback, useRef } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import ChartLegend from '../../../primitives/ChartLegend';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { chordDiagramVariants, type ChordDiagramProps, type ChordData } from './types';
import './styles/_index.scss';

/**
 * ChordDiagram Component
 * 
 * Circular visualization showing relationships between entities.
 * Arc segments represent entities, ribbons show connections between them.
 */
export function ChordDiagram({
    data = [],
    size = 500,
    innerRadius = 0.7,
    padAngle = 0.02,
    arcWidth = 20,
    showLabels = true,
    className,
}: ChordDiagramProps) {
    const { getColor, semanticColors } = useChartContext();
    const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
    const { tooltip, getHandlers } = useSVGTooltip();
    const svgRef = useRef<SVGSVGElement>(null);

    const center = size / 2;
    const radius = (size / 2) - 50;
    const innerR = radius * innerRadius;

    // Extract unique entities and build matrix
    const { entities, matrix, entityColors, connections } = useMemo(() => {
        const entitySet = new Set<string>();
        data.forEach((d: ChordData) => {
            entitySet.add(d.from);
            entitySet.add(d.to);
        });
        const entitiesArr = Array.from(entitySet);

        // Create adjacency matrix
        const matrixData = entitiesArr.map(() => entitiesArr.map(() => 0));
        data.forEach((d: ChordData) => {
            const fromIdx = entitiesArr.indexOf(d.from);
            const toIdx = entitiesArr.indexOf(d.to);
            if (fromIdx !== -1 && toIdx !== -1) {
                matrixData[fromIdx][toIdx] += d.value;
            }
        });

        // Calculate colors
        const colors: Record<string, string> = {};
        entitiesArr.forEach((entity: string, idx: number) => {
            colors[entity] = getColor(idx);
        });

        return {
            entities: entitiesArr,
            matrix: matrixData,
            entityColors: colors,
            connections: data,
        };
    }, [data, getColor]);

    // Calculate arc positions
    const arcs = useMemo(() => {
        const total = entities.reduce((sum: number, entity: string, idx: number) => {
            return sum + matrix[idx].reduce((s: number, v: number) => s + v, 0) +
                matrix.reduce((s: number, row: number[]) => s + row[idx], 0);
        }, 0) / 2;

        let currentAngle = 0;
        const arcData: any[] = [];

        entities.forEach((entity: string, idx: number) => {
            const entityTotal = matrix[idx].reduce((s: number, v: number) => s + v, 0) +
                matrix.reduce((s: number, row: number[]) => s + row[idx], 0);
            const angle = (entityTotal / (total * 2 || 1)) * (2 * Math.PI - entities.length * padAngle);

            arcData.push({
                entity,
                startAngle: currentAngle,
                endAngle: currentAngle + angle,
                color: entityColors[entity],
            });

            currentAngle += angle + padAngle;
        });

        return arcData;
    }, [entities, matrix, entityColors, padAngle]);

    // Calculate ribbon paths
    const ribbons = useMemo(() => {
        const ribbonData: any[] = [];

        connections.forEach((conn: ChordData) => {
            const fromArc = arcs.find((a: any) => a.entity === conn.from);
            const toArc = arcs.find((a: any) => a.entity === conn.to);
            if (!fromArc || !toArc) return;

            ribbonData.push({
                from: conn.from,
                to: conn.to,
                value: conn.value,
                fromStartAngle: fromArc.startAngle,
                fromEndAngle: fromArc.startAngle + (fromArc.endAngle - fromArc.startAngle) * 0.5,
                toStartAngle: toArc.startAngle,
                toEndAngle: toArc.startAngle + (toArc.endAngle - toArc.startAngle) * 0.5,
                color: entityColors[conn.from],
            });
        });

        return ribbonData;
    }, [connections, arcs, entityColors]);

    // Handle legend hover - highlight corresponding entity
    const handleLegendHover = useCallback((index: number) => {
        if (!svgRef.current) return;
        const entity = entities[index];
        if (!entity) return;

        setHoveredEntity(entity);

        const arcGroup = svgRef.current.querySelector(`[data-entity-index="${index}"]`);
        if (arcGroup) {
            arcGroup.classList.add('chart--chord__arc-group--legend-hovered');
        }
    }, [entities]);

    const handleLegendLeave = useCallback(() => {
        if (!svgRef.current) return;
        setHoveredEntity(null);

        const groups = svgRef.current.querySelectorAll('.chart--chord__arc-group--legend-hovered');
        groups.forEach(g => g.classList.remove('chart--chord__arc-group--legend-hovered'));
    }, []);

    // Generate arc path
    const getArcPath = (startAngle: number, endAngle: number, r: number) => {
        const startX = center + r * Math.cos(startAngle - Math.PI / 2);
        const startY = center + r * Math.sin(startAngle - Math.PI / 2);
        const endX = center + r * Math.cos(endAngle - Math.PI / 2);
        const endY = center + r * Math.sin(endAngle - Math.PI / 2);
        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

        return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`;
    };

    // Generate ribbon path
    const getRibbonPath = (ribbon: any) => {
        const r = innerR;
        const fromStart = { x: center + r * Math.cos(ribbon.fromStartAngle - Math.PI / 2), y: center + r * Math.sin(ribbon.fromStartAngle - Math.PI / 2) };
        const fromEnd = { x: center + r * Math.cos(ribbon.fromEndAngle - Math.PI / 2), y: center + r * Math.sin(ribbon.fromEndAngle - Math.PI / 2) };
        const toStart = { x: center + r * Math.cos(ribbon.toStartAngle - Math.PI / 2), y: center + r * Math.sin(ribbon.toStartAngle - Math.PI / 2) };
        const toEnd = { x: center + r * Math.cos(ribbon.toEndAngle - Math.PI / 2), y: center + r * Math.sin(ribbon.toEndAngle - Math.PI / 2) };

        return `
            M ${fromStart.x} ${fromStart.y}
            Q ${center} ${center} ${toStart.x} ${toStart.y}
            A ${r} ${r} 0 0 1 ${toEnd.x} ${toEnd.y}
            Q ${center} ${center} ${fromEnd.x} ${fromEnd.y}
            A ${r} ${r} 0 0 1 ${fromStart.x} ${fromStart.y}
            Z
        `;
    };

    return (
        <div className={cn(chordDiagramVariants(), className)}>
            <svg ref={svgRef} width={size} height={size} className="chart--chord__svg" role="img" aria-label={`Chord diagram showing relationships between ${entities.length} entities`}>
                {/* Ribbons (connections) */}
                {ribbons.map((ribbon: any, idx: number) => {
                    const ribbonHandlers = getHandlers(`${ribbon.from} → ${ribbon.to}: ${ribbon.value}`);
                    return (
                        <path
                            key={idx}
                            d={getRibbonPath(ribbon)}
                            fill={ribbon.color}
                            fillOpacity={hoveredEntity === null || hoveredEntity === ribbon.from || hoveredEntity === ribbon.to ? 0.5 : 0.1}
                            stroke={ribbon.color}
                            className="chart--chord__ribbon"
                            onMouseEnter={(e) => {
                                setHoveredEntity(ribbon.from);
                                ribbonHandlers.onMouseEnter(e);
                            }}
                            onMouseLeave={() => {
                                setHoveredEntity(null);
                                ribbonHandlers.onMouseLeave();
                            }}
                        />
                    );
                })}

                {/* Arcs (entities) */}
                {arcs.map((arc: any, idx: number) => {
                    const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;
                    const labelRadius = radius + 25;
                    const labelX = center + labelRadius * Math.cos(midAngle);
                    const labelY = center + labelRadius * Math.sin(midAngle);
                    const tooltipHandlers = getHandlers(arc.entity);

                    return (
                        <g
                            key={idx}
                            data-entity-index={idx}
                            onMouseEnter={(e) => {
                                setHoveredEntity(arc.entity);
                                tooltipHandlers.onMouseEnter(e);
                            }}
                            onMouseLeave={() => {
                                setHoveredEntity(null);
                                tooltipHandlers.onMouseLeave();
                            }}
                            className="chart--chord__arc-group"
                        >
                            <path
                                d={getArcPath(arc.startAngle, arc.endAngle, radius)}
                                className="chart--chord__arc"
                                stroke={arc.color}
                                strokeWidth={arcWidth}
                                opacity={hoveredEntity === null || hoveredEntity === arc.entity ? 1 : 0.3}
                            />
                            {showLabels && (
                                <text
                                    x={labelX}
                                    y={labelY}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="chart--chord__label"
                                    transform={`rotate(${midAngle * (180 / Math.PI) + 90}, ${labelX}, ${labelY})`}
                                >
                                    {arc.entity}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>

            <ChartLegend
                payload={arcs.map((arc: any, idx: number) => ({
                    id: String(idx),
                    value: arc.entity,
                    color: arc.color,
                }))}
                activeIndex={arcs.findIndex((a: any) => a.entity === hoveredEntity)}
                onItemHover={handleLegendHover}
                onItemLeave={handleLegendLeave}
            />

            <SVGTooltip tooltip={tooltip} />
        </div>
    );
}

export default ChordDiagram;
