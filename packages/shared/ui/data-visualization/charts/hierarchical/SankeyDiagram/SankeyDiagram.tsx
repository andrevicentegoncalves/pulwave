import React, { useMemo, useState } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { ChartShell } from '../../../primitives/ChartShell';
import ChartTooltip from '../../../primitives/ChartTooltip';
import { sankeyDiagramVariants, type SankeyDiagramProps, type SankeyNode, type SankeyLink, type PositionedNode, type PositionedLink, type SankeyLayout } from './types';
import './styles/_index.scss';

/**
 * SankeyDiagram Component
 * 
 * Displays flow data between nodes showing how quantities
 * move from one set of values to another.
 */
export function SankeyDiagram({
    nodes = [],
    links = [],
    width = 600,
    height = 400,
    nodeWidth = 20,
    nodePadding = 10,
    showLabels = true,
    showValues = true,
    valueFormatter = (v: number) => v?.toLocaleString() ?? '',
    onNodeClick,
    onLinkClick,
    className,
}: SankeyDiagramProps) {
    const { getColor, semanticColors } = useChartContext();
    const [hoveredLink, setHoveredLink] = useState<PositionedLink | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    // Calculate node positions and link paths
    const layout = useMemo((): SankeyLayout => {
        // Create node map with color assignment
        interface NodeMapEntry extends SankeyNode {
            index: number;
            color: string;
        }
        const nodeMap = new Map<string, NodeMapEntry>(
            nodes.map((n: SankeyNode, i: number) => [n.id, { ...n, index: i, color: n.color || getColor(i) }])
        );

        // Calculate node layers (simple left-to-right layout)
        const sourceNodes = new Set(links.map((l: SankeyLink) => l.source));
        const targetNodes = new Set(links.map((l: SankeyLink) => l.target));

        // Nodes that are only sources go left, only targets go right, both go middle
        const leftNodes = nodes.filter((n: SankeyNode) => sourceNodes.has(n.id) && !targetNodes.has(n.id));
        const rightNodes = nodes.filter((n: SankeyNode) => targetNodes.has(n.id) && !sourceNodes.has(n.id));
        const middleNodes = nodes.filter((n: SankeyNode) => sourceNodes.has(n.id) && targetNodes.has(n.id));

        // If no clear structure, put all sources left, targets right
        const layers: SankeyNode[][] = middleNodes.length > 0
            ? [leftNodes, middleNodes, rightNodes]
            : [leftNodes, rightNodes];

        // Calculate total values for each node
        const nodeValues = new Map<string, number>();
        nodes.forEach((n: SankeyNode) => {
            const outValue = links.filter((l: SankeyLink) => l.source === n.id).reduce((sum: number, l: SankeyLink) => sum + l.value, 0);
            const inValue = links.filter((l: SankeyLink) => l.target === n.id).reduce((sum: number, l: SankeyLink) => sum + l.value, 0);
            nodeValues.set(n.id, Math.max(outValue, inValue) || 1);
        });

        const maxValue = Math.max(...Array.from(nodeValues.values()), 1);
        const availableHeight = height - (nodes.length * nodePadding);

        // Position nodes in layers
        const positionedNodes: PositionedNode[] = [];
        const layerWidth = (width - nodeWidth) / Math.max(layers.length - 1, 1);

        layers.forEach((layer: SankeyNode[], layerIndex: number) => {
            let y = nodePadding;
            layer.forEach((node: SankeyNode) => {
                const val = nodeValues.get(node.id) || 1;
                const nodeHeight = (val / maxValue) * availableHeight * 0.8;
                const nodeEntry = nodeMap.get(node.id);
                if (nodeEntry) {
                    positionedNodes.push({
                        ...nodeEntry,
                        x: layerIndex * layerWidth,
                        y,
                        width: nodeWidth,
                        height: Math.max(nodeHeight, 10),
                        value: val,
                    });
                }
                y += Math.max(nodeHeight, 10) + nodePadding;
            });
        });

        // Create node position lookup
        const nodePositions = new Map<string, PositionedNode>(positionedNodes.map((n: PositionedNode) => [n.id, n]));

        // Calculate link paths
        const linkPaths: PositionedLink[] = links
            .map((link: SankeyLink): PositionedLink | null => {
                const sourceNode = nodePositions.get(link.source);
                const targetNode = nodePositions.get(link.target);

                if (!sourceNode || !targetNode) return null;

                const linkHeight = (link.value / maxValue) * availableHeight * 0.5;
                const x0 = sourceNode.x + sourceNode.width;
                const x1 = targetNode.x;
                const y0 = sourceNode.y + sourceNode.height / 2;
                const y1 = targetNode.y + targetNode.height / 2;

                // Bezier curve
                const cx = (x0 + x1) / 2;
                const path = `M${x0},${y0 - linkHeight / 2}
                          C${cx},${y0 - linkHeight / 2} ${cx},${y1 - linkHeight / 2} ${x1},${y1 - linkHeight / 2}
                          L${x1},${y1 + linkHeight / 2}
                          C${cx},${y1 + linkHeight / 2} ${cx},${y0 + linkHeight / 2} ${x0},${y0 + linkHeight / 2}
                          Z`;

                return {
                    ...link,
                    path,
                    color: sourceNode.color,
                    sourceNode,
                    targetNode,
                };
            })
            .filter((link): link is PositionedLink => link !== null);

        return { nodes: positionedNodes, links: linkPaths };
    }, [nodes, links, width, height, nodeWidth, nodePadding, getColor]);

    const handleLinkHover = (e: React.MouseEvent, link: PositionedLink) => {
        const rect = e.currentTarget.closest('svg')?.getBoundingClientRect();
        if (rect) {
            setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
        setHoveredLink(link);
    };

    return (
        <ChartShell
            className={cn(sankeyDiagramVariants(), className)}
            height={height}
            width={width}
        >
            <svg width={width} height={height} role="img" aria-label={`Sankey diagram showing flow between ${nodes.length} nodes`}>
                {/* Links */}
                <g className="chart--sankey__links">
                    {layout.links.map((link: PositionedLink, i: number) => (
                        <path
                            key={i}
                            d={link.path}
                            fill={link.color}
                            className={cn('chart--sankey__link', {
                                'chart--sankey__link--hovered': hoveredLink === link,
                                'chart--sankey__link--interactive': !!onLinkClick
                            })}
                            onClick={() => onLinkClick?.(link)}
                            onMouseEnter={(e) => handleLinkHover(e, link)}
                            onMouseLeave={() => setHoveredLink(null)}
                        />
                    ))}
                </g>

                {/* Nodes */}
                <g className="chart--sankey__nodes">
                    {layout.nodes.map((node: PositionedNode, i: number) => (
                        <g key={i}>
                            <rect
                                x={node.x}
                                y={node.y}
                                width={node.width}
                                height={node.height}
                                fill={node.color}
                                rx={4}
                                className={cn('chart--sankey__node', {
                                    'chart--sankey__node--interactive': !!onNodeClick
                                })}
                                onClick={() => onNodeClick?.(node)}
                            />
                            {showLabels && (
                                <text
                                    x={node.x < width / 2 ? node.x + node.width + 6 : node.x - 6}
                                    y={node.y + node.height / 2}
                                    textAnchor={node.x < width / 2 ? 'start' : 'end'}
                                    dominantBaseline="middle"
                                    fill={semanticColors.text}
                                    className="chart--sankey__node-label"
                                >
                                    {node.name}
                                    {showValues && ` (${valueFormatter(node.value)})`}
                                </text>
                            )}
                        </g>
                    ))}
                </g>
            </svg>

            {/* Tooltip */}
            {hoveredLink && (
                <div
                    className="chart--sankey__tooltip"
                    style={{
                        left: tooltipPos.x + 10,
                        top: tooltipPos.y - 10,
                    }}
                >
                    <ChartTooltip
                        active
                        label={`${hoveredLink.sourceNode.name} → ${hoveredLink.targetNode.name}`}
                        items={[{
                            name: 'Flow',
                            value: valueFormatter(hoveredLink.value),
                            color: hoveredLink.color,
                        }]}
                    />
                </div>
            )}
        </ChartShell>
    );
}

export default SankeyDiagram;
