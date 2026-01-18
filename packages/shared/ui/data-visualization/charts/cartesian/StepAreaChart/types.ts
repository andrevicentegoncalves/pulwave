import { cva, type VariantProps } from 'class-variance-authority';

export const stepAreaChartVariants = cva('chart chart--step-area', {
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

export interface StepAreaChartProps extends VariantProps<typeof stepAreaChartVariants> {
    data: any[];
    xKey?: string;
    dataKey?: string;
    dataKeys?: SeriesConfig[] | null;
    stepType?: 'step' | 'stepBefore' | 'stepAfter';
    height?: number;
    showGrid?: boolean;
    showLegend?: boolean;
    fillOpacity?: number;
    strokeWidth?: number;
    color?: string;
    valueFormatter?: (value: any) => string;
    className?: string;
}
