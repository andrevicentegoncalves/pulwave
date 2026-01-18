/**
 * PerformanceGauge Basic Demo
 */
import React from 'react';
import { PerformanceGauge, ChartProvider } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { PerformanceGauge, ChartProvider } from '@pulwave/ui/data-visualization';

<ChartProvider>
  <PerformanceGauge
    value={75}
    min={0}
    max={100}
  />
</ChartProvider>`;

const PerformanceGaugeBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Performance Gauge" description="KPI metric visualization">
        <ChartProvider>
            <PerformanceGauge
                value={75}
                min={0}
                max={100}
            />
        </ChartProvider>
    </DemoCard>
);

export default PerformanceGaugeBasicDemo;
