/**
 * GaugeChart Basic Demo
 */
import React from 'react';
import { GaugeChart, ChartProvider } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { GaugeChart, ChartProvider } from '@pulwave/ui/data-visualization';

<ChartProvider>
  <GaugeChart
    value={75}
    min={0}
    max={100}
    height={200}
  />
</ChartProvider>`;

const GaugeChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Gauge Chart" description="Single KPI">
        <ChartProvider>
            <GaugeChart
                value={75}
                min={0}
                max={100}
                height={200}
            />
        </ChartProvider>
    </DemoCard>
);

export default GaugeChartBasicDemo;
