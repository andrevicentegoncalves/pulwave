import React from 'react';
import { PyramidChart } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { PyramidChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { name: 'CEO', value: 1 },
    { name: 'VPs', value: 4 },
    { name: 'Directors', value: 12 },
    { name: 'Managers', value: 36 },
    { name: 'Staff', value: 150 },
];

<ChartProvider>
  <PyramidChart
    data={data}
    variant="pyramid"
  />
</ChartProvider>`;

const data = [
    { name: 'CEO', value: 1 },
    { name: 'VPs', value: 4 },
    { name: 'Directors', value: 12 },
    { name: 'Managers', value: 36 },
    { name: 'Staff', value: 150 },
];

const PyramidChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Basic Usage"
        description="Pyramid chart showing organizational hierarchy."
    >
        <div style={{ height: 400, width: '100%' }}>
            <PyramidChart
                data={data}
                variant="pyramid"
            />
        </div>
    </DemoCard>
);

export default PyramidChartBasicDemo;
