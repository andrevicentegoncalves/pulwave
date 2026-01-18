import { cva, type VariantProps } from 'class-variance-authority';

export const nestedPieChartVariants = cva('chart chart--nested-pie', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface NestedPieData {
    name: string;
    value: number;
    color?: string;
}

export interface NestedPieRing {
    data: NestedPieData[];
    label?: string;
}

export interface NestedPieChartProps extends VariantProps<typeof nestedPieChartVariants> {
    rings: NestedPieRing[];
    size?: number;
    innerRadius?: number;
    ringGap?: number;
    showLabels?: boolean;
    showLegend?: boolean;
    className?: string;
}
