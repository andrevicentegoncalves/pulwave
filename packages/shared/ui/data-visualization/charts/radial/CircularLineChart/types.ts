import { cva, type VariantProps } from 'class-variance-authority';

export const circularLineChartVariants = cva('chart chart--circular-line', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface DataKeyConfig {
    key: string;
    name?: string;
    color?: string;
}

export interface CircularLineChartProps extends VariantProps<typeof circularLineChartVariants> {
    data: any[];
    dataKeys: DataKeyConfig[];
    categoryKey?: string;
    height?: number;
    showGrid?: boolean;
    showLegend?: boolean;
    fillOpacity?: number;
    strokeWidth?: number;
    dotSize?: number;
    valueFormatter?: (value: any) => string;
    className?: string;
}
