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

export type BarChartProps = VariantProps<typeof barChartVariants> & {
    data: any[];
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
    xAxisFormatter?: (value: any) => string;
    yAxisFormatter?: (value: any) => string;
    tooltipFormatter?: (value: any, name: string) => any;
    onBarClick?: (data: any, index: number) => void;
    className?: string;
    ariaLabel?: string;
};
