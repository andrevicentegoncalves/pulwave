import { cva, type VariantProps } from 'class-variance-authority';

export const splineLineChartVariants = cva('chart chart--spline-line', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface SeriesConfig {
    key: string;
    name?: string;
    color?: string;
}

export interface SplineLineChartProps extends VariantProps<typeof splineLineChartVariants> {
    data: any[];
    xKey?: string;
    series: SeriesConfig[];
    height?: number;
    showGrid?: boolean;
    showLegend?: boolean;
    showDots?: boolean;
    strokeWidth?: number;
    curveType?: 'monotone' | 'natural' | 'basis' | 'cardinal' | 'linear';
    valueFormatter?: (value: any) => string;
    className?: string;
}
