import { cva, type VariantProps } from 'class-variance-authority';

export const bubblePackChartVariants = cva('chart chart--bubble-pack', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface BubbleData {
    name: string;
    value: number;
    color?: string;
    children?: BubbleData[];
    [key: string]: string | number | boolean | BubbleData[] | undefined;
}

export interface PositionedBubble extends BubbleData {
    x: number;
    y: number;
    radius: number;
    originalIndex: number;
}

export interface BubblePackChartProps extends VariantProps<typeof bubblePackChartVariants> {
    data: BubbleData[];
    valueKey?: string;
    nameKey?: string;
    height?: number;
    showLabels?: boolean;
    labelMinSize?: number;
    valueFormatter?: (v: number) => string;
    padding?: number;
    onBubbleClick?: (data: PositionedBubble) => void;
    className?: string;
}
