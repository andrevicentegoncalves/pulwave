import { cva, type VariantProps } from 'class-variance-authority';
import type { SeriesConfig } from '../../../types';

export const stackedBarChartVariants = cva('chart chart--stacked-bar', {
    variants: {
        layout: {
            horizontal: 'chart--stacked-bar-horizontal',
            vertical: 'chart--stacked-bar-vertical',
        },
    },
    defaultVariants: {
        layout: 'vertical',
    },
});

export interface StackedBarChartProps extends VariantProps<typeof stackedBarChartVariants> {
    data: any[];
    series: SeriesConfig[];
    categoryKey?: string;
    height?: number;
    width?: string | number;
    showGrid?: boolean;
    showLegend?: boolean;
    valueFormatter?: (value: any) => string;
    barRadius?: number;
    stackId?: string;
    animate?: boolean;
    animationDuration?: number;
    tooltipFormatter?: (value: any) => string;
    className?: string;
    ariaLabel?: string;
}
