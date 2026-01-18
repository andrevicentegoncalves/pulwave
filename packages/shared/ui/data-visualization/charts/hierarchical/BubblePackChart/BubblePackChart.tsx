import React, { useMemo, useState } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import ChartTooltip from '../../../primitives/ChartTooltip';
import { bubblePackChartVariants, type BubblePackChartProps, type BubbleData, type PositionedBubble } from './types';
import './styles/_index.scss';

/**
 * BubblePackChart Component
 * 
 * Displays hierarchical data as packed circles (bubble chart).
 * Useful for comparing values within categories.
 */
export function BubblePackChart({
    data = [],
    valueKey = 'value',
    nameKey = 'name',
    height = 400,
    showLabels = true,
    labelMinSize = 30,
    valueFormatter = (v: number) => v?.toLocaleString() ?? '',
    padding = 4,
    onBubbleClick,
    className,
}: BubblePackChartProps) {
    const { getColor } = useChartContext();
    const [hoveredBubble, setHoveredBubble] = useState<PositionedBubble | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    // Early return for empty or invalid data
    if (!Array.isArray(data) || data.length === 0) {
        return (
            <div
                className={cn(bubblePackChartVariants(), 'chart--bubble-pack--empty', className)}
                style={{ height }}
            >
                <span className="chart--bubble-pack__empty-text">No data available</span>
            </div>
        );
    }

    // Calculate bubble positions using simple circle packing
    const bubbles = useMemo(() => {
        // Flatten data and sort by value (using type assertion for dynamic key access)
        const flatData = data.map((item: BubbleData, i: number): BubbleData => ({
            ...item,
            color: item.color || getColor(i),
            originalIndex: i,
        })).sort((a: BubbleData, b: BubbleData) => ((b[valueKey] as number) || 0) - ((a[valueKey] as number) || 0));

        // Calculate radius based on value
        const maxValue = Math.max(...flatData.map((d: BubbleData) => (d[valueKey] as number) || 0));
        const minRadius = 20;
        const maxRadius = (height as number) * 0.3;

        // Simple positioning (spiral layout)
        const positioned: PositionedBubble[] = [];
        let angle = 0;
        let radius = 0;
        const centerX = 200;
        const centerY = (height as number) / 2;

        flatData.forEach((item: BubbleData, i: number) => {
            const bubbleRadius = minRadius + (((item[valueKey] as number) || 0) / (maxValue || 1)) * (maxRadius - minRadius);

            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            positioned.push({
                ...item,
                x,
                y,
                radius: bubbleRadius,
                originalIndex: (item.originalIndex as number) ?? i,
            });

            angle += 0.5 + (1 / (i + 1));
            radius += bubbleRadius * 0.15;
        });

        return positioned;
    }, [data, valueKey, height, getColor]);

    // Calculate viewBox
    const viewBox = useMemo(() => {
        if (bubbles.length === 0) return '0 0 400 400';

        const xs = bubbles.map((b) => [b.x - b.radius, b.x + b.radius]).flat();
        const ys = bubbles.map((b) => [b.y - b.radius, b.y + b.radius]).flat();

        const minX = Math.min(...xs) - (padding as number);
        const maxX = Math.max(...xs) + (padding as number);
        const minY = Math.min(...ys) - (padding as number);
        const maxY = Math.max(...ys) + (padding as number);

        return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
    }, [bubbles, padding]);

    const handleMouseMove = (e: React.MouseEvent, bubble: PositionedBubble) => {
        const rect = e.currentTarget.closest('div')?.getBoundingClientRect();
        if (rect) {
            setTooltipPos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
        setHoveredBubble(bubble);
    };

    return (
        <div
            className={cn(bubblePackChartVariants(), className)}
            style={{
                height: `${height}px`,
                position: 'relative'
            }}
        >
            <svg
                width="100%"
                height={height}
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                className="chart--bubble-pack__svg"
                role="img"
                aria-label={`Bubble pack chart with ${bubbles.length} bubbles`}
            >
                {bubbles.map((bubble, i: number) => (
                    <g key={i}>
                        <circle
                            cx={bubble.x}
                            cy={bubble.y}
                            r={bubble.radius}
                            fill={bubble.color}
                            fillOpacity={hoveredBubble === bubble ? 1 : 0.8}
                            stroke={hoveredBubble === bubble ? 'white' : 'transparent'}
                            className={cn('chart--bubble-pack__bubble', {
                                'chart--bubble-pack__bubble--interactive': !!onBubbleClick,
                                'chart--bubble-pack__bubble--idle': !onBubbleClick
                            })}
                            style={{
                                ['--bubble-radius' as string]: `${bubble.radius}px`
                            } as React.CSSProperties}
                            onClick={() => onBubbleClick?.(bubble)}
                            onMouseMove={(e) => handleMouseMove(e, bubble)}
                            onMouseLeave={() => setHoveredBubble(null)}
                        />
                        {showLabels && bubble.radius > (labelMinSize as number) && (
                            <>
                                <text
                                    x={bubble.x}
                                    y={bubble.y - 4}
                                    className="chart--bubble-pack__label"
                                    style={{
                                        ['--label-font-size' as string]: `${Math.min(bubble.radius * 0.3, 14)}px`
                                    } as React.CSSProperties}
                                >
                                    {bubble[nameKey] as string}
                                </text>
                                <text
                                    x={bubble.x}
                                    y={bubble.y + 12}
                                    className="chart--bubble-pack__value"
                                    style={{
                                        ['--value-font-size' as string]: `${Math.min(bubble.radius * 0.25, 12)}px`
                                    } as React.CSSProperties}
                                >
                                    {valueFormatter(bubble[valueKey] as number)}
                                </text>
                            </>
                        )}
                    </g>
                ))}
            </svg>

            {/* Tooltip */}
            {hoveredBubble && (
                <div
                    className="chart--bubble-pack__tooltip"
                    style={{
                        left: `${tooltipPos.x + 10}px`,
                        top: `${tooltipPos.y - 10}px`,
                    }}
                >
                    <ChartTooltip
                        active
                        label={hoveredBubble[nameKey] as string}
                        items={[{
                            name: 'Value',
                            value: valueFormatter(hoveredBubble[valueKey] as number),
                            color: hoveredBubble.color ?? '',
                        }]}
                    />
                </div>
            )}
        </div>
    );
}

export default BubblePackChart;
