/**
 * Heatmap Basic Demo
 */
import React from 'react';
import { HeatmapChart as Heatmap } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Heatmap, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { row: 'Mon', col: '9am', value: 5 },
    { row: 'Mon', col: '12pm', value: 20 },
    { row: 'Mon', col: '3pm', value: 35 },
    { row: 'Tue', col: '9am', value: 15 },
    { row: 'Tue', col: '12pm', value: 40 },
    { row: 'Tue', col: '3pm', value: 25 },
    { row: 'Wed', col: '9am', value: 10 },
    { row: 'Wed', col: '12pm', value: 30 },
    { row: 'Wed', col: '3pm', value: 45 },
];

const xLabels = ['9am', '12pm', '3pm'];
const yLabels = ['Mon', 'Tue', 'Wed'];

<ChartProvider>
  <Heatmap
    data={data}
    xLabels={xLabels}
    yLabels={yLabels}
    height={200}
  />
</ChartProvider>`;

// Heatmap requires xLabels, yLabels, and data with row/col/value keys
const data = [
    { row: 'Mon', col: '9am', value: 5 },
    { row: 'Mon', col: '12pm', value: 20 },
    { row: 'Mon', col: '3pm', value: 35 },
    { row: 'Tue', col: '9am', value: 15 },
    { row: 'Tue', col: '12pm', value: 40 },
    { row: 'Tue', col: '3pm', value: 25 },
    { row: 'Wed', col: '9am', value: 10 },
    { row: 'Wed', col: '12pm', value: 30 },
    { row: 'Wed', col: '3pm', value: 45 },
];

const xLabels = ['9am', '12pm', '3pm'];
const yLabels = ['Mon', 'Tue', 'Wed'];

const HeatmapBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Heatmap" description="Matrix data as colored cells">
        <Heatmap
            data={data}
            xLabels={xLabels}
            yLabels={yLabels}
            height={200}
        />
    </DemoCard>
);

export default HeatmapBasicDemo;
