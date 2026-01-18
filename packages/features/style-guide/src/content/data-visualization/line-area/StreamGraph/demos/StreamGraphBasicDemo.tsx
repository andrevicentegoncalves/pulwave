import React from 'react';
import { StreamGraph } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { StreamGraph, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { date: 'Jan', rock: 30, pop: 20, jazz: 15 },
    { date: 'Feb', rock: 35, pop: 25, jazz: 12 },
    { date: 'Mar', rock: 40, pop: 30, jazz: 18 },
    { date: 'Apr', rock: 30, pop: 45, jazz: 25 },
    { date: 'May', rock: 25, pop: 50, jazz: 30 },
    { date: 'Jun', rock: 20, pop: 40, jazz: 35 },
];

<ChartProvider>
  <StreamGraph
    data={data}
    xKey="date"
    series={['rock', 'pop', 'jazz']}
  />
</ChartProvider>`;

const data = [
    { date: 'Jan', rock: 30, pop: 20, jazz: 15 },
    { date: 'Feb', rock: 35, pop: 25, jazz: 12 },
    { date: 'Mar', rock: 40, pop: 30, jazz: 18 },
    { date: 'Apr', rock: 30, pop: 45, jazz: 25 },
    { date: 'May', rock: 25, pop: 50, jazz: 30 },
    { date: 'Jun', rock: 20, pop: 40, jazz: 35 },
];

const StreamGraphBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Basic Usage"
        description="Stream graph showing music genre popularity over time."
    >
        <div style={{ height: 400, width: '100%' }}>
            <StreamGraph
                data={data}
                xKey="date"
                series={['rock', 'pop', 'jazz']}
            />
        </div>
    </DemoCard>
);

export default StreamGraphBasicDemo;
