import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { ChartShell } from '../../../primitives/ChartShell';
import ChartLegend from '../../../primitives/ChartLegend';
import { parliamentChartVariants, type ParliamentChartProps, type ParliamentDataItem } from './types';
import './styles/_index.scss';

/**
 * ParliamentChart Component
 *
 * Displays data as a semicircle of dots, like seats in a parliament.
 *
 * Performance: Zero React re-renders on hover.
 * Uses native event listeners + direct DOM manipulation.
 */
export const ParliamentChart = ({
    data = [],
    totalSeats,
    width = 400,
    height = 220,
    dotRadius = 6,
    dotGap = 2,
    rows = 5,
    showLegend = true,
    showValues = true,
    className,
}: ParliamentChartProps) => {
    const { getColor } = useChartContext();
    const svgRef = useRef<SVGSVGElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const activePartyRef = useRef<number | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const computedTotal = totalSeats || data.reduce((sum, d) => sum + d.seats, 0);

    // Tooltip via direct DOM - no React state
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
    const highlightParty = useCallback((index: number) => {
        if (!svgRef.current || activePartyRef.current === index) return;
        activePartyRef.current = index;
        svgRef.current.setAttribute('data-active-party', String(index));
    }, []);

    const clearHighlight = useCallback(() => {
        if (!svgRef.current || activePartyRef.current === null) return;
        activePartyRef.current = null;
        svgRef.current.removeAttribute('data-active-party');
    }, []);

    // Native event listeners for SVG hover
    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        const handleMouseOver = (e: MouseEvent) => {
            const group = (e.target as Element).closest('.chart--parliament__party-group');
            if (!group) return;

            const partyIndex = parseInt(group.getAttribute('data-party-index') || '-1', 10);
            if (partyIndex >= 0) {
                highlightParty(partyIndex);
                const name = group.getAttribute('data-name') || '';
                const seats = group.getAttribute('data-seats') || '';
                const rect = group.getBoundingClientRect();
                showTooltip(`${name}: ${seats} seats`, rect.left + rect.width / 2, rect.top);
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const related = e.relatedTarget as Element;
            if (!svg.contains(related)) {
                clearHighlight();
                hideTooltip();
            }
        };

        svg.addEventListener('mouseover', handleMouseOver);
        svg.addEventListener('mouseout', handleMouseOut);

        return () => {
            svg.removeEventListener('mouseover', handleMouseOver);
            svg.removeEventListener('mouseout', handleMouseOut);
        };
    }, [highlightParty, clearHighlight, showTooltip, hideTooltip]);

    // Legend handlers
    const handleLegendHover = useCallback((index: number) => {
        setHoveredIndex(index);
        highlightParty(index);
    }, [highlightParty]);

    const handleLegendLeave = useCallback(() => {
        setHoveredIndex(null);
        clearHighlight();
        hideTooltip();
    }, [clearHighlight, hideTooltip]);


    const coloredData = useMemo(() => {
        return data.map((item, i) => ({
            ...item,
            color: item.color || getColor(i),
        }));
    }, [data, getColor]);

    // Group seats by party for better performance (preserve order from coloredData)
    const seatsByParty = useMemo(() => {
        const centerX = (width as number) / 2;
        const centerY = (height as number) - 10;
        const maxRadius = Math.min((width as number) / 2, (height as number)) - 20;
        const minRadius = maxRadius * 0.3;

        const calculateSeatsInRow = (rowNum: number, totalRowsCount: number) => {
            const rowRadius = maxRadius - (rowNum * (maxRadius - minRadius) / (totalRowsCount - 1 || 1));
            return Math.floor((Math.PI * rowRadius) / ((dotRadius * 2) + dotGap));
        };

        let actualRows = rows as number;
        let totalCapacity = 0;
        for (let r = 0; r < actualRows; r++) {
            totalCapacity += calculateSeatsInRow(r, actualRows);
        }

        while (totalCapacity < computedTotal && actualRows < 20) {
            actualRows++;
            totalCapacity = 0;
            for (let r = 0; r < actualRows; r++) {
                totalCapacity += calculateSeatsInRow(r, actualRows);
            }
        }

        // Group seats by party
        const partyGroups = new Map<string, Array<{x: number, y: number}>>();
        let seatIndex = 0;

        for (let row = 0; row < actualRows; row++) {
            const rowRadius = maxRadius - (row * (maxRadius - minRadius) / (actualRows - 1 || 1));
            const seatsInRow = Math.floor((Math.PI * rowRadius) / ((dotRadius * 2) + dotGap));

            for (let i = 0; i < seatsInRow && seatIndex < computedTotal; i++) {
                const angle = Math.PI * (i / (seatsInRow - 1 || 1));
                const x = centerX - Math.cos(angle) * rowRadius;
                const y = centerY - Math.sin(angle) * rowRadius;

                let cumulative = 0;
                let partyName = '';
                let partyColor = 'var(--chart-color-empty)';

                for (const party of (coloredData as ParliamentDataItem[])) {
                    cumulative += party.seats;
                    if (seatIndex < cumulative) {
                        partyName = party.name;
                        partyColor = party.color || 'var(--chart-color-empty)';
                        break;
                    }
                }

                if (!partyGroups.has(partyName)) {
                    partyGroups.set(partyName, []);
                }
                partyGroups.get(partyName)!.push({ x, y });
                seatIndex++;
            }
        }

        // Convert to array with party info, maintaining coloredData order
        return coloredData.map((party) => {
            const seats = partyGroups.get(party.name) || [];
            return {
                name: party.name,
                color: party.color || 'var(--chart-color-empty)',
                seats,
            };
        }).filter(p => p.seats.length > 0);
    }, [width, height, rows, dotRadius, dotGap, computedTotal, coloredData]);

    return (
        <ChartShell
            className={cn(parliamentChartVariants(), className)}
            width={width}
            height={height}
        >
            <svg
                ref={svgRef}
                width={width}
                height={height}
                className="chart--parliament__svg"
                role="img"
                aria-label={`Parliament chart with ${computedTotal} seats`}
            >
                {seatsByParty.map((party, partyIdx) => (
                    <g
                        key={partyIdx}
                        className="chart--parliament__party-group"
                        data-party-index={partyIdx}
                        data-name={party.name}
                        data-seats={party.seats.length}
                    >
                        {party.seats.map((seat, seatIdx) => (
                            <circle
                                key={seatIdx}
                                cx={seat.x}
                                cy={seat.y}
                                r={dotRadius}
                                fill={party.color}
                                className="chart--parliament__dot"
                            />
                        ))}
                    </g>
                ))}
            </svg>

            {/* Inline tooltip - no React state */}
            <div
                ref={tooltipRef}
                className="chart--parliament__tooltip"
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

            {showLegend && (
                <ChartLegend
                    payload={coloredData.map((party, idx) => ({
                        id: String(idx),
                        value: showValues ? `${party.name} (${party.seats})` : party.name,
                        color: party.color || 'var(--chart-color-empty)',
                    }))}
                    activeIndex={hoveredIndex}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                />
            )}
        </ChartShell>
    );
};

export default ParliamentChart;
