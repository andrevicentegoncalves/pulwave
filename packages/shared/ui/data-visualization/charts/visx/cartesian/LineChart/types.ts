import { cva, type VariantProps } from 'class-variance-authority';

export const lineChartVariants = cva('chart chart--line', {
    variants: {
        variant: {
            line: 'chart--line-only',
            area: 'chart--line-area',
        },
    },
    defaultVariants: {
        variant: 'line',
    },
});

/** Data point type for chart data - allows string keys with string or number values */
export type ChartDataItem = Record<string, string | number>;

export interface LineChartProps extends VariantProps<typeof lineChartVariants> {
    data: ChartDataItem[];
    xKey: string;
    yKeys: string[];
    yKeyNames?: Record<string, string>;
    width?: string | number;
    height?: number;
    smooth?: boolean;
    showDots?: boolean;
    dotSize?: number;
    strokeWidth?: number;
    showGrid?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    showTooltip?: boolean;
    showLegend?: boolean;
    legendPosition?: 'top' | 'bottom';
    stacking?: 'none' | 'normal' | 'percent';
    colors?: string[];
    animate?: boolean;
    animationDuration?: number;
    xAxisFormatter?: (value: string | number) => string;
    yAxisFormatter?: (value: string | number) => string;
    tooltipFormatter?: (value: string | number, name: string) => string | number;
    onDataPointClick?: (data: ChartDataItem, index: number) => void;
    className?: string;
    ariaLabel?: string;
}
