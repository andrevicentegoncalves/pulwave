import { cva, type VariantProps } from 'class-variance-authority';

export const violinPlotVariants = cva('chart chart--violin-plot', {
    variants: {
        layout: {
            vertical: 'chart--violin-plot--vertical',
            horizontal: 'chart--violin-plot--horizontal',
        },
    },
    defaultVariants: {
        layout: 'vertical',
    },
});

export interface ViolinPlotDataItem {
    category: string;
    values: number[];
    [key: string]: any;
}

export interface ViolinPlotProps extends VariantProps<typeof violinPlotVariants> {
    data: ViolinPlotDataItem[];
    categoryKey?: string;
    height?: number;
    className?: string;
}
