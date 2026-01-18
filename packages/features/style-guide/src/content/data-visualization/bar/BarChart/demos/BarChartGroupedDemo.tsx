/**
 * BarChart Grouped Demo
 * Demonstrates grouped bar layout with multiple series
 */
import React from 'react';
import { BarChart, ChartProvider } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { BarChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { category: 'Q1', series1: 400, series2: 240, series3: 180 },
    { category: 'Q2', series1: 300, series2: 380, series3: 220 },
    { category: 'Q3', series1: 450, series2: 320, series3: 290 },
    { category: 'Q4', series1: 520, series2: 410, series3: 340 },
];

<ChartProvider>
  <BarChart
    data={data}
    xKey="category"
    yKeys={['series1', 'series2', 'series3']}
    grouping="grouped"
    height={300}
  />
</ChartProvider>`;

const data = [
    { category: 'Q1', series1: 400, series2: 240, series3: 180 },
    { category: 'Q2', series1: 300, series2: 380, series3: 220 },
    { category: 'Q3', series1: 450, series2: 320, series3: 290 },
    { category: 'Q4', series1: 520, series2: 410, series3: 340 },
];

const BarChartGroupedDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Grouped Bar Chart" description="Multiple series side by side">
        <ChartProvider>
            <BarChart
                data={data}
                xKey="category"
                yKeys={['series1', 'series2', 'series3']}
                yKeyNames={{ series1: 'Product A', series2: 'Product B', series3: 'Product C' }}
                grouping="grouped"
                height={300}
            />
        </ChartProvider>
    </DemoCard>
);

export default BarChartGroupedDemo;
