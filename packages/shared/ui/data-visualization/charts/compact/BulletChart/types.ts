import { cva, type VariantProps } from 'class-variance-authority';

export const bulletChartVariants = cva('chart chart--bullet', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface BulletRange {
    max: number;
    color: string;
    label?: string;
}

export interface BulletChartProps extends VariantProps<typeof bulletChartVariants> {
    value: number;
    target?: number;
    ranges?: BulletRange[];
    maxValue?: number;
    height?: number;
    width?: number | string;
    showValue?: boolean;
    showTarget?: boolean;
    valueFormatter?: (v: number) => string;
    title?: string;
    subtitle?: string;
    className?: string;
}
