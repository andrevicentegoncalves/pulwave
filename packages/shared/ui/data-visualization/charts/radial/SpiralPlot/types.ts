import { cva, type VariantProps } from 'class-variance-authority';

export const spiralPlotVariants = cva('chart chart--spiral', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface SpiralData {
    label?: string;
    value: number;
    color?: string;
}

export interface SpiralPlotProps extends VariantProps<typeof spiralPlotVariants> {
    data: SpiralData[];
    size?: number;
    innerRadius?: number;
    turns?: number;
    barWidth?: number;
    showLabels?: boolean;
    valueFormatter?: (v: number) => string;
    className?: string;
}
