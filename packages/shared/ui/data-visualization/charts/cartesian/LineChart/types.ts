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

export interface LineChartProps extends VariantProps<typeof lineChartVariants> {
    data: any[];
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
    xAxisFormatter?: (value: any) => string;
    yAxisFormatter?: (value: any) => string;
    tooltipFormatter?: (value: any, name: string) => any;
    onDataPointClick?: (data: any, index: number) => void;
    className?: string;
    ariaLabel?: string;
}
