import { cva, type VariantProps } from 'class-variance-authority';

export const heatmapChartVariants = cva('chart chart--heatmap', {
    variants: {
        colorScale: {
            sequential: 'chart--heatmap--sequential',
            diverging: 'chart--heatmap--diverging',
        },
    },
    defaultVariants: {
        colorScale: 'sequential',
    },
});

export interface HeatmapDataItem {
    row: string;
    col: string;
    value: number;
    [key: string]: any;
}

export interface HeatmapChartProps extends VariantProps<typeof heatmapChartVariants> {
    data: HeatmapDataItem[];
    xLabels: string[];
    yLabels: string[];
    rowKey?: string;
    colKey?: string;
    valueKey?: string;
    height?: number;
    cellSize?: number;
    cellGap?: number;
    showValues?: boolean;
    showLabels?: boolean;
    showLegend?: boolean;
    valueFormatter?: (v: number | undefined) => string;
    minValue?: number;
    maxValue?: number;
    onCellClick?: (data: { row: string; col: string; value: number }) => void;
    className?: string;
}
