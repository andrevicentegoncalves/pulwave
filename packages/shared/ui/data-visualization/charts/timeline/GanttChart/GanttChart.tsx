import React, { useMemo } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { ChartShell } from '../../../primitives/ChartShell';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { ganttChartVariants, type GanttChartProps, type GanttTask, type TaskGroup } from './types';
import './styles/_index.scss';

/**
 * GanttChart Component
 * 
 * Project timeline visualization with task bars, groups, and milestones.
 */
export const GanttChart = ({
    data = [],
    startDate,
    endDate,
    height,
    rowHeight = 36,
    showToday = true,
    showGroups = true,
    statusColors,
    groupColors,
    className,
}: GanttChartProps) => {
    const { semanticColors } = useChartContext();
    const { tooltip, getHandlers } = useSVGTooltip();

    const resolvedStatusColors = useMemo((): Record<string, string> => ({
        done: semanticColors.success,
        'in-progress': semanticColors.primary,
        'on-going': semanticColors.primary,
        upcoming: semanticColors.warning,
        pending: semanticColors.textMuted,
        ...statusColors,
    }), [semanticColors, statusColors]);

    const resolvedGroupColors = useMemo((): Record<string, string> => ({
        default: semanticColors.error,
        ...groupColors,
    }), [semanticColors, groupColors]);

    // Early return for empty data
    if (!Array.isArray(data) || data.length === 0) {
        return (
            <div
                className={cn(ganttChartVariants(), 'chart--gantt--empty', className)}
                style={{ height: height || 200 }}
            >
                <span>No data available</span>
            </div>
        );
    }

    const start = useMemo(() => {
        const d = new Date(startDate || data[0]?.start);
        return isNaN(d.getTime()) ? new Date() : d;
    }, [startDate, data]);

    const end = useMemo(() => {
        if (endDate) {
            const d = new Date(endDate);
            return isNaN(d.getTime()) ? new Date() : d;
        }
        const dates = data.map((d: GanttTask) => new Date(d.end).getTime()).filter(t => !isNaN(t));
        if (dates.length === 0) return new Date();
        const maxEnd = Math.max(...dates);
        return new Date(maxEnd);
    }, [endDate, data]);

    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const chartWidth = Math.max(totalDays * 30, 600);
    const labelWidth = 200;

    const groupedData = useMemo((): TaskGroup[] => {
        if (!showGroups) return [{ group: null, tasks: data }];

        const groups: Record<string, GanttTask[]> = {};
        data.forEach((task: GanttTask) => {
            const group = task.group || 'Ungrouped';
            if (!groups[group]) groups[group] = [];
            groups[group].push(task);
        });

        return Object.entries(groups).map(([group, tasks]) => ({ group, tasks }));
    }, [data, showGroups]);

    const totalRows = groupedData.reduce((sum: number, g: TaskGroup) => sum + (showGroups && g.group ? 1 : 0) + g.tasks.length, 0);
    const chartHeight = height || totalRows * rowHeight + 60;

    const dateTicks = useMemo(() => {
        const ticks = [];
        const current = new Date(start);
        while (current <= end) {
            ticks.push(new Date(current));
            current.setDate(current.getDate() + 7);
        }
        return ticks;
    }, [start, end]);

    const getXFromDate = (date: string | Date) => {
        const d = new Date(date);
        const days = (d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        return labelWidth + (days / totalDays) * (chartWidth - labelWidth);
    };

    const today = new Date();
    const todayX = today >= start && today <= end ? getXFromDate(today) : null;

    let currentRow = 0;

    return (
        <ChartShell
            className={cn(ganttChartVariants(), className)}
            height={chartHeight}
            width="100%"
            responsive={false}
        >
            <div className="chart--gantt__container">
                <svg width={chartWidth} height={chartHeight} role="img" aria-label={`Gantt chart showing ${data.length} tasks`}>
                    <g className="chart--gantt__header">
                        {dateTicks.map((date: Date, idx: number) => {
                            const x = getXFromDate(date);
                            return (
                                <g key={idx}>
                                    <line
                                        x1={x}
                                        y1={30}
                                        x2={x}
                                        y2={chartHeight}
                                        className="chart--gantt__header-line"
                                    />
                                    <text
                                        x={x}
                                        y={20}
                                        textAnchor="middle"
                                        className="chart--gantt__header-text"
                                    >
                                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </text>
                                </g>
                            );
                        })}
                    </g>

                    {groupedData.map((g: TaskGroup, gIdx: number) => {
                        const groupY = 40 + currentRow * rowHeight;

                        if (showGroups && g.group) {
                            currentRow++;
                        }

                        return (
                            <g key={gIdx}>
                                {showGroups && g.group && (
                                    <g>
                                        <rect
                                            x={5}
                                            y={groupY}
                                            width={labelWidth - 10}
                                            height={rowHeight - 4}
                                            fill={resolvedGroupColors[g.group] || resolvedGroupColors.default}
                                            className="chart--gantt__group-header"
                                        />
                                        <text
                                            x={12}
                                            y={groupY + rowHeight / 2 + 1}
                                            className="chart--gantt__group-text"
                                        >
                                            {g.group}
                                        </text>
                                    </g>
                                )}

                                {g.tasks.map((task: GanttTask, tIdx: number) => {
                                    const taskY = 40 + currentRow * rowHeight;
                                    currentRow++;

                                    const taskStart = getXFromDate(task.start);
                                    const taskEnd = getXFromDate(task.end);
                                    const taskWidth = Math.max(taskEnd - taskStart, 20);
                                    const color = resolvedStatusColors[task.status] || resolvedStatusColors.pending;
                                    const tooltipHandlers = getHandlers(`${task.name}\n${task.start} - ${task.end}\nStatus: ${task.status}`);

                                    return (
                                        <g key={task.id || tIdx}>
                                            <rect
                                                x={0}
                                                y={taskY}
                                                width={chartWidth}
                                                height={rowHeight}
                                                fill={tIdx % 2 === 0 ? 'transparent' : 'currentColor'}
                                                className="chart--gantt__row-background"
                                            />
                                            <text
                                                x={10}
                                                y={taskY + rowHeight / 2 + 1}
                                                className="chart--gantt__task-label"
                                            >
                                                {task.name}
                                            </text>
                                            <rect
                                                x={taskStart}
                                                y={taskY + 6}
                                                width={taskWidth}
                                                height={rowHeight - 12}
                                                fill={color}
                                                className="chart--gantt__task-bar"
                                                {...tooltipHandlers}
                                            />
                                            {taskWidth > 60 && (
                                                <text
                                                    x={taskStart + taskWidth / 2}
                                                    y={taskY + rowHeight / 2 + 1}
                                                    className="chart--gantt__task-status"
                                                >
                                                    {task.status?.charAt(0).toUpperCase() + task.status?.slice(1)}
                                                </text>
                                            )}
                                            <circle
                                                cx={taskEnd}
                                                cy={taskY + rowHeight / 2}
                                                r={4}
                                                fill={color}
                                                className="chart--gantt__end-marker"
                                            />
                                        </g>
                                    );
                                })}
                            </g>
                        );
                    })}

                    {showToday && todayX && (
                        <line
                            x1={todayX}
                            y1={30}
                            x2={todayX}
                            y2={chartHeight}
                            className="chart--gantt__today-line"
                        />
                    )}
                </svg>

                <SVGTooltip tooltip={tooltip} />
            </div>
        </ChartShell>
    );
};

export default GanttChart;
