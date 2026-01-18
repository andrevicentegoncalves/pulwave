/**
 * ParallelCoordinatesPlot Basic Demo
 */
import React from 'react';
import { ParallelCoordinatesPlot } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { ParallelCoordinatesPlot, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { name: 'Item A', speed: 10, cost: 20, quality: 30, weight: 15 },
    { name: 'Item B', speed: 15, cost: 25, quality: 35, weight: 20 },
    { name: 'Item C', speed: 8, cost: 30, quality: 25, weight: 12 },
    { name: 'Item D', speed: 20, cost: 15, quality: 40, weight: 25 },
];

<ChartProvider>
  <ParallelCoordinatesPlot
    data={data}
    dimensions={['speed', 'cost', 'quality', 'weight']}
    height={400}
  />
</ChartProvider>`;

const data = [
    { name: 'Item A', speed: 10, cost: 20, quality: 30, weight: 15 },
    { name: 'Item B', speed: 15, cost: 25, quality: 35, weight: 20 },
    { name: 'Item C', speed: 8, cost: 30, quality: 25, weight: 12 },
    { name: 'Item D', speed: 20, cost: 15, quality: 40, weight: 25 },
];

const ParallelCoordinatesPlotBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Parallel Coordinates" description="Multi-dimensional comparison">
        <ParallelCoordinatesPlot
            data={data}
            dimensions={['speed', 'cost', 'quality', 'weight']}
            height={400}
        />
    </DemoCard>
);

export default ParallelCoordinatesPlotBasicDemo;
