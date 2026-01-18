import { cva, type VariantProps } from 'class-variance-authority';

export const dualAxisChartVariants = cva('chart chart--dual-axis', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface DualAxisChartProps extends VariantProps<typeof dualAxisChartVariants> {
    data: any[];
    barKey?: string;
    lineKey?: string;
    xKey?: string;
    barName?: string;
    lineName?: string;
    barColor?: string;
    lineColor?: string;
    height?: number;
    showGrid?: boolean;
    showLegend?: boolean;
    barValueFormatter?: (value: any) => string;
    lineValueFormatter?: (value: any) => string;
    className?: string;
}
