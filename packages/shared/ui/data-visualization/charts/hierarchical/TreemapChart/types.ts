import { cva, type VariantProps } from 'class-variance-authority';

export const treemapChartVariants = cva('chart chart--treemap', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface TreemapNode {
    name?: string;
    size?: number;
    value?: number;
    color?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    children?: TreemapNode[];
    [key: string]: unknown;
}

export interface TreemapContentProps {
    x: number;
    y: number;
    width: number;
    height: number;
    name?: string;
    value?: number;
    fill?: string;
    depth: number;
    root?: { width: number; height: number };
    [key: string]: unknown;
}

export interface TreemapChartProps extends VariantProps<typeof treemapChartVariants> {
    data: TreemapNode[];
    dataKey?: string;
    nameKey?: string;
    aspectRatio?: number;
    height?: number;
    showLabels?: boolean;
    labelMinSize?: number;
    colorByRoot?: boolean;
    valueFormatter?: (value: number | undefined) => string;
    onNodeClick?: (data: TreemapContentProps) => void;
    className?: string;
}
