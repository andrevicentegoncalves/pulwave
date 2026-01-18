import { cva, type VariantProps } from 'class-variance-authority';

export const boxPlotChartVariants = cva('chart chart--box-plot', {
    variants: {
        layout: {
            vertical: 'chart--box-plot--vertical',
            horizontal: 'chart--box-plot--horizontal',
        },
    },
    defaultVariants: {
        layout: 'vertical',
    },
});

export interface BoxPlotDataItem {
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    outliers?: number[];
    [key: string]: any;
}

export interface BoxPlotChartProps extends VariantProps<typeof boxPlotChartVariants> {
    data: BoxPlotDataItem[];
    categoryKey?: string;
    height?: number;
    boxWidth?: number;
    whiskerWidth?: number;
    showOutliers?: boolean;
    showLegend?: boolean;
    valueFormatter?: (v: number) => string;
    className?: string;
}
