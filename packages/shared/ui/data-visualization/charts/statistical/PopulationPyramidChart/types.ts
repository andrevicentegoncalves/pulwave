import { cva, type VariantProps } from 'class-variance-authority';

export const populationPyramidChartVariants = cva('chart chart--population-pyramid', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface PopulationPyramidChartProps extends VariantProps<typeof populationPyramidChartVariants> {
    data: any[];
    leftKey?: string;
    rightKey?: string;
    categoryKey?: string;
    leftLabel?: string;
    rightLabel?: string;
    leftColor?: string;
    rightColor?: string;
    height?: number;
    showLabels?: boolean;
    valueFormatter?: (value: number) => string;
    className?: string;
}
