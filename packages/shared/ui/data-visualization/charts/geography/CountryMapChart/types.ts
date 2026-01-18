import { cva, type VariantProps } from 'class-variance-authority';

export const countryMapChartVariants = cva('chart chart--country-map', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface CountryMapChartProps extends VariantProps<typeof countryMapChartVariants> {
    country: string;
    data: any[];
    regionKey?: string;
    valueKey?: string;
    colorScale?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal';
    showLegend?: boolean;
    showLabels?: boolean;
    showTooltip?: boolean;
    interactive?: boolean;
    title?: string;
    className?: string;
    width?: number | string;
    height?: number | string;
}

export const SUPPORTED_COUNTRIES = ['portugal', 'germany', 'usa'];
