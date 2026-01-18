import { cva, type VariantProps } from 'class-variance-authority';

export const histogramChartVariants = cva('chart chart--histogram', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface HistogramChartProps extends VariantProps<typeof histogramChartVariants> {
    data: number[];
    bins?: number;
    height?: number;
    color?: string;
    showGrid?: boolean;
    showMean?: boolean;
    showMedian?: boolean;
    valueFormatter?: (value: any) => string;
    className?: string;
}
