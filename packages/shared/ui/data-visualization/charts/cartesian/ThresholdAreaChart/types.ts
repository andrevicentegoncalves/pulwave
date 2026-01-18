import { cva, type VariantProps } from 'class-variance-authority';

export const thresholdAreaChartVariants = cva('chart chart--threshold-area', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface ThresholdAreaChartProps extends VariantProps<typeof thresholdAreaChartVariants> {
    data: any[];
    dataKey?: string;
    xKey?: string;
    threshold?: number;
    thresholdLabel?: string;
    aboveColor?: string;
    belowColor?: string;
    height?: number;
    showGrid?: boolean;
    valueFormatter?: (value: any) => string;
    className?: string;
}
