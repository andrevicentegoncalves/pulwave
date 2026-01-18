import React from 'react';
import { ParliamentChart, chartTheme } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { ParliamentChart, ChartProvider, chartTheme } from '@pulwave/ui/data-visualization';

const data = [
    { name: 'Party A', seats: 150, color: chartTheme.status.error },
    { name: 'Party B', seats: 100, color: chartTheme.status.success },
    { name: 'Party C', seats: 50, color: chartTheme.status.active },
    { name: 'Independent', seats: 20, color: chartTheme.status.neutral },
];

<ChartProvider>
  <ParliamentChart
    data={data}
    totalSeats={320}
    width={500}
  />
</ChartProvider>`;

const data = [
    { name: 'Party A', seats: 150, color: chartTheme.status.error },
    { name: 'Party B', seats: 100, color: chartTheme.status.success },
    { name: 'Party C', seats: 50, color: chartTheme.status.active },
    { name: 'Independent', seats: 20, color: chartTheme.status.neutral },
];

const ParliamentChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Basic Usage"
        description="Parliament chart showing distribution of 320 seats."
    >
        <div style={{ height: 300, width: '100%' }}>
            <ParliamentChart
                data={data}
                totalSeats={320}
                width={500}
            />
        </div>
    </DemoCard>
);

export default ParliamentChartBasicDemo;
