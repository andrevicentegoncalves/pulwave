import React from 'react';
import { DivergingBarChart } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const data = [
    { category: 'Q1', value: 2400 },
    { category: 'Q2', value: 1398 },
    { category: 'Q3', value: -4800 }, // Negative value
    { category: 'Q4', value: 3908 },
    { category: 'Q5', value: -2800 },
    { category: 'Q6', value: -1200 },
];

export const DivergingBarChartBasicDemo = () => {
    return (
        <DemoCard title="Diverging Bar Chart" description="Visualize positive and negative values from a baseline.">
            <DivergingBarChart
                data={data}
                categoryKey="category"
                dataKey="value"
                valueFormatter={(v) => `$${v}`}
                layout="horizontal"
            />
        </DemoCard>
    );
};

