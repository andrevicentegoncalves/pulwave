import React, { useMemo, useRef, useCallback, useEffect } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import ChartLegend from '../../../primitives/ChartLegend';
import { waffleChartVariants, type WaffleChartProps, type WaffleDataItem } from './types';
import './styles/_index.scss';

/**
 * WaffleChart Component
 *
 * Displays proportional data as a grid of squares.
 *
 * Performance: Zero React re-renders on hover.
 * Uses event delegation + direct DOM manipulation for everything.
 */
export const WaffleChart = ({
    data = [],
    total = 100,
    rows = 10,
    cols = 10,
    cellSize = 24,
    cellGap = 2,
    cellRadius = 4,
    showLegend = true,
    showValues = true,
    valueFormatter = (v: number) => `${v}%`,
    className,
}: WaffleChartProps) => {
    const { getColor, semanticColors } = useChartContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const activeItemRef = useRef<number | null>(null);
    const [legendHoveredIndex, setLegendHoveredIndex] = React.useState<number | null>(null);

    // Assign colors and calculate cell counts
    const cellData = useMemo(() => {
        const totalCells = (rows as number) * (cols as number);
        let currentCell = 0;
        const cells = [];

        data.forEach((item, itemIndex) => {
            const color = item.color || getColor(itemIndex);
            const cellCount = Math.round((item.value / total) * totalCells);

            for (let i = 0; i < cellCount && currentCell < totalCells; i++) {
                cells.push({
                    index: currentCell,
                    itemIndex,
                    color,
                    name: item.name,
                    value: item.value,
                });
                currentCell++;
            }
        });

        // Fill remaining cells with empty
        while (cells.length < totalCells) {
            cells.push({
                index: cells.length,
                itemIndex: -1,
                color: semanticColors.grid,
                name: 'Empty',
                value: 0,
            });
        }

        return cells;
    }, [data, total, rows, cols, getColor, semanticColors]);

    const legendData = useMemo(() => {
        return data.map((item, index) => ({
            ...item,
            color: item.color || getColor(index),
        }));
    }, [data, getColor]);

    // Show tooltip via direct DOM - no React state
    const showTooltip = useCallback((content: string, x: number, y: number) => {
        if (!tooltipRef.current) return;
        tooltipRef.current.textContent = content;
        tooltipRef.current.style.left = `${x}px`;
        tooltipRef.current.style.top = `${y}px`;
        tooltipRef.current.style.opacity = '1';
        tooltipRef.current.style.visibility = 'visible';
    }, []);

    const hideTooltip = useCallback(() => {
        if (!tooltipRef.current) return;
        tooltipRef.current.style.opacity = '0';
        tooltipRef.current.style.visibility = 'hidden';
    }, []);

    // Single attribute toggle - O(1)
    const highlightItem = useCallback((itemIndex: number) => {
        if (!gridRef.current || activeItemRef.current === itemIndex) return;
        activeItemRef.current = itemIndex;
        gridRef.current.setAttribute('data-active-item', String(itemIndex));
    }, []);

    const clearHighlight = useCallback(() => {
        if (!gridRef.current || activeItemRef.current === null) return;
        activeItemRef.current = null;
        gridRef.current.removeAttribute('data-active-item');
    }, []);

    // All hover handling via native event listeners (no React overhead)
    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        const handleMouseOver = (e: MouseEvent) => {
            const cell = (e.target as HTMLElement).closest('.chart--waffle__cell') as HTMLElement;
            if (!cell) return;

            const itemIndex = parseInt(cell.getAttribute('data-item-index') || '-1', 10);
            if (itemIndex >= 0) {
                highlightItem(itemIndex);
                const name = cell.getAttribute('data-name') || '';
                const value = cell.getAttribute('data-value') || '';
                const rect = cell.getBoundingClientRect();
                showTooltip(`${name}: ${value}`, rect.left + rect.width / 2, rect.top);
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const related = e.relatedTarget as HTMLElement;
            if (!grid.contains(related)) {
                clearHighlight();
                hideTooltip();
            }
        };

        grid.addEventListener('mouseover', handleMouseOver);
        grid.addEventListener('mouseout', handleMouseOut);

        return () => {
            grid.removeEventListener('mouseover', handleMouseOver);
            grid.removeEventListener('mouseout', handleMouseOut);
        };
    }, [highlightItem, clearHighlight, showTooltip, hideTooltip]);

    // Legend handlers
    const handleLegendHover = useCallback((index: number) => {
        setLegendHoveredIndex(index);
        highlightItem(index);
    }, [highlightItem]);

    const handleLegendLeave = useCallback(() => {
        setLegendHoveredIndex(null);
        clearHighlight();
        hideTooltip();
    }, [clearHighlight, hideTooltip]);

    return (
        <div ref={containerRef} className={cn(waffleChartVariants(), className)}>
            {/* Grid - native event listeners attached via useEffect */}
            <div
                ref={gridRef}
                className="chart--waffle__grid"
                style={{
                    '--waffle-cols': cols,
                    '--waffle-rows': rows,
                    '--waffle-size': `${cellSize}px`,
                    '--waffle-gap': `${cellGap}px`,
                } as React.CSSProperties}
            >
                {cellData.map((cell, i) => (
                    <div
                        key={i}
                        className="chart--waffle__cell"
                        style={{
                            '--cell-color': cell.color,
                            '--cell-radius': `${cellRadius}px`,
                            '--cell-size': `${cellSize}px`,
                        } as React.CSSProperties}
                        data-item-index={cell.itemIndex}
                        data-name={cell.name}
                        data-value={valueFormatter(cell.value)}
                    />
                ))}
            </div>

            {/* Legend */}
            {showLegend && (
                <ChartLegend
                    payload={legendData.map((item, idx) => ({
                        id: String(idx),
                        value: showValues ? `${item.name} (${valueFormatter(item.value)})` : item.name,
                        color: typeof item.color === 'string' ? item.color : 'var(--chart-color-empty)',
                    }))}
                    activeIndex={legendHoveredIndex}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                />
            )}

            {/* Inline tooltip - no React state, pure DOM updates */}
            <div
                ref={tooltipRef}
                className="chart--waffle__tooltip"
                style={{
                    position: 'fixed',
                    transform: 'translate(-50%, -100%)',
                    pointerEvents: 'none',
                    opacity: 0,
                    visibility: 'hidden',
                    transition: 'opacity 0.1s',
                    zIndex: 9999,
                }}
            />
        </div>
    );
};

export default WaffleChart;
