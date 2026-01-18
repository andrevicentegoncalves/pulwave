/**
 * DualAxisChart Basic Demo
 */
import React from 'react';
import { DualAxisChart } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { DualAxisChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { name: 'Jan', uv: 4000, pv: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398 },
    { name: 'Mar', uv: 2000, pv: 9800 },
];

<ChartProvider>
  <DualAxisChart
    data={data}
    xKey="name"
    barKey="uv"
    lineKey="pv"
    height={300}
  />
</ChartProvider>`;

const data = [
    { name: 'Jan', uv: 4000, pv: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398 },
    { name: 'Mar', uv: 2000, pv: 9800 },
];

const DualAxisChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Dual Axis Chart" description="Different scales">
        <DualAxisChart
            data={data}
            xKey="name"
            barKey="uv"
            lineKey="pv"
            height={300}
        />
    </DemoCard>
);

export default DualAxisChartBasicDemo;
