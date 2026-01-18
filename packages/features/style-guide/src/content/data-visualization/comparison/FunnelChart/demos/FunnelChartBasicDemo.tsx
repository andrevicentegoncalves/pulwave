/**
 * FunnelChart Basic Demo
 */
import React from 'react';
import { FunnelChart, chartTheme } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { FunnelChart, ChartProvider, chartTheme } from '@pulwave/ui/data-visualization';

const data = [
    { value: 100, name: 'Impressions', fill: chartTheme.categorical[0] },
    { value: 80, name: 'Clicks', fill: chartTheme.categorical[1] },
    { value: 50, name: 'Visits', fill: chartTheme.categorical[2] },
    { value: 35, name: 'Inquiries', fill: chartTheme.categorical[3] },
    { value: 10, name: 'Orders', fill: chartTheme.categorical[4] },
];

<ChartProvider>
  <FunnelChart
    data={data}
    height={300}
  />
</ChartProvider>`;

const data = [
    { value: 100, name: 'Impressions', fill: chartTheme.categorical[0] },
    { value: 80, name: 'Clicks', fill: chartTheme.categorical[1] },
    { value: 50, name: 'Visits', fill: chartTheme.categorical[2] },
    { value: 35, name: 'Inquiries', fill: chartTheme.categorical[3] },
    { value: 10, name: 'Orders', fill: chartTheme.categorical[4] },
];

const FunnelChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Funnel Chart" description="Conversion pipeline">
        <FunnelChart
            data={data}
            height={300}
        />
    </DemoCard>
);

export default FunnelChartBasicDemo;
