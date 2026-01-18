/**
 * BarChart Horizontal Demo
 * Demonstrates horizontal bar layout
 */
import React from 'react';
import { BarChart, ChartProvider } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { BarChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { category: 'Engineering', value: 450 },
    { category: 'Marketing', value: 380 },
    { category: 'Sales', value: 520 },
    { category: 'Support', value: 290 },
    { category: 'Design', value: 340 },
];

<ChartProvider>
  <BarChart
    data={data}
    xKey="category"
    yKeys={['value']}
    layout="horizontal"
    height={400}
  />
</ChartProvider>`;

const data = [
    { category: 'Engineering', value: 450 },
    { category: 'Marketing', value: 380 },
    { category: 'Sales', value: 520 },
    { category: 'Support', value: 290 },
    { category: 'Design', value: 340 },
];

const BarChartHorizontalDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Horizontal Bar Chart" description="Bars extending horizontally">
        <ChartProvider>
            <BarChart
                data={data}
                xKey="category"
                yKeys={['value']}
                layout="horizontal"
                height={400}
            />
        </ChartProvider>
    </DemoCard>
);

export default BarChartHorizontalDemo;
