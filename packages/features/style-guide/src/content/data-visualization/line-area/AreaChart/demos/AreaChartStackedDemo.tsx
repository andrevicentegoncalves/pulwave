/**
 * AreaChart Stacked Demo
 * Demonstrates stacked area layout
 */
import React from 'react';
import { AreaChart } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { AreaChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { month: 'Jan', sales: 100, revenue: 80, profit: 40 },
    { month: 'Feb', sales: 120, revenue: 95, profit: 50 },
    { month: 'Mar', sales: 140, revenue: 110, profit: 60 },
    { month: 'Apr', sales: 130, revenue: 100, profit: 55 },
    { month: 'May', sales: 160, revenue: 130, profit: 70 },
    { month: 'Jun', sales: 180, revenue: 150, profit: 85 },
];

<ChartProvider>
  <AreaChart
    data={data}
    xKey="month"
    yKeys={['sales', 'revenue', 'profit']}
    stacking="normal"
    height={300}
  />
</ChartProvider>`;

const data = [
    { month: 'Jan', sales: 100, revenue: 80, profit: 40 },
    { month: 'Feb', sales: 120, revenue: 95, profit: 50 },
    { month: 'Mar', sales: 140, revenue: 110, profit: 60 },
    { month: 'Apr', sales: 130, revenue: 100, profit: 55 },
    { month: 'May', sales: 160, revenue: 130, profit: 70 },
    { month: 'Jun', sales: 180, revenue: 150, profit: 85 },
];

const AreaChartStackedDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Stacked Area Chart" description="Areas stacked on top of each other">
        <AreaChart
            data={data}
            xKey="month"
            yKeys={['sales', 'revenue', 'profit']}
            yKeyNames={{ sales: 'Sales', revenue: 'Revenue', profit: 'Profit' }}
            stacking="normal"
            height={300}
        />
    </DemoCard>
);

export default AreaChartStackedDemo;
