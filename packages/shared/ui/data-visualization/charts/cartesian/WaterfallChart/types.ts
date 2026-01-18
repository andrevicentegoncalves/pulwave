import { cva, type VariantProps } from 'class-variance-authority';

export const waterfallChartVariants = cva('chart chart-waterfall', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface WaterfallChartProps extends VariantProps<typeof waterfallChartVariants> {
    data: any[];
    valueKey?: string;
    deltaKey?: string;
    nameKey?: string;
    height?: number;
    showGrid?: boolean;
    showConnectors?: boolean;
    valueFormatter?: (value: any) => string;
    positiveColor?: string;
    negativeColor?: string;
    totalColor?: string;
    className?: string;
}
