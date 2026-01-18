import React, { useMemo, useState, useCallback, useRef } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import ChartLegend from '../../../primitives/ChartLegend';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { networkDiagramVariants, type NetworkDiagramProps, type NetworkNode, type NetworkLink, type PositionedNode, type ProcessedLink } from './types';
import './styles/_index.scss';

/**
 * NetworkDiagram Component
 * 
 * Force-directed graph showing nodes and their connections.
 */
export function NetworkDiagram({
    nodes = [],
    links = [],
    width = 600,
    height = 400,
    nodeRadius = 20,
    linkWidth = 2,
    showLabels = true,
    groupColors = {},
    className,
}: NetworkDiagramProps) {
    const { getColor, semanticColors } = useChartContext();
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [hoveredGroup, setHoveredGroup] = useState<string | number | null>(null);
    const [dragging, setDragging] = useState<string | null>(null);
    const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
    const { tooltip, getHandlers } = useSVGTooltip();
    const svgRef = useRef<SVGSVGElement>(null);

    // Initialize node positions on first render with crossing-aware layout
    const initialLayout = useMemo(() => {
        const nodeMap: Record<string, PositionedNode> = {};
        const centerX = (width as number) / 2;
        const centerY = (height as number) / 2;
        const radius = Math.min(width as number, height as number) / 2.5;

        // Build adjacency info for smarter positioning
        const adjacency: Record<string, Set<string>> = {};
        nodes.forEach((node: NetworkNode) => {
            adjacency[node.id] = new Set();
        });
        links.forEach((link: NetworkLink) => {
            adjacency[link.source]?.add(link.target);
            adjacency[link.target]?.add(link.source);
        });

        // Group nodes by connectivity
        const groups: Record<string | number, NetworkNode[]> = {};
        nodes.forEach((node: NetworkNode) => {
            const group = node.group || 0;
            if (!groups[group]) groups[group] = [];
            groups[group].push(node);
        });

        const groupKeys = Object.keys(groups);

        // Sort nodes within groups by connectivity to minimize crossings
        groupKeys.forEach(groupKey => {
            groups[groupKey].sort((a, b) => {
                const aConnections = adjacency[a.id]?.size || 0;
                const bConnections = adjacency[b.id]?.size || 0;
                return bConnections - aConnections; // Most connected first
            });
        });

        // Position groups in a circle
        groupKeys.forEach((groupKey, gi) => {
            const groupNodes = groups[groupKey];
            const groupAngle = (2 * Math.PI) / groupKeys.length;
            const groupCenterAngle = gi * groupAngle - Math.PI / 2;

            // Calculate optimal radius for this group
            const groupRadius = radius * 0.6;
            const groupCenterX = centerX + groupRadius * Math.cos(groupCenterAngle);
            const groupCenterY = centerY + groupRadius * Math.sin(groupCenterAngle);

            // Position nodes within group
            if (groupNodes.length === 1) {
                // Single node at group center
                const node = groupNodes[0];
                nodeMap[node.id] = {
                    ...node,
                    x: groupCenterX,
                    y: groupCenterY,
                    color: (node.group !== undefined ? groupColors[node.group] : undefined) ?? node.color ?? getColor(gi),
                };
            } else {
                // Multiple nodes - arrange in a small arc
                const spreadRadius = Math.min(radius * 0.25, 50 + groupNodes.length * 15);
                groupNodes.forEach((node: NetworkNode, ni: number) => {
                    // Spread nodes in an arc perpendicular to the group direction
                    const arcAngle = groupCenterAngle + Math.PI / 2;
                    const nodeOffset = (ni - (groupNodes.length - 1) / 2) / Math.max(groupNodes.length - 1, 1);
                    const offsetAngle = nodeOffset * Math.PI / 4; // Max 45 degree spread

                    nodeMap[node.id] = {
                        ...node,
                        x: groupCenterX + spreadRadius * Math.sin(offsetAngle) * Math.cos(arcAngle),
                        y: groupCenterY + spreadRadius * Math.sin(offsetAngle) * Math.sin(arcAngle),
                        color: (node.group !== undefined ? groupColors[node.group] : undefined) ?? node.color ?? getColor(gi),
                    };
                });
            }
        });

        return nodeMap;
    }, [nodes, links, width, height, groupColors, getColor]);

    // Merge initial layout with user positions
    const currentNodes = useMemo((): PositionedNode[] => {
        return nodes.map((node: NetworkNode) => ({
            ...initialLayout[node.id],
            ...nodePositions[node.id],
        }));
    }, [nodes, initialLayout, nodePositions]);

    // Process links with current positions
    const processedLinks = useMemo((): ProcessedLink[] => {
        const nodeMap: Record<string, PositionedNode> = {};
        currentNodes.forEach((n: PositionedNode) => { nodeMap[n.id] = n; });
        return links
            .map((link: NetworkLink) => ({
                ...link,
                sourceNode: nodeMap[link.source],
                targetNode: nodeMap[link.target],
            }))
            .filter((l): l is ProcessedLink => l.sourceNode !== undefined && l.targetNode !== undefined);
    }, [currentNodes, links]);

    // Get unique groups for legend
    const legendGroups = useMemo(() => {
        const groupMap = new Map<string | number, string>();
        currentNodes.forEach((node: PositionedNode) => {
            if (node.group !== undefined && node.color !== undefined && !groupMap.has(node.group)) {
                groupMap.set(node.group, node.color);
            }
        });
        return Array.from(groupMap.entries());
    }, [currentNodes]);

    // Handle legend hover - highlight all nodes in that group
    const handleLegendHover = useCallback((index: number) => {
        if (!svgRef.current) return;
        const [group] = legendGroups[index] || [];
        if (group === undefined) return;

        setHoveredGroup(group);

        // Highlight all nodes with this group
        const relatedNodes = svgRef.current.querySelectorAll(`[data-group="${group}"]`);
        relatedNodes.forEach(node => node.classList.add('chart--network__node-group--legend-hovered'));
    }, [legendGroups]);

    const handleLegendLeave = useCallback(() => {
        if (!svgRef.current) return;
        setHoveredGroup(null);

        const nodes = svgRef.current.querySelectorAll('.chart--network__node-group--legend-hovered');
        nodes.forEach(n => n.classList.remove('chart--network__node-group--legend-hovered'));
    }, []);

    // Drag handlers
    const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
        e.preventDefault();
        setDragging(nodeId);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragging) return;
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setNodePositions(prev => ({
            ...prev,
            [dragging]: { x, y },
        }));
    };

    const handleMouseUp = () => {
        setDragging(null);
    };

    // Check if node is connected to hovered node
    const isConnected = (nodeId: string): 'self' | 'connected' | 'dimmed' | null => {
        if (!hoveredNode) return null;
        if (nodeId === hoveredNode) return 'self';
        const connected = processedLinks.some((l: ProcessedLink) =>
            (l.source === hoveredNode && l.target === nodeId) ||
            (l.target === hoveredNode && l.source === nodeId)
        );
        return connected ? 'connected' : 'dimmed';
    };

    return (
        <div className={cn(networkDiagramVariants(), className)}>
            <svg
                ref={svgRef}
                width={width}
                height={height}
                className={cn('chart--network__svg', {
                    'chart--network__svg--dragging': !!dragging,
                    'chart--network__svg--idle': !dragging
                })}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                role="img"
                aria-label={`Network diagram with ${nodes.length} nodes`}
            >
                {/* Links */}
                {processedLinks.map((link: ProcessedLink, idx: number) => {
                    const isHighlighted = hoveredNode &&
                        (link.source === hoveredNode || link.target === hoveredNode);

                    return (
                        <line
                            key={idx}
                            x1={link.sourceNode.x}
                            y1={link.sourceNode.y}
                            x2={link.targetNode.x}
                            y2={link.targetNode.y}
                            stroke={semanticColors.border}
                            strokeWidth={2}
                            className="chart--network__link"
                            strokeOpacity={hoveredNode ? (isHighlighted ? 1 : 0.2) : 0.8}
                        />
                    );
                })}

                {/* Nodes */}
                {currentNodes.map((node: PositionedNode, idx: number) => {
                    const status = isConnected(node.id);
                    const opacity = status === null ? 1
                        : status === 'dimmed' ? 0.2
                            : 1;
                    const isDraggingThis = dragging === node.id;
                    const tooltipHandlers = getHandlers(`${node.label || node.id}${node.group ? ` (Group ${node.group})` : ''} - Drag to move`);

                    return (
                        <g
                            key={node.id}
                            data-group={node.group}
                            onMouseEnter={(e) => {
                                if (!dragging) {
                                    setHoveredNode(node.id);
                                    tooltipHandlers.onMouseEnter(e);
                                }
                            }}
                            onMouseLeave={() => {
                                if (!dragging) {
                                    setHoveredNode(null);
                                    tooltipHandlers.onMouseLeave();
                                }
                            }}
                            onMouseDown={(e) => handleMouseDown(node.id, e)}
                            className={cn('chart--network__node-group', {
                                'chart--network__node-group--dragging': isDraggingThis,
                                'chart--network__node-group--idle': !isDraggingThis
                            })}
                        >
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={nodeRadius}
                                fill={node.color}
                                fillOpacity={opacity}
                                className="chart--network__node-circle"
                                style={{ transition: isDraggingThis ? 'none' : undefined }}
                            />
                            {showLabels && (
                                <text
                                    x={node.x}
                                    y={node.y + nodeRadius + 15}
                                    textAnchor="middle"
                                    fill={semanticColors.text}
                                    fillOpacity={opacity}
                                    className="chart--network__node-label"
                                >
                                    {node.label || node.id}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>

            {/* Legend */}
            {legendGroups.length > 0 && (
                <ChartLegend
                    payload={legendGroups.map(([group, color], idx) => ({
                        id: String(idx),
                        value: `Group ${group}`,
                        color: color,
                    }))}
                    activeIndex={legendGroups.findIndex(([g]) => g === hoveredGroup)}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                />
            )}

            <SVGTooltip tooltip={tooltip} />
        </div>
    );
}

export default NetworkDiagram;
