import { cva, type VariantProps } from 'class-variance-authority';

export const scatterChartVariants = cva('chart chart--scatter', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface ScatterChartProps extends VariantProps<typeof scatterChartVariants> {
    data: any[];
    xKey?: string;
    yKey?: string;
    zKey?: string;
    groupKey?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    width?: string | number;
    height?: number;
    dotSize?: number;
    minDotSize?: number;
    maxDotSize?: number;
    showGrid?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    showTooltip?: boolean;
    showLegend?: boolean;
    legendPosition?: 'top' | 'bottom';
    colors?: string[];
    animate?: boolean;
    animationDuration?: number;
    xAxisFormatter?: (value: any) => string;
    yAxisFormatter?: (value: any) => string;
    tooltipFormatter?: (value: any) => string;
    onDotClick?: (data: any) => void;
    className?: string;
    ariaLabel?: string;
}
