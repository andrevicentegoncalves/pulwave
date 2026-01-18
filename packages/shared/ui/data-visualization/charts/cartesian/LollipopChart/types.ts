import { cva, type VariantProps } from 'class-variance-authority';

export const lollipopChartVariants = cva('chart chart--lollipop', {
    variants: {
        layout: {
            horizontal: 'chart--lollipop-horizontal',
            vertical: 'chart--lollipop-vertical',
        },
    },
    defaultVariants: {
        layout: 'horizontal',
    },
});

export interface LollipopChartProps extends VariantProps<typeof lollipopChartVariants> {
    data: any[];
    dataKey?: string;
    categoryKey?: string;
    height?: number;
    dotSize?: number;
    stemWidth?: number;
    showGrid?: boolean;
    showLabels?: boolean;
    valueFormatter?: (value: any) => string;
    className?: string;
}
