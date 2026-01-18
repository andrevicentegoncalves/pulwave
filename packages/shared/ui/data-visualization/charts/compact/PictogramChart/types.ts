import { cva, type VariantProps } from 'class-variance-authority';

export const pictogramChartVariants = cva('chart chart--pictogram', {
    variants: {
        layout: {
            grid: 'chart--pictogram--grid',
            row: 'chart--pictogram--row',
        },
    },
    defaultVariants: {
        layout: 'grid',
    },
});

export interface PictogramDataItem {
    name: string;
    value: number;
    color?: string;
}

export interface PictogramIconData extends PictogramDataItem {
    iconCount: number;
    icons: null[];
}

export interface GridIconItem {
    color: string;
    name: string;
    itemIndex: number;
}

export interface PictogramChartProps extends VariantProps<typeof pictogramChartVariants> {
    data: PictogramDataItem[];
    total?: number;
    iconPerUnit?: number;
    icon?: string;
    iconSize?: number;
    iconsPerRow?: number;
    iconGap?: number;
    showLegend?: boolean;
    showValues?: boolean;
    valueFormatter?: (v: number) => string;
    className?: string;
}
