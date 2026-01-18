import { cva, type VariantProps } from 'class-variance-authority';

export const polarAreaChartVariants = cva('chart chart--polar-area', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface PolarAreaData {
    name: string;
    value: number;
    color?: string;
}

export interface PolarAreaChartProps extends VariantProps<typeof polarAreaChartVariants> {
    data: PolarAreaData[];
    size?: number;
    innerRadius?: number;
    showLabels?: boolean;
    showLegend?: boolean;
    startAngle?: number;
    valueFormatter?: (v: number) => string;
    className?: string;
}
