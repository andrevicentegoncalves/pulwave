import { cva, type VariantProps } from 'class-variance-authority';

export const parallelCoordinatesPlotVariants = cva('chart chart--parallel-coordinates', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface ParallelCoordinatesPlotProps extends VariantProps<typeof parallelCoordinatesPlotVariants> {
    data: any[];
    dimensions: string[];
    width?: number;
    height?: number;
    showLabels?: boolean;
    showTicks?: boolean;
    lineWidth?: number;
    highlightOnHover?: boolean;
    className?: string;
}
