import React from 'react';
import { NestedPieChart, ChartProvider, chartTheme } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const data = {
    inner: [
        { name: 'A', value: 100, color: chartTheme.categorical[1] },
        { name: 'B', value: 200, color: chartTheme.categorical[2] },
        { name: 'C', value: 150, color: chartTheme.categorical[3] },
        { name: 'D', value: 80, color: chartTheme.categorical[4] },
    ],
    outer: [
        { name: 'A', value: 100, color: chartTheme.categorical[1] },
        { name: 'B', value: 200, color: chartTheme.categorical[2] },
        { name: 'C', value: 50, color: chartTheme.categorical[3] },
        { name: 'D', value: 100, color: chartTheme.categorical[4] },
    ],
};

const rings = [
    { label: 'Inner', data: data.inner },
    { label: 'Outer', data: data.outer }
];

export const NestedPieChartBasicDemo = () => {
    return (
        <DemoCard title="Nested Pie Chart" description="Concentric rings showing hierarchical or related data.">
            <ChartProvider>
                <NestedPieChart
                    rings={rings}
                    size={350}
                    innerRadius={50}
                />
            </ChartProvider>
        </DemoCard>
    );
};

