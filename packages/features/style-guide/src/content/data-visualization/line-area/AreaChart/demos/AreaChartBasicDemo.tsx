/**
 * AreaChart Basic Demo
 */
import React from 'react';
import { AreaChart } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { AreaChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { name: 'Jan', uv: 4000, pv: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398 },
    { name: 'Mar', uv: 2000, pv: 9800 },
    { name: 'Apr', uv: 2780, pv: 3908 },
    { name: 'May', uv: 1890, pv: 4800 },
    { name: 'Jun', uv: 2390, pv: 3800 },
];

<ChartProvider>
  <AreaChart
    data={data}
    xKey="name"
    yKeys={['uv', 'pv']}
    height={300}
  />
</ChartProvider>`;

const data = [
    { name: 'Jan', uv: 4000, pv: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398 },
    { name: 'Mar', uv: 2000, pv: 9800 },
    { name: 'Apr', uv: 2780, pv: 3908 },
    { name: 'May', uv: 1890, pv: 4800 },
    { name: 'Jun', uv: 2390, pv: 3800 },
    { name: 'Jul', uv: 3490, pv: 4300 },
    { name: 'Aug', uv: 4200, pv: 4100 },
    { name: 'Sep', uv: 3800, pv: 3500 },
    { name: 'Oct', uv: 4100, pv: 4200 },
];

const AreaChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Area Chart" description="Volume trend">
        <AreaChart
            data={data}
            xKey="name"
            yKeys={['uv', 'pv']}
            height={300}
        />
    </DemoCard>
);

export default AreaChartBasicDemo;
