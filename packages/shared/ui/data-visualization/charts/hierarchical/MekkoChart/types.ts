import { cva, type VariantProps } from 'class-variance-authority';

export const mekkoChartVariants = cva('chart chart--mekko', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface MekkoSegment {
    name: string;
    value: number;
    color?: string;
}

export interface MekkoData {
    name: string;
    total: number;
    segments?: MekkoSegment[];
}

export interface MekkoChartProps extends VariantProps<typeof mekkoChartVariants> {
    data: MekkoData[];
    width?: number;
    height?: number;
    showLabels?: boolean;
    showLegend?: boolean;
    valueFormatter?: (v: number) => string;
    className?: string;
}
