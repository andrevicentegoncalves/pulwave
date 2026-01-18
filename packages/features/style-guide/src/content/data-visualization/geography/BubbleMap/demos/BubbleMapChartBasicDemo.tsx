import React from 'react';
import { BubbleMapChart } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const data = [
    { country: 'USA', value: 1000 },
    { country: 'CHN', value: 800 },
    { country: 'IND', value: 750 },
    { country: 'BRA', value: 400 },
    { country: 'AUS', value: 300 },
    { country: 'GBR', value: 200 },
];

export const BubbleMapChartBasicDemo = () => {
    return (
        <DemoCard title="Bubble Map Chart" description="World map with bubbles sized by value at geographic locations.">
            <BubbleMapChart
                data={data}
                valueKey="value"
                countryKey="country"
                width={700}
                height={400}
            />
        </DemoCard>
    );
};

