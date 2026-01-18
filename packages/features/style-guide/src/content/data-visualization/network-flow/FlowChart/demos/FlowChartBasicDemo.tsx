/**
 * FlowChart Basic Demo
 */
import React from 'react';
import { FlowChart } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { FlowChart, ChartProvider } from '@pulwave/ui/data-visualization';

const nodes = [
    { id: '1', label: 'Start' },
    { id: '2', label: 'Step 1' },
    { id: '3', label: 'End' },
];

const edges = [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
];

<ChartProvider>
  <FlowChart
    nodes={nodes}
    edges={edges}
  />
</ChartProvider>`;

const data = {
    nodes: [
        { id: '1', label: 'Start' },
        { id: '2', label: 'Step 1' },
        { id: '3', label: 'End' },
    ],
    edges: [
        { source: '1', target: '2' },
        { source: '2', target: '3' },
    ]
};

const FlowChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Flow Chart" description="Process diagram">
        <FlowChart
            nodes={data.nodes}
            edges={data.edges.map(e => ({ from: e.source, to: e.target }))}
        />
    </DemoCard>
);

export default FlowChartBasicDemo;
