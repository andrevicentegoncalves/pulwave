import { cva, type VariantProps } from 'class-variance-authority';

export const sunburstChartVariants = cva('chart chart--sunburst', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface HierarchicalData {
    name: string;
    value?: number;
    color?: string;
    children?: HierarchicalData[];
}

export interface SunburstChartProps extends VariantProps<typeof sunburstChartVariants> {
    data: HierarchicalData;
    size?: number;
    innerRadius?: number;
    showLabels?: boolean;
    showCenter?: boolean;
    showLegend?: boolean;
    centerText?: string;
    className?: string;
}
