import React from 'react';
import { DonutChart, ChartProvider, chartTheme } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { DonutChart, ChartProvider, chartTheme } from '@pulwave/ui/data-visualization';

const data = [
    { name: 'Direct', value: 400, color: chartTheme.categorical[0] },
    { name: 'Social', value: 300, color: chartTheme.categorical[1] },
    { name: 'Referral', value: 300, color: chartTheme.categorical[2] },
    { name: 'Other', value: 200, color: chartTheme.categorical[3] },
];

<ChartProvider>
  <DonutChart
    data={data}
    centerValue="1.2k"
    centerSubtext="Total Visits"
    innerRadius="70%"
  />
</ChartProvider>`;

const data = [
    { name: 'Direct', value: 400, color: chartTheme.categorical[0] },
    { name: 'Social', value: 300, color: chartTheme.categorical[1] },
    { name: 'Referral', value: 300, color: chartTheme.categorical[2] },
    { name: 'Other', value: 200, color: chartTheme.categorical[3] },
];

export const DonutChartBasicDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Donut Chart" description="Pie chart with a central hole for displaying totals.">
            <ChartProvider>
                <DonutChart
                    data={data}
                    centerValue="1.2k"
                    centerSubtext="Total Visits"
                    innerRadius="70%"
                    height={300}
                    showLegend={true}
                />
            </ChartProvider>
        </DemoCard>
    );
};

