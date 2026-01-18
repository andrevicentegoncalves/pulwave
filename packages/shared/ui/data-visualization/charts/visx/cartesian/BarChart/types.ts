import { cva, type VariantProps } from 'class-variance-authority';

export const barChartVariants = cva('chart chart--bar', {
    variants: {
        layout: {
            vertical: 'chart--vertical',
            horizontal: 'chart--horizontal',
        },
    },
    defaultVariants: {
        layout: 'vertical',
    },
});

/** Data point type for chart data - allows string keys with string or number values */
export type ChartDataItem = Record<string, string | number>;

export type BarChartProps = VariantProps<typeof barChartVariants> & {
    data: ChartDataItem[];
    xKey: string;
    yKeys: string[];
    yKeyNames?: Record<string, string>;
    width?: string | number;
    height?: number;
    grouping?: 'grouped' | 'stacked';
    barRadius?: number;
    barGap?: number | string;
    barCategoryGap?: number | string;
    showGrid?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    showTooltip?: boolean;
    showLegend?: boolean;
    legendPosition?: 'top' | 'bottom';
    showLabels?: boolean;
    colors?: string[];
    animate?: boolean;
    animationDuration?: number;
    xAxisFormatter?: (value: string | number) => string;
    yAxisFormatter?: (value: string | number) => string;
    tooltipFormatter?: (value: string | number, name: string) => string | number;
    onBarClick?: (data: ChartDataItem, index: number) => void;
    className?: string;
    ariaLabel?: string;
};
