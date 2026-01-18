import { cva, type VariantProps } from 'class-variance-authority';

export const bubbleMapChartVariants = cva('chart chart--bubble-map', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface BubbleMapChartProps extends VariantProps<typeof bubbleMapChartVariants> {
    data: any[];
    countryKey?: string;
    valueKey?: string;
    labelKey?: string;
    width?: number;
    height?: number;
    minBubbleSize?: number;
    maxBubbleSize?: number;
    bubbleColor?: string;
    showLabels?: boolean;
    showLegend?: boolean;
    valueFormatter?: (v: number) => string;
    className?: string;
}
