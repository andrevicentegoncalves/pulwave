import { cva, type VariantProps } from 'class-variance-authority';

export const divergingBarChartVariants = cva('chart chart--diverging-bar', {
    variants: {
        layout: {
            horizontal: 'chart--diverging-bar-horizontal',
            vertical: 'chart--diverging-bar-vertical',
        },
    },
    defaultVariants: {
        layout: 'horizontal',
    },
});

export interface DivergingBarChartProps extends VariantProps<typeof divergingBarChartVariants> {
    data: any[];
    dataKey?: string;
    categoryKey?: string;
    positiveColor?: string;
    negativeColor?: string;
    height?: number;
    showGrid?: boolean;
    showLabels?: boolean;
    valueFormatter?: (value: any) => string;
    className?: string;
}
