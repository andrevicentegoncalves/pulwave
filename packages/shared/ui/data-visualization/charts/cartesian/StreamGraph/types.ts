import { cva, type VariantProps } from 'class-variance-authority';

export const streamGraphVariants = cva('chart chart--stream', {
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

export interface StreamGraphProps extends VariantProps<typeof streamGraphVariants> {
    data: any[];
    series: (string | SeriesConfig)[];
    xKey?: string;
    height?: number;
    showLabels?: boolean;
    curved?: boolean;
    valueFormatter?: (value: any) => string;
    className?: string;
}
