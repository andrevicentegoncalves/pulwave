/**
 * Histogram Basic Demo
 */
import React from 'react';
import { HistogramChart as Histogram } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { HistogramChart as Histogram, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [65, 72, 81, 78, 69, 85, 90, 88, 75, 70, 68, 82, 79, 76, 73, 71, 84, 77, 80, 86];

<ChartProvider>
  <Histogram
    data={data}
    bins={8}
    height={300}
  />
</ChartProvider>`;

// Raw number array - histogram auto-calculates bin distribution
const data = [65, 72, 81, 78, 69, 85, 90, 88, 75, 70, 68, 82, 79, 76, 73, 71, 84, 77, 80, 86];

const HistogramBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Histogram" description="Frequency distribution with automatic binning">
        <Histogram
            data={data}
            bins={8}
            height={300}
        />
    </DemoCard>
);

export default HistogramBasicDemo;
