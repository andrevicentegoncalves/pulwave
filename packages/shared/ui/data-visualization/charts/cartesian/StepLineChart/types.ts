import { cva, type VariantProps } from 'class-variance-authority';

export const stepLineChartVariants = cva('chart chart--step-line', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface SeriesConfig {
    key: string;
    name?: string;
    color?: string;
}

export interface StepLineChartProps extends VariantProps<typeof stepLineChartVariants> {
    data: any[];
    xKey?: string;
    dataKey?: string;
    series?: SeriesConfig[] | null;
    stepType?: 'step' | 'stepBefore' | 'stepAfter';
    height?: number;
    showGrid?: boolean;
    showLegend?: boolean;
    showDots?: boolean;
    strokeWidth?: number;
    color?: string;
    valueFormatter?: (value: any) => string;
    className?: string;
}
