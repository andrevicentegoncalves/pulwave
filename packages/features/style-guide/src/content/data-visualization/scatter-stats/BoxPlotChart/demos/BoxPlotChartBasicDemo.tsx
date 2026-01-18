/**
 * BoxPlotChart Basic Demo
 */
import React from 'react';
import { BoxPlotChart } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { BoxPlotChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { x: 'Group A', min: 10, q1: 30, median: 50, q3: 70, max: 90 },
    { x: 'Group B', min: 20, q1: 40, median: 60, q3: 80, max: 100 },
];

<ChartProvider>
  <BoxPlotChart
    data={data}
    categoryKey="x"
    height={300}
  />
</ChartProvider>`;

const data = [
    { x: 'Group A', min: 10, q1: 30, median: 50, q3: 70, max: 90 },
    { x: 'Group B', min: 20, q1: 40, median: 60, q3: 80, max: 100 },
];

const BoxPlotChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Box Plot Chart" description="Distribution analysis">
        <BoxPlotChart
            data={data}
            categoryKey="x"
            height={300}
        />
    </DemoCard>
);

export default BoxPlotChartBasicDemo;
