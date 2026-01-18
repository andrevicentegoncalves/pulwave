import { cva, type VariantProps } from 'class-variance-authority';

export const sparklineChartVariants = cva('chart chart--sparkline', {
    variants: {
        variant: {
            line: 'chart--sparkline--line',
            area: 'chart--sparkline--area',
        },
    },
    defaultVariants: {
        variant: 'line',
    },
});

export interface SparklineDataPoint {
    [key: string]: number | string;
}

export interface SparklineChartProps extends VariantProps<typeof sparklineChartVariants> {
    data: number[] | SparklineDataPoint[];
    dataKey?: string;
    width?: number | string;
    height?: number;
    color?: string;
    showReferenceLine?: boolean;
    referenceValue?: number;
    smooth?: boolean;
    strokeWidth?: number;
    fillOpacity?: number;
    animate?: boolean;
    className?: string;
    ariaLabel?: string;
}
