/**
 * PieChart Basic Demo
 */
import React from 'react';
import { PieChart, ChartProvider } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { PieChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
];

<ChartProvider>
  <PieChart
    data={data}
    height={300}
  />
</ChartProvider>`;

const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
];

const PieChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Pie Chart" description="Proportional sectors">
        <ChartProvider>
            <PieChart
                data={data}
                height={300}
            />
        </ChartProvider>
    </DemoCard>
);

export default PieChartBasicDemo;
