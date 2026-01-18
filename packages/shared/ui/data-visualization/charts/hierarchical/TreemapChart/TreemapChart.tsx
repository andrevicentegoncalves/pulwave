import React, { useMemo, useState } from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { useChartContext, useChartComponents } from '../../../providers/ChartProvider';
import { treemapChartVariants, type TreemapChartProps, type TreemapNode, type TreemapContentProps } from './types';
import './styles/_index.scss';

/**
 * TreemapChart Component
 * Displays hierarchical data as nested rectangles.
 * Uses ChartProvider for library abstraction.
 */
export function TreemapChart({
    data = [],
    dataKey = 'size',
    nameKey = 'name',
    aspectRatio = 4 / 3,
    height = 400,
    showLabels = true,
    labelMinSize = 50,
    colorByRoot = true,
    valueFormatter = (v) => v?.toLocaleString() ?? '0',
    onNodeClick,
    className,
    ...props
}: TreemapChartProps) {
    const { getColor, semanticColors } = useChartContext();
    const { Treemap } = useChartComponents();
    const [activeNode, setActiveNode] = useState<TreemapContentProps | null>(null);

    // Flatten nested data and assign colors
    const coloredData = useMemo(() => {
        const assignColors = (nodes: TreemapNode[], depth = 0, rootIndex = 0): TreemapNode[] => {
            if (!Array.isArray(nodes)) return [];

            return nodes.map((node: TreemapNode, i: number) => {
                const index = colorByRoot ? rootIndex : i;
                const color = node.color || getColor(index);

                return {
                    ...node,
                    fill: color,
                    stroke: semanticColors.backgroundElevated || semanticColors.background,
                    strokeWidth: 2,
                    children: node.children
                        ? assignColors(node.children, depth + 1, index)
                        : undefined,
                };
            });
        };

        return assignColors(data);
    }, [data, colorByRoot, getColor, semanticColors]);

    // Custom content renderer
    const renderContent = (contentProps: TreemapContentProps) => {
        const { x, y, width, height: h, name, value, fill, depth, root } = contentProps;
        const isHovered = activeNode && activeNode.name === name && activeNode.depth === depth;
        const showLabel = showLabels && width > labelMinSize && h > 30;

        const rootWidth = root?.width || 600;
        const rootHeight = root?.height || 400;
        const touchesLeftEdge = x <= 1;
        const touchesRightEdge = x + width >= rootWidth - 1;
        const touchesTopEdge = y <= 1;
        const touchesBottomEdge = y + h >= rootHeight - 1;

        const borderRadius = 8;
        const tl = touchesLeftEdge && touchesTopEdge ? borderRadius : 0;
        const tr = touchesRightEdge && touchesTopEdge ? borderRadius : 0;
        const br = touchesRightEdge && touchesBottomEdge ? borderRadius : 0;
        const bl = touchesLeftEdge && touchesBottomEdge ? borderRadius : 0;

        return (
            <g>
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={h}
                    fill={fill}
                    stroke={semanticColors.background}
                    strokeWidth={2}
                    className={cn('chart--treemap__node', {
                        'chart--treemap__node--depth-0': depth === 0,
                        'chart--treemap__node--depth-1-plus': depth > 0,
                        'chart--treemap__node--clickable': !!onNodeClick,
                        'chart--treemap__node--hovered': isHovered,
                    })}
                    style={{
                        clipPath: `inset(0 round var(--tl) var(--tr) var(--br) var(--bl))`,
                        '--tl': `${tl}px`,
                        '--tr': `${tr}px`,
                        '--br': `${br}px`,
                        '--bl': `${bl}px`,
                    } as React.CSSProperties}
                    onClick={() => onNodeClick?.(contentProps)}
                    onMouseEnter={() => setActiveNode(contentProps)}
                    onMouseLeave={() => setActiveNode(null)}
                />
                {showLabel && (
                    <>
                        <text
                            x={x + width / 2}
                            y={y + h / 2 - 6}
                            textAnchor="middle"
                            className="chart--treemap__label-name"
                        >
                            {name}
                        </text>
                        <text
                            x={x + width / 2}
                            y={y + h / 2 + 10}
                            textAnchor="middle"
                            className="chart--treemap__label-value"
                        >
                            {valueFormatter(value || 0)}
                        </text>
                    </>
                )}
            </g>
        );
    };

    // Empty state
    if (!Array.isArray(data) || data.length === 0) {
        return (
            <div
                className={cn('chart--treemap', 'chart--treemap--empty', className)}
                style={{ height: `${height}px` }}
            >
                <span className="chart--treemap__empty-message">No data available</span>
            </div>
        );
    }

    return (
        <ChartShell
            height={height}
            className={cn(treemapChartVariants(), className)}
        >
            <Treemap
                data={coloredData}
                dataKey={dataKey}
                aspectRatio={aspectRatio}
                content={renderContent}
                isAnimationActive
                animationDuration={400}
                {...props}
            >
                <ChartTooltipLayer
                    formatter={valueFormatter}
                />
            </Treemap>
        </ChartShell>
    );
}

export default TreemapChart;
