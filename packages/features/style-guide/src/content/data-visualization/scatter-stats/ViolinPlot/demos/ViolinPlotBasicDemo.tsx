/**
 * ViolinPlot Basic Demo
 */
import React from 'react';
import { ViolinPlot } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { ViolinPlot, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { category: 'Group A', values: [1, 2, 3, 4, 5, 5, 5, 6, 7, 8, 9, 9, 10] },
    { category: 'Group B', values: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { category: 'Group C', values: [5, 6, 7, 7, 8, 8, 8, 9, 10, 11] },
];

<ChartProvider>
  <ViolinPlot
    data={data}
    height={400}
  />
</ChartProvider>`;

const data = [
    { category: 'Group A', values: [1, 2, 3, 4, 5, 5, 5, 6, 7, 8, 9, 9, 10] },
    { category: 'Group B', values: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { category: 'Group C', values: [5, 6, 7, 7, 8, 8, 8, 9, 10, 11] },
];

const ViolinPlotBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Violin Plot" description="Distribution density visualization">
        <ViolinPlot
            data={data}
            height={400}
        />
    </DemoCard>
);

export default ViolinPlotBasicDemo;
