/**
 * RadialBarChart Basic Demo
 */
import React from 'react';
import { RadialBarChart, ChartProvider } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { RadialBarChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { name: 'Sales', value: 85 },
    { name: 'Marketing', value: 72 },
    { name: 'Support', value: 65 },
    { name: 'Development', value: 90 },
    { name: 'Design', value: 78 },
];

<ChartProvider>
  <RadialBarChart
    data={data}
    maxValue={100}
    size={320}
  />
</ChartProvider>`;

// All values out of 100 for clear percentage visualization
const data = [
    { name: 'Sales', value: 85 },
    { name: 'Marketing', value: 72 },
    { name: 'Support', value: 65 },
    { name: 'Development', value: 90 },
    { name: 'Design', value: 78 },
];

const RadialBarChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Radial Bar Chart" description="Circular bars showing percentage completion">
        <ChartProvider>
            <RadialBarChart
                data={data}
                maxValue={100}
                size={320}
            />
        </ChartProvider>
    </DemoCard>
);

export default RadialBarChartBasicDemo;
