import { cva, type VariantProps } from 'class-variance-authority';
import type { RadialChartProps, TooltipFormatter } from '../../../types';

export const pieChartVariants = cva('chart chart--pie', {
    variants: {
        size: {
            sm: 'chart--pie--sm',
            md: 'chart--pie--md',
            lg: 'chart--pie--lg',
        },
    },
    defaultVariants: {
        size: 'md',
    },
});

export interface PieChartProps extends RadialChartProps, VariantProps<typeof pieChartVariants> {
    paddingAngle?: number;
    showLabels?: boolean;
    labelPosition?: 'inside' | 'outside';
    legendLayout?: 'horizontal' | 'vertical';
    activeShape?: boolean;
    tooltipFormatter?: TooltipFormatter;
    onSliceClick?: (data: unknown, index: number) => void;
}
