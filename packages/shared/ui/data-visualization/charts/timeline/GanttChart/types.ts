import { cva, type VariantProps } from 'class-variance-authority';

export const ganttChartVariants = cva('chart chart--gantt', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface GanttTask {
    id: string | number;
    name: string;
    start: string | Date;
    end: string | Date;
    status: 'done' | 'in-progress' | 'on-going' | 'upcoming' | 'pending' | string;
    group?: string;
}

export interface GanttChartProps extends VariantProps<typeof ganttChartVariants> {
    data: GanttTask[];
    startDate?: string | Date;
    endDate?: string | Date;
    height?: number;
    rowHeight?: number;
    showToday?: boolean;
    showGroups?: boolean;
    statusColors?: Record<string, string>;
    groupColors?: Record<string, string>;
    className?: string;
}

export interface TaskGroup {
    group: string | null;
    tasks: GanttTask[];
}
