/**
 * BarChart Basic Demo
 */
import React from 'react';
import { BarChart, ChartProvider } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { BarChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { name: 'A', value: 400 },
    { name: 'B', value: 300 },
    { name: 'C', value: 550 },
    { name: 'D', value: 200 },
    { name: 'E', value: 480 },
    { name: 'F', value: 620 },
];

<ChartProvider>
  <BarChart
    data={data}
    xKey="name"
    yKeys={['value']}
    height={300}
  />
</ChartProvider>`;

const data = [
    { name: 'A', value: 400 },
    { name: 'B', value: 300 },
    { name: 'C', value: 550 },
    { name: 'D', value: 200 },
    { name: 'E', value: 480 },
    { name: 'F', value: 620 },
    { name: 'G', value: 380 },
    { name: 'H', value: 510 },
];

const BarChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Bar Chart" description="Categorical comparison">
        <ChartProvider>
            <BarChart
                data={data}
                xKey="name"
                yKeys={['value']}
                height={300}
            />
        </ChartProvider>
    </DemoCard>
);

export default BarChartBasicDemo;
