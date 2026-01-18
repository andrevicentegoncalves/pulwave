import { cva, type VariantProps } from 'class-variance-authority';

export const dotPlotChartVariants = cva('chart chart--dot-plot', {
    variants: {
        layout: {
            horizontal: 'chart--dot-plot-horizontal',
            vertical: 'chart--dot-plot-vertical',
        },
    },
    defaultVariants: {
        layout: 'horizontal',
    },
});

export interface DotPlotData {
    category: string;
    value: number;
    color?: string;
    [key: string]: any;
}

export interface DotPlotChartProps extends VariantProps<typeof dotPlotChartVariants> {
    data: DotPlotData[];
    valueKey?: string;
    categoryKey?: string;
    height?: number;
    dotSize?: number;
    showGrid?: boolean;
    showLabels?: boolean;
    showValues?: boolean;
    valueFormatter?: (v: number) => string;
    className?: string;
}
