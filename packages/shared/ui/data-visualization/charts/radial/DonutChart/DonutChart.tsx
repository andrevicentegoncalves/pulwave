import React, { forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { PieChart } from '../PieChart/PieChart';
import { donutChartVariants, type DonutChartProps } from './types';
import './styles/_index.scss';

/**
 * DonutChart Component
 * A PieChart with a center hole for displaying a central KPI.
 * 
 * @example
 * <DonutChart 
 *   data={[...]}
 *   centerLabel={<div><strong>$45K</strong><br/>Total</div>}
 * />
 */
export const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>(({
    data = [],
    innerRadius = '60%',
    centerLabel,
    centerValue,
    centerSubtext,
    className,
    size,
    ariaLabel,
    ...restProps
}, ref) => {
    // Default center content if value/subtext provided
    const defaultCenterContent = (centerValue || centerSubtext) && (
        <div className="chart--donut-wrapper__center-content">
            {centerValue && <div className="chart--donut-wrapper__value">{centerValue}</div>}
            {centerSubtext && <div className="chart--donut-wrapper__subtext">{centerSubtext}</div>}
        </div>
    );

    const content = centerLabel || defaultCenterContent;

    return (
        <div
            ref={ref}
            className={cn(donutChartVariants({ size }), className)}
            role="img"
            aria-label={ariaLabel || 'Donut chart'}
        >
            <PieChart
                data={data}
                innerRadius={innerRadius}
                {...restProps}
            />
            {content && (
                <div className="chart--donut-wrapper__center-container">
                    {content}
                </div>
            )}
        </div>
    );
});

DonutChart.displayName = 'DonutChart';

export default DonutChart;
