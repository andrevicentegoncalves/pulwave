import { cva, type VariantProps } from 'class-variance-authority';

export const timelineChartVariants = cva('chart chart--timeline', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface TimelineEvent {
    id: string | number;
    title: string;
    start?: string | Date;
    end?: string | Date;
    date?: string | Date;
    status: 'complete' | 'active' | 'pending' | 'delayed' | string;
    color?: string;
}

export interface TimelineChartProps extends VariantProps<typeof timelineChartVariants> {
    events: TimelineEvent[];
    width?: number;
    height?: number;
    rowHeight?: number;
    showLabels?: boolean;
    showMilestones?: boolean;
    statusColors?: Record<string, string>;
    className?: string;
}
