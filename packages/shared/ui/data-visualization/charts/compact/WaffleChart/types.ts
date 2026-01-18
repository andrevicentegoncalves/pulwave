import { cva, type VariantProps } from 'class-variance-authority';

export const waffleChartVariants = cva('chart chart--waffle', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface WaffleDataItem {
    name: string;
    value: number;
    color?: string;
    [key: string]: any;
}

export interface WaffleChartProps extends VariantProps<typeof waffleChartVariants> {
    data: WaffleDataItem[];
    total?: number;
    rows?: number;
    cols?: number;
    cellSize?: number;
    cellGap?: number;
    cellRadius?: number;
    showLegend?: boolean;
    showValues?: boolean;
    valueFormatter?: (v: number) => string;
    className?: string;
}
