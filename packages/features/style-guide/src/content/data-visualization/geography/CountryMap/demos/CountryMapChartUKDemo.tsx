/**
 * CountryMapChart UK Demo
 */
import React from 'react';
import { CountryMapChart } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { CountryMapChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { region: 'Greater London', value: 95 },
    { region: 'Greater Manchester', value: 72 },
    { region: 'West Midlands', value: 65 },
    { region: 'Edinburgh', value: 70 },
];

<ChartProvider>
  <CountryMapChart
    country="uk"
    data={data}
    colorScale="purple"
    title="UK Sales by County"
  />
</ChartProvider>`;

// UK regions/counties
const data = [
    { region: 'Greater London', value: 95 },
    { region: 'Greater Manchester', value: 72 },
    { region: 'West Midlands', value: 65 },
    { region: 'West Yorkshire', value: 58 },
    { region: 'Edinburgh', value: 70 },
    { region: 'Glasgow', value: 62 },
    { region: 'Kent', value: 48 },
    { region: 'Essex', value: 52 },
    { region: 'Hampshire', value: 45 },
    { region: 'Surrey', value: 55 },
    { region: 'Merseyside', value: 42 },
    { region: 'South Yorkshire', value: 38 },
    { region: 'Cardiff', value: 50 },
    { region: 'Belfast', value: 35 },
];

const CountryMapChartUKDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="United Kingdom" description="UK counties and regions with data.">
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <CountryMapChart
                country="uk"
                data={data}
                colorScale="purple"
                title="UK Sales by Region"
                width={400}
                height={550}
            />
        </div>
    </DemoCard>
);

export default CountryMapChartUKDemo;
