import { cva, type VariantProps } from 'class-variance-authority';

export const pyramidChartVariants = cva('chart chart--pyramid', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface PyramidData {
    name: string;
    value: number;
    color?: string;
}

export interface PyramidChartProps extends VariantProps<typeof pyramidChartVariants> {
    data: PyramidData[];
    width?: number;
    height?: number;
    showLabels?: boolean;
    showValues?: boolean;
    showLegend?: boolean;
    variant?: 'funnel' | 'pyramid' | 'stacked' | 'aligned';
    valueFormatter?: (v: number) => string;
    className?: string;
}
