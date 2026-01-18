import { cva, type VariantProps } from 'class-variance-authority';

export const flowChartVariants = cva('chart chart--flow', {
    variants: {
        orientation: {
            vertical: 'chart--flow--vertical',
            horizontal: 'chart--flow--horizontal',
        },
    },
    defaultVariants: {
        orientation: 'vertical',
    },
});

export interface FlowNode {
    id: string;
    label?: string;
    type?: 'start' | 'end' | 'decision' | 'process' | 'io';
    color?: string;
    description?: string;
}

export interface FlowEdge {
    from: string;
    to: string;
    label?: string;
    branch?: string;
}

export interface FlowChartProps extends VariantProps<typeof flowChartVariants> {
    nodes: FlowNode[];
    edges: FlowEdge[];
    nodeWidth?: number;
    nodeHeight?: number;
    horizontalGap?: number;
    verticalGap?: number;
    showLabels?: boolean;
    className?: string;
}
