/**
 * WaterfallChart Basic Demo
 */
import React from 'react';
import { WaterfallChart } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { WaterfallChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { name: 'Start', value: 100 },
    { name: 'Revenue', delta: 50 },
    { name: 'Costs', delta: -30 },
    { name: 'Tax', delta: -20 },
    { name: 'End', total: true },
];

<ChartProvider>
  <WaterfallChart
    data={data}
    height={300}
  />
</ChartProvider>`;

// Waterfall format: 'value' for starting point, 'delta' for changes, 'total' flag for cumulative end
const data = [
    { name: 'Start', value: 100 },
    { name: 'Revenue', delta: 50 },
    { name: 'Costs', delta: -30 },
    { name: 'Tax', delta: -20 },
    { name: 'End', total: true },
];

const WaterfallChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Waterfall Chart" description="Running total with positive/negative changes">
        <div style={{ width: '100%', minHeight: 300 }}>
            <WaterfallChart
                data={data}
                height={300}
            />
        </div>
    </DemoCard>
);

export default WaterfallChartBasicDemo;
