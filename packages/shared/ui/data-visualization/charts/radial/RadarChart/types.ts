import { cva, type VariantProps } from 'class-variance-authority';

export const radarChartVariants = cva('chart chart--radar', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface RadarChartProps extends VariantProps<typeof radarChartVariants> {
    data: any[];
    angleKey: string;
    dataKeys: string[];
    dataKeyNames?: Record<string, string>;
    width?: string | number;
    height?: number;
    fillOpacity?: number;
    strokeWidth?: number;
    showGrid?: boolean;
    showDots?: boolean;
    showTooltip?: boolean;
    showLegend?: boolean;
    legendPosition?: 'top' | 'bottom';
    colors?: string[];
    animate?: boolean;
    animationDuration?: number;
    tooltipFormatter?: (value: any) => string;
    className?: string;
    ariaLabel?: string;
}
