import React, { useMemo, useState } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { flowChartVariants, type FlowChartProps, type FlowNode, type FlowEdge } from './types';
import './styles/_index.scss';

/**
 * FlowChart Component
 * 
 * Simple flowchart showing process steps and connections.
 */
export function FlowChart({
    nodes = [],
    edges = [],
    orientation = 'vertical',
    nodeWidth = 140,
    nodeHeight = 50,
    horizontalGap = 60,
    verticalGap = 50,
    showLabels = true,
    className,
}: FlowChartProps) {
    const { getColor, semanticColors } = useChartContext();
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const { tooltip, getHandlers } = useSVGTooltip();

    // Calculate layout
    const layout = useMemo(() => {
        const padding = 40;
        const nodePositions: Record<string, { x: number; y: number }> = {};

        const isVertical = orientation === 'vertical';

        nodes.forEach((node: FlowNode, idx: number) => {
            if (isVertical) {
                nodePositions[node.id] = {
                    x: padding + (nodeWidth / 2),
                    y: padding + idx * (nodeHeight + verticalGap) + nodeHeight / 2,
                };
            } else {
                nodePositions[node.id] = {
                    x: padding + idx * (nodeWidth + horizontalGap) + nodeWidth / 2,
                    y: padding + nodeHeight / 2,
                };
            }
        });

        const width = isVertical
            ? nodeWidth + padding * 2 + 40
            : nodes.length * (nodeWidth + horizontalGap) + padding * 2;
        const height = isVertical
            ? nodes.length * (nodeHeight + verticalGap) + padding * 2
            : nodeHeight + padding * 2 + 40;

        return { positions: nodePositions, width, height };
    }, [nodes, orientation, nodeWidth, nodeHeight, horizontalGap, verticalGap]);

    // Get shape path based on node type
    const getNodeShape = (node: FlowNode, x: number, y: number) => {
        const hw = nodeWidth / 2;
        const hh = nodeHeight / 2;

        switch (node.type) {
            case 'start':
            case 'end':
                // Rounded rectangle (stadium)
                return `M ${x - hw + hh} ${y - hh} 
                        L ${x + hw - hh} ${y - hh} 
                        A ${hh} ${hh} 0 0 1 ${x + hw - hh} ${y + hh}
                        L ${x - hw + hh} ${y + hh}
                        A ${hh} ${hh} 0 0 1 ${x - hw + hh} ${y - hh} Z`;
            case 'decision':
                // Diamond
                return `M ${x} ${y - hh} L ${x + hw} ${y} L ${x} ${y + hh} L ${x - hw} ${y} Z`;
            case 'io':
                // Parallelogram
                const skew = 15;
                return `M ${x - hw + skew} ${y - hh} L ${x + hw + skew} ${y - hh} L ${x + hw - skew} ${y + hh} L ${x - hw - skew} ${y + hh} Z`;
            default:
                // Rectangle
                return `M ${x - hw} ${y - hh} L ${x + hw} ${y - hh} L ${x + hw} ${y + hh} L ${x - hw} ${y + hh} Z`;
        }
    };

    // Get node colors
    const getNodeColor = (node: FlowNode, idx: number) => {
        if (node.color) return node.color;
        switch (node.type) {
            case 'start': return semanticColors.success;
            case 'end': return semanticColors.error;
            case 'decision': return semanticColors.warning;
            default: return getColor(idx);
        }
    };


    // Calculate edge path
    const getEdgePath = (edge: FlowEdge) => {
        const from = layout.positions[edge.from];
        const to = layout.positions[edge.to];
        if (!from || !to) return null;

        const fromNode = nodes.find(n => n.id === edge.from);

        // Calculate exit/entry points based on orientation
        let startX = from.x;
        let startY = from.y + nodeHeight / 2;
        let endX = to.x;
        let endY = to.y - nodeHeight / 2;

        if (orientation === 'horizontal') {
            startX = from.x + nodeWidth / 2;
            startY = from.y;
            endX = to.x - nodeWidth / 2;
            endY = to.y;
        }

        // Adjust for decision nodes
        if (fromNode?.type === 'decision') {
            if (edge.branch === 'right' || edge.branch === 'yes') {
                startX = from.x + nodeWidth / 2;
                startY = from.y;
            }
        }

        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        return {
            path: orientation === 'vertical'
                ? `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`
                : `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`,
            endX,
            endY,
            arrowAngle: orientation === 'vertical' ? 90 : 0,
        };
    };

    return (
        <div className={cn(flowChartVariants({ orientation }), className)}>
            <svg
                width={layout.width}
                height={layout.height}
                className="chart--flow__svg"
                role="img"
                aria-label={`Flow chart with ${nodes.length} steps`}
            >
                {/* Edges */}
                {edges.map((edge: FlowEdge, idx: number) => {
                    const edgeData = getEdgePath(edge);
                    if (!edgeData) return null;

                    return (
                        <g key={idx} className="chart--flow__edge-group">
                            <path
                                d={edgeData.path}
                                stroke={semanticColors.border}
                                strokeWidth={2.5}
                                fill="none"
                                className="chart--flow__edge-path"
                            />
                            {/* Arrow head */}
                            <polygon
                                points="0,-5 10,0 0,5"
                                fill={semanticColors.border}
                                className="chart--flow__edge-arrow"
                                transform={`translate(${edgeData.endX}, ${edgeData.endY}) rotate(${edgeData.arrowAngle})`}
                            />
                            {/* Edge label */}
                            {edge.label && showLabels && (
                                <text
                                    x={(layout.positions[edge.from].x + layout.positions[edge.to].x) / 2}
                                    y={(layout.positions[edge.from].y + layout.positions[edge.to].y) / 2 - 5}
                                    className="chart--flow__edge-label"
                                >
                                    {edge.label}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Nodes */}
                {nodes.map((node: FlowNode, idx: number) => {
                    const pos = layout.positions[node.id];
                    if (!pos) return null;
                    const isHovered = hoveredNode === node.id;
                    const color = getNodeColor(node, idx);
                    const tooltipHandlers = node.description ? getHandlers(node.description) : {};

                    return (
                        <g
                            key={node.id}
                            onMouseEnter={() => setHoveredNode(node.id)}
                            onMouseLeave={() => setHoveredNode(null)}
                            className="chart--flow__node-group"
                            {...tooltipHandlers}
                        >
                            <path
                                d={getNodeShape(node, pos.x, pos.y)}
                                fill={isHovered ? color : semanticColors.background}
                                stroke={color}
                                className="chart--flow__node-shape"
                            />
                            <text
                                x={pos.x}
                                y={pos.y + 4}
                                textAnchor="middle"
                                className="chart--flow__node-label"
                                fill={isHovered ? 'white' : semanticColors.text}
                            >
                                {node.label || node.id}
                            </text>
                        </g>
                    );
                })}
            </svg>

            <SVGTooltip tooltip={tooltip} />
        </div>
    );
}

export default FlowChart;
