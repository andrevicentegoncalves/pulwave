import { cva, type VariantProps } from 'class-variance-authority';

export const candlestickChartVariants = cva('chart chart--candlestick', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface CandlestickData {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

export interface CandlestickChartProps extends VariantProps<typeof candlestickChartVariants> {
    data: CandlestickData[];
    height?: number;
    padding?: number;
    upColor?: string;
    downColor?: string;
    showVolume?: boolean;
    className?: string;
}
