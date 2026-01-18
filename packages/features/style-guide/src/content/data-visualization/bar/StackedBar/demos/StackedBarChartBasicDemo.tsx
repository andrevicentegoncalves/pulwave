import React from 'react';
import { StackedBarChart, chartTheme } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const data = [
    { month: 'Jan', sales: 1200, marketing: 400, overhead: 200 },
    { month: 'Feb', sales: 1350, marketing: 450, overhead: 220 },
    { month: 'Mar', sales: 1100, marketing: 350, overhead: 200 },
    { month: 'Apr', sales: 1600, marketing: 600, overhead: 250 },
];

export const StackedBarChartBasicDemo = () => {
    return (
        <DemoCard title="Stacked Bar Chart" description="Visualize composition across categories.">
            <StackedBarChart
                data={data}
                categoryKey="month"
                series={[
                    { key: 'sales', name: 'Sales', color: chartTheme.categorical[0] },
                    { key: 'marketing', name: 'Marketing', color: chartTheme.categorical[1] },
                    { key: 'overhead', name: 'Overhead', color: chartTheme.categorical[8] },
                ]}
                valueFormatter={(v) => `$${v}`}
            />
        </DemoCard>
    );
};

