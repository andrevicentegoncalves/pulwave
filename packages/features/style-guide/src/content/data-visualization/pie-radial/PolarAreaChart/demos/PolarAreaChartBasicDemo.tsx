import React from 'react';
import { PolarAreaChart, ChartProvider, chartTheme } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const data = [
    { name: 'Speed', value: 120, color: chartTheme.categorical[6] },
    { name: 'Power', value: 98, color: chartTheme.categorical[1] },
    { name: 'Handling', value: 86, color: chartTheme.categorical[0] },
    { name: 'Range', value: 99, color: chartTheme.categorical[2] },
    { name: 'Safety', value: 85, color: chartTheme.categorical[3] },
];

export const PolarAreaChartBasicDemo = () => {
    return (
        <DemoCard title="Polar Area Chart" description="Similar to a pie chart, but every sector has the same angle and varying radii.">
            <ChartProvider>
                <PolarAreaChart
                    data={data}
                    size={350}
                />
            </ChartProvider>
        </DemoCard>
    );
};

