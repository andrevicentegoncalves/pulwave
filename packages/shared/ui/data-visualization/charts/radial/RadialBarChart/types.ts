import { cva, type VariantProps } from 'class-variance-authority';

export const radialBarChartVariants = cva('chart chart--radial-bar', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface RadialBarData {
    name: string;
    value: number;
    color?: string;
    [key: string]: any;
}

export interface RadialBarChartProps extends VariantProps<typeof radialBarChartVariants> {
    data: RadialBarData[];
    size?: number;
    innerRadius?: number;
    barGap?: number;
    maxValue?: number | null;
    showLabels?: boolean;
    showValues?: boolean;
    startAngle?: number;
    endAngle?: number;
    valueFormatter?: (v: number) => string;
    className?: string;
}
