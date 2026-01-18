import { cva, type VariantProps } from 'class-variance-authority';

export const performanceGaugeVariants = cva('chart chart--performance-gauge', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface GaugeRange {
    min: number;
    max: number;
    color: string;
    label?: string;
}

export interface PerformanceGaugeProps extends VariantProps<typeof performanceGaugeVariants> {
    value: number;
    min?: number;
    max?: number;
    ranges?: GaugeRange[];
    size?: number;
    thickness?: number;
    showTicks?: boolean;
    tickCount?: number;
    showValue?: boolean;
    valueLabel?: string;
    needleColor?: string;
    className?: string;
}
