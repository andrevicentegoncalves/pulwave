import React from 'react';
import { WaffleChart } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { WaffleChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { name: 'Completed', value: 65, color: '#10B981' },
    { name: 'In Progress', value: 25, color: '#F59E0B' },
    { name: 'Pending', value: 10, color: '#EF4444' },
];

<ChartProvider>
  <WaffleChart
    data={data}
    total={100}
    rows={10}
    cols={10}
  />
</ChartProvider>`;

const data = [
    { name: 'Completed', value: 65, color: '#10B981' },
    { name: 'In Progress', value: 25, color: '#F59E0B' },
    { name: 'Pending', value: 10, color: '#EF4444' },
];

const WaffleChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Basic Usage"
        description="Waffle chart showing project status."
    >
        <div style={{ height: 400, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <WaffleChart
                data={data}
                total={100}
                rows={10}
                cols={10}
            />
        </div>
    </DemoCard>
);

export default WaffleChartBasicDemo;
