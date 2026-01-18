import React from 'react';
import { RoseChart, ChartProvider } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { RoseChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { name: 'Jan', value: 300 },
    { name: 'Feb', value: 450 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 600 },
    { name: 'May', value: 400 },
    { name: 'Jun', value: 550 },
];

<ChartProvider>
  <RoseChart
    data={data}
    size={350}
  />
</ChartProvider>`;

const data = [
    { name: 'Jan', value: 300 },
    { name: 'Feb', value: 450 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 600 },
    { name: 'May', value: 400 },
    { name: 'Jun', value: 550 },
];

const RoseChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Basic Usage"
        description="Rose chart showing monthly data."
    >
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            minHeight: '450px',
            width: '100%'
        }}>
            <ChartProvider>
                <RoseChart
                    data={data}
                    size={350}
                />
            </ChartProvider>
        </div>
    </DemoCard>
);

export default RoseChartBasicDemo;
