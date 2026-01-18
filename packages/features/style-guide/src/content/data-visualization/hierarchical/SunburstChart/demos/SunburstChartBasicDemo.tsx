/**
 * SunburstChart Basic Demo
 */
import React from 'react';
import { SunburstChart } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { SunburstChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = {
    name: 'root',
    children: [
        { name: 'Group A', value: 100 },
        {
            name: 'Group B',
            children: [
                { name: 'Sub B1', value: 100 },
                { name: 'Sub B2', value: 200 }
            ]
        },
    ]
};

<ChartProvider>
  <SunburstChart data={data} />
</ChartProvider>`;

const data = {
    name: 'root',
    children: [
        { name: 'Group A', value: 100 },
        {
            name: 'Group B',
            children: [
                { name: 'Sub B1', value: 100 },
                { name: 'Sub B2', value: 200 }
            ]
        },
    ]
};

const SunburstChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Sunburst Chart" description="Hierarchical radial">
        <SunburstChart
            data={data}
        />
    </DemoCard>
);

export default SunburstChartBasicDemo;
