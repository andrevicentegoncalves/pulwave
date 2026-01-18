import { cva, type VariantProps } from 'class-variance-authority';

export const gaugeChartVariants = cva('chart chart--gauge', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface GaugeSegment {
    start: number;
    end: number;
    color: string;
}

export interface GaugeChartProps extends VariantProps<typeof gaugeChartVariants> {
    value: number;
    min?: number;
    max?: number;
    width?: number;
    height?: number;
    thickness?: number;
    color?: string;
    trackColor?: string;
    label?: string;
    valueFormatter?: (v: number) => string;
    showValue?: boolean;
    animate?: boolean;
    segments?: GaugeSegment[];
    className?: string;
    ariaLabel?: string;
}
