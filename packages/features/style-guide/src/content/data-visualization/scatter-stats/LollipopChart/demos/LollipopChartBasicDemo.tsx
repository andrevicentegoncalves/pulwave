import React from 'react';
import { LollipopChart } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { LollipopChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { category: 'A', value: 30 },
    { category: 'B', value: 80 },
    { category: 'C', value: 45 },
    { category: 'D', value: 60 },
    { category: 'E', value: 20 },
    { category: 'F', value: 90 },
    { category: 'G', value: 55 },
];

<ChartProvider>
  <LollipopChart
    data={data}
    categoryKey="category"
    dataKey="value"
  />
</ChartProvider>`;

const data = [
    { category: 'A', value: 30 },
    { category: 'B', value: 80 },
    { category: 'C', value: 45 },
    { category: 'D', value: 60 },
    { category: 'E', value: 20 },
    { category: 'F', value: 90 },
    { category: 'G', value: 55 },
];

const LollipopChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Basic Usage"
        description="Lollipop charts are useful for highlighting specific values while maintaining a clean look."
    >
        <div style={{ height: 400, width: '100%' }}>
            <LollipopChart
                data={data}
                categoryKey="category"
                dataKey="value"
            />
        </div>
    </DemoCard>
);

export default LollipopChartBasicDemo;
