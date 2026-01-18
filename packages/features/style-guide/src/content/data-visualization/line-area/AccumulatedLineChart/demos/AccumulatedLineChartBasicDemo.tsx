/**
 * AccumulatedLineChart Basic Demo
 */
import React from 'react';
import { AccumulatedLineChart } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { AccumulatedLineChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { month: 'Jan', sales: 100, returns: 20 },
    { month: 'Feb', sales: 150, returns: 35 },
    { month: 'Mar', sales: 200, returns: 25 },
    { month: 'Apr', sales: 180, returns: 30 },
    { month: 'May', sales: 220, returns: 40 },
    { month: 'Jun', sales: 250, returns: 35 },
];

<ChartProvider>
  <AccumulatedLineChart
    data={data}
    xKey="month"
    series={[
        { key: 'sales', name: 'Sales' },
        { key: 'returns', name: 'Returns' }
    ]}
    height={300}
  />
</ChartProvider>`;

const data = [
    { month: 'Jan', sales: 100, returns: 20 },
    { month: 'Feb', sales: 150, returns: 35 },
    { month: 'Mar', sales: 200, returns: 25 },
    { month: 'Apr', sales: 180, returns: 30 },
    { month: 'May', sales: 220, returns: 40 },
    { month: 'Jun', sales: 250, returns: 35 },
    { month: 'Jul', sales: 280, returns: 45 },
    { month: 'Aug', sales: 310, returns: 50 },
    { month: 'Sep', sales: 290, returns: 55 },
    { month: 'Oct', sales: 340, returns: 60 },
    { month: 'Nov', sales: 380, returns: 70 },
    { month: 'Dec', sales: 420, returns: 65 },
];

const AccumulatedLineChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Accumulated Line Chart" description="Cumulative growth over time">
        <AccumulatedLineChart
            data={data}
            xKey="month"
            series={[
                { key: 'sales', name: 'Sales' },
                { key: 'returns', name: 'Returns' }
            ]}
            height={300}
        />
    </DemoCard>
);

export default AccumulatedLineChartBasicDemo;
