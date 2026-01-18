import { cva, type VariantProps } from 'class-variance-authority';

export const parliamentChartVariants = cva('chart chart--parliament', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface ParliamentDataItem {
    name: string;
    seats: number;
    color?: string;
    [key: string]: any;
}

export interface ParliamentChartProps extends VariantProps<typeof parliamentChartVariants> {
    data: ParliamentDataItem[];
    totalSeats?: number;
    width?: number;
    height?: number;
    dotRadius?: number;
    dotGap?: number;
    rows?: number;
    showLegend?: boolean;
    showValues?: boolean;
    className?: string;
}
