import { cva, type VariantProps } from 'class-variance-authority';

export const geoChartVariants = cva('chart chart--geo', {
    variants: {
        colorScale: {
            blue: 'chart--geo--blue',
            green: 'chart--geo--green',
            red: 'chart--geo--red',
            orange: 'chart--geo--orange',
            purple: 'chart--geo--purple',
            teal: 'chart--geo--teal',
        },
    },
    defaultVariants: {
        colorScale: 'blue',
    },
});

export type ColorScaleType = 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'teal';

export interface GeoDataItem {
    [key: string]: string | number | undefined;
}

export interface GeoChartProps extends VariantProps<typeof geoChartVariants> {
    mapType?: string;
    data: GeoDataItem[];
    regionKey?: string;
    valueKey?: string;
    showLegend?: boolean;
    showLabels?: boolean;
    showTooltip?: boolean;
    interactive?: boolean;
    title?: string;
    className?: string;
    width?: number | string;
    height?: number | string;
}
