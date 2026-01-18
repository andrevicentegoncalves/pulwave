import { cva, type VariantProps } from 'class-variance-authority';
import type { CartesianChartProps } from '../../../types';

export const areaChartVariants = cva('chart chart--area', {
    variants: {
        stacking: {
            none: 'chart--area-stack-none',
            normal: 'chart--area-stack-normal',
            percent: 'chart--area-stack-percent',
        },
    },
    defaultVariants: {
        stacking: 'none',
    },
});

export interface AreaChartProps extends CartesianChartProps, VariantProps<typeof areaChartVariants> {
    /** Use smooth curves */
    smooth?: boolean;
    /** Fill opacity for areas */
    fillOpacity?: number;
    /** Stroke width for area lines */
    strokeWidth?: number;
    /** Click handler for data points */
    onDataPointClick?: (data: unknown, index: number) => void;
}
