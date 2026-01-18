import { type VariantProps, cva } from 'class-variance-authority';

export const donutChartVariants = cva('chart chart--donut-wrapper', {
    variants: {
        size: {
            sm: 'chart--donut-wrapper--sm',
            md: 'chart--donut-wrapper--md',
            lg: 'chart--donut-wrapper--lg',
        },
    },
    defaultVariants: {
        size: 'md',
    },
});

export interface DonutChartProps extends VariantProps<typeof donutChartVariants> {
    data: any[];
    nameKey?: string;
    valueKey?: string;
    width?: number | string;
    height?: number;
    innerRadius?: number | string;
    outerRadius?: number | string;
    paddingAngle?: number;
    showLabels?: boolean;
    labelPosition?: 'inside' | 'outside';
    showTooltip?: boolean;
    showLegend?: boolean;
    legendPosition?: 'top' | 'bottom';
    legendLayout?: 'horizontal' | 'vertical';
    colors?: string[];
    animate?: boolean;
    animationDuration?: number;
    activeShape?: boolean;
    tooltipFormatter?: (value: any, name: any, props: any) => React.ReactNode;
    onSliceClick?: (data: any, index: number) => void;
    centerLabel?: React.ReactNode;
    centerValue?: string | number;
    centerSubtext?: string;
    className?: string;
    ariaLabel?: string;
}
