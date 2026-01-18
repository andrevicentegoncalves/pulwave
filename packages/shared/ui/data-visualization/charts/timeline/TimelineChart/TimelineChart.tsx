import React, { useMemo, useState, useCallback, useRef } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartLegend } from '../../../primitives/ChartLegend';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { timelineChartVariants, type TimelineChartProps } from './types';
import './styles/_index.scss';

/**
 * TimelineChart Component
 * 
 * Horizontal timeline showing events with optional duration.
 */
export const TimelineChart = ({
    events = [],
    width = 700,
    height = 250,
    rowHeight = 40,
    showLabels = true,
    showMilestones = true,
    statusColors: propStatusColors,
    className,
}: TimelineChartProps) => {
    const { getColor, semanticColors } = useChartContext();

    const statusColors = useMemo(() => propStatusColors || {
        complete: semanticColors.success,
        active: semanticColors.primary,
        pending: semanticColors.textMuted,
        delayed: semanticColors.error,
    }, [propStatusColors, semanticColors]);
    const [hoveredEvent, setHoveredEvent] = useState<string | number | null>(null);
    const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);
    const { tooltip, getHandlers } = useSVGTooltip();
    const svgRef = useRef<SVGSVGElement>(null);

    const padding = { top: 40, right: 50, bottom: 60, left: 120 };
    const chartWidth = (width as number) - padding.left - padding.right;

    const { timeline, ticks, processedEvents } = useMemo(() => {
        const parseDate = (dateStr: any) => {
            if (!dateStr) return null;
            return new Date(dateStr).getTime();
        };

        const allDates: number[] = [];
        events.forEach((e: any) => {
            const startVal = parseDate(e.start || e.date);
            const endVal = parseDate(e.end || e.date);
            if (startVal) allDates.push(startVal);
            if (endVal) allDates.push(endVal);
        });

        const min = Math.min(...allDates);
        const max = Math.max(...allDates);
        const range = max - min || 1;

        const processed = events.map((event: any, idx: number) => {
            const startTime = parseDate(event.start || event.date) || 0;
            const endTime = parseDate(event.end || event.date) || 0;
            const startX = padding.left + ((startTime - min) / range) * chartWidth;
            const endX = padding.left + ((endTime - min) / range) * chartWidth;
            const y = padding.top + idx * rowHeight;

            return {
                ...event,
                startX,
                endX,
                y,
                barWidth: Math.max(endX - startX, 8),
                color: statusColors?.[event.status] || event.color || getColor(idx),
                isMilestone: !event.end || event.start === event.end,
            };
        });

        const count = 6;
        const tickList = [];
        for (let i = 0; i <= count; i++) {
            const time = min + (range * i) / count;
            const date = new Date(time);
            const x = padding.left + (i / count) * chartWidth;
            tickList.push({
                x,
                label: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            });
        }

        return {
            timeline: { min, max, range },
            ticks: tickList,
            processedEvents: processed,
        };
    }, [events, chartWidth, padding, rowHeight, statusColors, getColor]);

    const totalHeight = Math.max(height as number, padding.top + processedEvents.length * rowHeight + padding.bottom);

    // Handle legend hover - highlight all events with that status
    const handleLegendHover = useCallback((index: number) => {
        if (!svgRef.current) return;
        const statuses = Object.keys(statusColors || {});
        const status = statuses[index];
        if (!status) return;

        setHoveredStatus(status);

        // Highlight all events with this status
        const relatedEvents = svgRef.current.querySelectorAll(`[data-status="${status}"]`);
        relatedEvents.forEach(event => event.classList.add('chart--timeline__event--legend-hovered'));
    }, [statusColors]);

    const handleLegendLeave = useCallback(() => {
        if (!svgRef.current) return;
        setHoveredStatus(null);

        const events = svgRef.current.querySelectorAll('.chart--timeline__event--legend-hovered');
        events.forEach(e => e.classList.remove('chart--timeline__event--legend-hovered'));
    }, []);

    // Calculate active legend index from hovered event
    const activeLegendIndex = useMemo(() => {
        if (hoveredEvent) {
            const event = processedEvents.find(e => e.id === hoveredEvent);
            if (event?.status) {
                const statuses = Object.keys(statusColors || {});
                return statuses.indexOf(event.status);
            }
        }
        if (hoveredStatus) {
            const statuses = Object.keys(statusColors || {});
            return statuses.indexOf(hoveredStatus);
        }
        return null;
    }, [hoveredEvent, hoveredStatus, processedEvents, statusColors]);

    return (
        <ChartShell
            className={cn(timelineChartVariants(), className)}
            height={totalHeight}
            width={width}
        >
            <div className="chart--timeline__container">
                <svg ref={svgRef} width={width} height={totalHeight} className="chart--timeline__svg" role="img" aria-label={`Timeline chart with ${processedEvents.length} events`}>
                    <line
                        x1={padding.left}
                        y1={totalHeight - padding.bottom}
                        x2={(width as number) - padding.right}
                        y2={totalHeight - padding.bottom}
                        className="chart--timeline__axis"
                    />

                    {ticks.map((tick, idx) => (
                        <g key={idx}>
                            <line
                                x1={tick.x}
                                y1={totalHeight - padding.bottom}
                                x2={tick.x}
                                y2={totalHeight - padding.bottom + 8}
                                className="chart--timeline__tick-line"
                            />
                            <text
                                x={tick.x}
                                y={totalHeight - padding.bottom + 22}
                                className="chart--timeline__tick-text"
                            >
                                {tick.label}
                            </text>
                            <line
                                x1={tick.x}
                                y1={padding.top}
                                x2={tick.x}
                                y2={totalHeight - padding.bottom}
                                className="chart--timeline__grid-line"
                            />
                        </g>
                    ))}

                    {processedEvents.map((event, idx) => {
                        const isHovered = hoveredEvent === event.id;
                        const tooltipHandlers = getHandlers(`${event.title}\n${event.start || event.date}${event.end && event.end !== event.start ? ` → ${event.end}` : ''}`);

                        return (
                            <g
                                key={event.id || idx}
                                data-status={event.status}
                                className="chart--timeline__event-group"
                                onMouseEnter={(e) => {
                                    setHoveredEvent(event.id);
                                    tooltipHandlers.onMouseEnter(e);
                                }}
                                onMouseLeave={() => {
                                    setHoveredEvent(null);
                                    tooltipHandlers.onMouseLeave();
                                }}
                            >
                                {showLabels && (
                                    <text
                                        x={padding.left - 10}
                                        y={event.y + rowHeight / 2 + 4}
                                        className={cn('chart--timeline__event-label', {
                                            'chart--timeline__event-label--hovered': isHovered
                                        })}
                                    >
                                        {event.title?.length > 12
                                            ? event.title.substring(0, 11) + '…'
                                            : event.title}
                                    </text>
                                )}

                                {event.isMilestone && showMilestones ? (
                                    <g transform={`translate(${event.startX}, ${event.y + rowHeight / 2})`}>
                                        <polygon
                                            points="0,-10 10,0 0,10 -10,0"
                                            fill={event.color}
                                            className="chart--timeline__milestone"
                                        />
                                    </g>
                                ) : (
                                    <rect
                                        x={event.startX}
                                        y={event.y + 8}
                                        width={event.barWidth}
                                        height={rowHeight - 16}
                                        fill={event.color}
                                        fillOpacity={isHovered ? 1 : 0.85}
                                        className="chart--timeline__event-bar"
                                    />
                                )}
                            </g>
                        );
                    })}

                    {(() => {
                        const today = Date.now();
                        if (today >= timeline.min && today <= timeline.max) {
                            const x = padding.left + ((today - timeline.min) / timeline.range) * chartWidth;
                            return (
                                <g>
                                    <line
                                        x1={x}
                                        y1={padding.top - 10}
                                        x2={x}
                                        y2={totalHeight - padding.bottom}
                                        className="chart--timeline__today-line"
                                    />
                                    <text
                                        x={x}
                                        y={padding.top - 15}
                                        className="chart--timeline__today-text"
                                    >
                                        Today
                                    </text>
                                </g>
                            );
                        }
                        return null;
                    })()}
                </svg>

                <ChartLegend
                    payload={Object.entries(statusColors || {}).map(([status, color], idx) => ({
                        id: String(idx),
                        value: status.charAt(0).toUpperCase() + status.slice(1),
                        color: color as string,
                    }))}
                    activeIndex={activeLegendIndex}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                />

                <SVGTooltip tooltip={tooltip} />
            </div>
        </ChartShell>
    );
};

export default TimelineChart;
