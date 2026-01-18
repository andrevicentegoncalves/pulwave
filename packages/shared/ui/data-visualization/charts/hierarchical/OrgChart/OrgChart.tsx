import React, { useMemo, useState } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { orgChartVariants, type OrgChartProps, type OrgNode } from './types';
import './styles/_index.scss';

/**
 * OrgChart Component
 * 
 * Organizational chart showing hierarchical structure with infinite levels.
 */
export function OrgChart({
    data = {} as OrgNode,
    nodeWidth = 160,
    nodeHeight = 80,
    horizontalSpacing = 40,
    verticalSpacing = 60,
    nodeColors = {},
    showImages = true,
    expandAll = true,
    className,
}: OrgChartProps) {
    const { getColor, semanticColors } = useChartContext();

    const getAllIds = (node: OrgNode, depth = 0): string[] => {
        if (!node || !node.name) return [];
        const ids = [`${depth}-${node.name}`];
        if (node.children) {
            node.children.forEach((child: OrgNode) => {
                ids.push(...getAllIds(child, depth + 1));
            });
        }
        return ids;
    };

    const [expandedNodes, setExpandedNodes] = useState(() => {
        if (expandAll && data && data.name) {
            return new Set(getAllIds(data));
        }
        return new Set();
    });

    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    const getSubtreeWidth = (node: OrgNode, depth: number): number => {
        const id = `${depth}-${node.name}`;
        if (!node.children || node.children.length === 0 || !expandedNodes.has(id)) {
            return nodeWidth;
        }

        const childrenWidth = node.children.reduce((total: number, child: OrgNode, idx: number) => {
            return total + getSubtreeWidth(child, depth + 1) + (idx > 0 ? horizontalSpacing : 0);
        }, 0);

        return Math.max(nodeWidth, childrenWidth);
    };

    const layout = useMemo(() => {
        const nodes: any[] = [];
        const links: any[] = [];
        let maxX = 0, maxY = 0;

        const processNode = (node: OrgNode, x: number, y: number, depth: number, parentId: string | null = null) => {
            const id = `${depth}-${node.name}`;
            const color = nodeColors[node.name] || getColor(depth % 10);

            nodes.push({
                ...node,
                id,
                x,
                y,
                depth,
                color,
                hasChildren: node.children && node.children.length > 0,
            });

            maxX = Math.max(maxX, x + nodeWidth);
            maxY = Math.max(maxY, y + nodeHeight);

            if (parentId) {
                links.push({ from: parentId, to: id });
            }

            if (node.children && node.children.length > 0 && expandedNodes.has(id)) {
                const childWidths = node.children.map((child: OrgNode, idx: number) =>
                    getSubtreeWidth(child, depth + 1)
                );
                const totalWidth = childWidths.reduce((sum: number, w: number, idx: number) =>
                    sum + w + (idx > 0 ? horizontalSpacing : 0), 0
                );

                let startX = x + nodeWidth / 2 - totalWidth / 2;

                node.children.forEach((child: OrgNode, idx: number) => {
                    const childWidth = childWidths[idx];
                    const childX = startX + childWidth / 2 - nodeWidth / 2;
                    const childY = y + nodeHeight + verticalSpacing;
                    processNode(child, childX, childY, depth + 1, id);
                    startX += childWidth + horizontalSpacing;
                });
            }

            return id;
        };

        if (data && data.name) {
            processNode(data, 100, 30, 0);
        }

        // Find minimum x to add proper left padding
        const minX = Math.min(...nodes.map(n => n.x), 0);
        const leftPadding = minX < 0 ? Math.abs(minX) + 50 : 50;

        // Adjust all node positions to ensure nothing is cut off
        if (minX < 0) {
            nodes.forEach(node => {
                node.x += Math.abs(minX) + 50;
            });
        }

        return { nodes, links, width: maxX + 150, height: maxY + 80 };
    }, [data, nodeWidth, nodeHeight, horizontalSpacing, verticalSpacing, expandedNodes, nodeColors, getColor]);

    const toggleNode = (id: string) => {
        setExpandedNodes(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const getNodeCenter = (id: string) => {
        const node = layout.nodes.find(n => n.id === id);
        if (!node) return { x: 0, y: 0, topY: 0 };
        return {
            x: node.x + nodeWidth / 2,
            y: node.y + nodeHeight,
            topY: node.y,
        };
    };

    return (
        <div className={cn(orgChartVariants(), className)}>
            <div style={{ minWidth: layout.width }}>
                <svg width={layout.width} height={layout.height} role="img" aria-label={`Organization chart with ${layout.nodes.length} nodes`}>
                    {layout.links.map((link, idx) => {
                        const from = getNodeCenter(link.from);
                        const to = getNodeCenter(link.to);
                        const midY = (from.y + to.topY) / 2;

                        return (
                            <path
                                key={idx}
                                d={`M ${from.x} ${from.y} L ${from.x} ${midY} L ${to.x} ${midY} L ${to.x} ${to.topY}`}
                                className="chart--org__connector"
                            />
                        );
                    })}

                    {layout.nodes.map((node) => {
                        const isHovered = hoveredNode === node.id;
                        return (
                            <g
                                key={node.id}
                                className={cn('chart--org__node-group', {
                                    'chart--org__node-group--expandable': node.hasChildren,
                                    'chart--org__node-group--hovered': isHovered
                                })}
                                onClick={() => node.hasChildren && toggleNode(node.id)}
                                onKeyDown={(e) => {
                                    if ((e.key === 'Enter' || e.key === ' ') && node.hasChildren) {
                                        e.preventDefault();
                                        toggleNode(node.id);
                                    }
                                }}
                                onMouseEnter={() => setHoveredNode(node.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                                tabIndex={node.hasChildren ? 0 : -1}
                                role={node.hasChildren ? 'button' : undefined}
                                aria-expanded={node.hasChildren ? expandedNodes.has(node.id) : undefined}
                                aria-label={node.hasChildren ? `${node.name}. Click to ${expandedNodes.has(node.id) ? 'collapse' : 'expand'}` : node.name}
                            >
                                <rect
                                    x={node.x}
                                    y={node.y}
                                    width={nodeWidth}
                                    height={nodeHeight}
                                    stroke={node.color}
                                    rx={8}
                                    className="chart--org__node-rect"
                                />
                                <rect
                                    x={node.x}
                                    y={node.y}
                                    width={nodeWidth}
                                    height={6}
                                    fill={node.color}
                                    rx={8}
                                    ry={8}
                                />
                                <rect
                                    x={node.x}
                                    y={node.y + 3}
                                    width={nodeWidth}
                                    height={6}
                                    fill={node.color}
                                />

                                {showImages && node.image && (
                                    <image
                                        href={node.image}
                                        x={node.x + 10}
                                        y={node.y + 15}
                                        width={40}
                                        height={40}
                                        clipPath="circle(20px at 20px 20px)"
                                    />
                                )}

                                <text
                                    x={node.x + nodeWidth / 2}
                                    y={node.y + 30}
                                    className="chart--org__node-name"
                                >
                                    {node.name}
                                </text>

                                {node.title && (
                                    <text
                                        x={node.x + nodeWidth / 2}
                                        y={node.y + 50}
                                        className="chart--org__node-title"
                                    >
                                        {node.title.length > 22
                                            ? node.title.substring(0, 20) + '…'
                                            : node.title}
                                    </text>
                                )}

                                {node.hasChildren && (
                                    <g className="chart--org__toggle-group">
                                        <circle
                                            cx={node.x + nodeWidth / 2}
                                            cy={node.y + nodeHeight}
                                            r={10}
                                            stroke={node.color}
                                            className="chart--org__toggle-circle"
                                        />
                                        <text
                                            x={node.x + nodeWidth / 2}
                                            y={node.y + nodeHeight + 1}
                                            fill={node.color}
                                            className="chart--org__toggle-text"
                                        >
                                            {expandedNodes.has(node.id) ? '−' : '+'}
                                        </text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}

export default OrgChart;
