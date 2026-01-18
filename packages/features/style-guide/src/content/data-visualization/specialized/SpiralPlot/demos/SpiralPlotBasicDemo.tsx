/**
 * SpiralPlot Basic Demo
 */
import React from 'react';
import { SpiralPlot } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { SpiralPlot, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { label: 'Jan', value: 100 },
    { label: 'Feb', value: 120 },
    { label: 'Mar', value: 90 },
    { label: 'Apr', value: 140 },
    { label: 'May', value: 160 },
    { label: 'Jun', value: 130 },
    { label: 'Jul', value: 110 },
    { label: 'Aug', value: 145 },
    { label: 'Sep', value: 125 },
    { label: 'Oct', value: 135 },
    { label: 'Nov', value: 150 },
    { label: 'Dec', value: 165 },
    { label: 'Jan', value: 105 },
    { label: 'Feb', value: 115 },
    { label: 'Mar', value: 95 },
    { label: 'Apr', value: 138 },
    { label: 'May', value: 155 },
    { label: 'Jun', value: 142 },
];

<ChartProvider>
  <SpiralPlot data={data} />
</ChartProvider>`;

const data = [
    { label: 'Jan', value: 100 },
    { label: 'Feb', value: 120 },
    { label: 'Mar', value: 90 },
    { label: 'Apr', value: 140 },
    { label: 'May', value: 160 },
    { label: 'Jun', value: 130 },
    { label: 'Jul', value: 110 },
    { label: 'Aug', value: 145 },
    { label: 'Sep', value: 125 },
    { label: 'Oct', value: 135 },
    { label: 'Nov', value: 150 },
    { label: 'Dec', value: 165 },
    { label: 'Jan', value: 105 },
    { label: 'Feb', value: 115 },
    { label: 'Mar', value: 95 },
    { label: 'Apr', value: 138 },
    { label: 'May', value: 155 },
    { label: 'Jun', value: 142 },
];

const SpiralPlotBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Spiral Plot" description="Time series on spiral">
        <SpiralPlot
            data={data}
        />
    </DemoCard>
);

export default SpiralPlotBasicDemo;
