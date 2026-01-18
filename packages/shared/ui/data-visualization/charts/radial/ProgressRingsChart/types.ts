import { cva, type VariantProps } from 'class-variance-authority';

export const progressRingsChartVariants = cva('chart chart--progress-rings', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface ProgressRingData {
    name: string;
    value: number;
    color?: string;
}

export interface ProgressRingsChartProps extends VariantProps<typeof progressRingsChartVariants> {
    data: ProgressRingData[];
    centerValue?: string;
    centerLabel?: string;
    size?: number;
    strokeWidth?: number;
    gap?: number;
    showLegend?: boolean;
    className?: string;
}
