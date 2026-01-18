import React from 'react';
import { SplineLineChart } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { SplineLineChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { month: 'Jan', sales: 100, revenue: 80 },
    { month: 'Feb', sales: 150, revenue: 120 },
    { month: 'Mar', sales: 180, revenue: 140 },
    { month: 'Apr', sales: 220, revenue: 190 },
    { month: 'May', sales: 280, revenue: 230 },
    { month: 'Jun', sales: 260, revenue: 210 },
];

const series = [
    { key: 'sales', name: 'Sales', color: '#3B82F6' },
    { key: 'revenue', name: 'Revenue', color: '#10B981' },
];

<ChartProvider>
  <SplineLineChart
    data={data}
    xKey="month"
    series={series}
  />
</ChartProvider>`;

const data = [
    { month: 'Jan', sales: 100, revenue: 80 },
    { month: 'Feb', sales: 150, revenue: 120 },
    { month: 'Mar', sales: 180, revenue: 140 },
    { month: 'Apr', sales: 220, revenue: 190 },
    { month: 'May', sales: 280, revenue: 230 },
    { month: 'Jun', sales: 260, revenue: 210 },
];

const series = [
    { key: 'sales', name: 'Sales', color: '#3B82F6' },
    { key: 'revenue', name: 'Revenue', color: '#10B981' },
];

const SplineLineChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Basic Usage"
        description="Spline line chart showing smooth trends for Sales and Revenue."
    >
        <div style={{ height: 400, width: '100%' }}>
            <SplineLineChart
                data={data}
                xKey="month"
                series={series}
            />
        </div>
    </DemoCard>
);

export default SplineLineChartBasicDemo;
