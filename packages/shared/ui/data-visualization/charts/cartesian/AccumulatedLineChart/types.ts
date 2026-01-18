import { cva, type VariantProps } from 'class-variance-authority';

export const accumulatedLineChartVariants = cva('chart chart--accumulated-line', {
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

export interface AccumulatedLineChartProps extends VariantProps<typeof accumulatedLineChartVariants> {
    data: any[];
    series: SeriesConfig[];
    xKey?: string;
    height?: number;
    showGrid?: boolean;
    showLegend?: boolean;
    showMarkers?: boolean;
    valueSuffix?: string;
    valueFormatter?: (value: any) => string;
    className?: string;
}
