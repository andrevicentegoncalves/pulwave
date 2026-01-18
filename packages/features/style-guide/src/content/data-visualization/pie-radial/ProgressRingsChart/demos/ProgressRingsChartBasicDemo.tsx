import React from 'react';
import { ProgressRingsChart, ChartProvider, chartTheme } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { ProgressRingsChart, ChartProvider, chartTheme } from '@pulwave/ui/data-visualization';

const data = [
    { name: 'Activity', value: 75, color: chartTheme.categorical[0] },
    { name: 'Exercise', value: 50, color: chartTheme.categorical[2] },
    { name: 'Stand', value: 90, color: chartTheme.categorical[3] },
];

<ChartProvider>
  <ProgressRingsChart
    data={data}
    centerValue="75%"
    centerLabel="Avg"
    size={250}
  />
</ChartProvider>`;

const data = [
    { name: 'Activity', value: 75, color: chartTheme.categorical[0] },
    { name: 'Exercise', value: 50, color: chartTheme.categorical[2] },
    { name: 'Stand', value: 90, color: chartTheme.categorical[3] },
];

const ProgressRingsChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Basic Usage"
        description="Activity rings showing daily progress."
    >
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            minHeight: '350px',
            width: '100%'
        }}>
            <ChartProvider>
                <ProgressRingsChart
                    data={data}
                    centerValue="75%"
                    centerLabel="Avg"
                    size={250}
                />
            </ChartProvider>
        </div>
    </DemoCard>
);

export default ProgressRingsChartBasicDemo;

