/**
 * LineChart Basic Demo
 */
import React from 'react';
import { LineChart, ChartProvider } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { LineChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 450 },
    { name: 'May', value: 520 },
    { name: 'Jun', value: 680 },
];

<ChartProvider>
  <LineChart
    data={data}
    xKey="name"
    yKeys={['value']}
    height={300}
  />
</ChartProvider>`;

const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 450 },
    { name: 'May', value: 520 },
    { name: 'Jun', value: 680 },
    { name: 'Jul', value: 590 },
    { name: 'Aug', value: 710 },
    { name: 'Sep', value: 620 },
    { name: 'Oct', value: 550 },
    { name: 'Nov', value: 480 },
    { name: 'Dec', value: 720 },
];

const LineChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Line Chart" description="Standard trend line">
        <ChartProvider>
            <LineChart
                data={data}
                xKey="name"
                yKeys={['value']}
                height={300}
            />
        </ChartProvider>
    </DemoCard>
);

export default LineChartBasicDemo;
