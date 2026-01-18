import React from 'react';
import { RoseChart } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const data = [
    { name: 'North', value: 400 },
    { name: 'South', value: 300 },
    { name: 'East', value: 350 },
    { name: 'West', value: 200 },
    { name: 'North-East', value: 280 },
    { name: 'North-West', value: 320 },
];

export const RoseChartBasicDemo = () => {
    return (
        <DemoCard title="Rose Chart" description="Nightingale (Coxcomb) chart where radius varies by value.">
            <RoseChart
                data={data}
                size={400}
                showLabels={true}
            />
        </DemoCard>
    );
};
