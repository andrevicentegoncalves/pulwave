/**
 * Sparkline Basic Demo
 */
import React from 'react';
import { SparklineChart as Sparkline } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { SparklineChart as Sparkline, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [10, 15, 12, 18, 14, 20, 16];

<ChartProvider>
  <Sparkline data={data} />
</ChartProvider>`;

const data = [10, 15, 12, 18, 14, 20, 16];

const SparklineBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Sparkline" description="Inline trend">
        <div style={{ width: '150px', height: '40px' }}>
            <Sparkline data={data} />
        </div>
    </DemoCard>
);

export default SparklineBasicDemo;
