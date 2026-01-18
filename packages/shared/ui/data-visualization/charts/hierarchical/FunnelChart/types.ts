import { cva, type VariantProps } from 'class-variance-authority';
import type { BaseChartProps, TooltipFormatter } from '../../../types';

export const funnelChartVariants = cva('chart chart--funnel', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface FunnelChartProps extends BaseChartProps, VariantProps<typeof funnelChartVariants> {
    data: Array<Record<string, unknown>>;
    nameKey?: string;
    valueKey?: string;
    showLabels?: boolean;
    labelPosition?: 'left' | 'right' | 'center';
    showTooltip?: boolean;
    colors?: string[];
    tooltipFormatter?: TooltipFormatter;
    onStageClick?: (data: unknown, index: number) => void;
}
