import React from 'react';
import { WorldMapChart } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const data = [
    { country: 'USA', value: 50 },
    { country: 'CAN', value: 40 },
    { country: 'BRA', value: 30 },
    { country: 'RUS', value: 20 },
    { country: 'AUS', value: 60 },
];

export const WorldMapChartBasicDemo = () => {
    return (
        <DemoCard title="World Map Chart" description="Interactive world map.">
            <WorldMapChart
                data={data}
                countryKey="country"
                valueKey="value"
                mode="choropleth"
            />
        </DemoCard>
    );
};
