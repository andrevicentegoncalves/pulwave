/**
 * BubblePackChart Basic Demo
 */
import React from 'react';
import { BubblePackChart } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { BubblePackChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 250 },
    { name: 'Group D', value: 200 },
    { name: 'Group E', value: 150 },
];

<ChartProvider>
  <BubblePackChart
    data={data}
    height={350}
  />
</ChartProvider>`;

// Flat array with name and value
const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 250 },
    { name: 'Group D', value: 200 },
    { name: 'Group E', value: 150 },
];

const BubblePackChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Bubble Pack Chart" description="Packed circles showing category values">
        <BubblePackChart
            data={data}
            height={350}
        />
    </DemoCard>
);

export default BubblePackChartBasicDemo;
