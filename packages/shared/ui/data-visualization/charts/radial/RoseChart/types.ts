import { cva, type VariantProps } from 'class-variance-authority';

export const roseChartVariants = cva('chart chart--rose', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface RoseData {
    name: string;
    value: number;
    color?: string;
}

export interface RoseChartProps extends VariantProps<typeof roseChartVariants> {
    data: RoseData[];
    size?: number;
    innerRadius?: number;
    showLabels?: boolean;
    showLegend?: boolean;
    startAngle?: number;
    valueFormatter?: (v: number) => string;
    className?: string;
}
