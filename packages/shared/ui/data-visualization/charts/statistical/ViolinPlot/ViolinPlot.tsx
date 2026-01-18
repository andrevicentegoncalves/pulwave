import React from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { violinPlotVariants, type ViolinPlotProps } from './types';
import './styles/_index.scss';

/**
 * ViolinPlot Component (Stub)
 * 
 * Displays distribution density.
 * Note: This is an architectural stub to allow style-guide demos to resolve.
 */
export const ViolinPlot = ({
    data = [],
    height = 400,
    layout = 'vertical',
    className,
}: ViolinPlotProps) => {
    return (
        <ChartShell
            className={cn(violinPlotVariants({ layout }), className)}
            height={height}
            width="100%"
        >
            <div className="chart--violin-plot__stub">
                Violin Plot Visualization
            </div>
        </ChartShell>
    );
};

export default ViolinPlot;
