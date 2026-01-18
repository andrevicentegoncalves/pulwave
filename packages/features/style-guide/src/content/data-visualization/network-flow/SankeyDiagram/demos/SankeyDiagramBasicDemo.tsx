/**
 * SankeyDiagram Basic Demo
 */
import React from 'react';
import { SankeyDiagram } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { SankeyDiagram, ChartProvider } from '@pulwave/ui/data-visualization';

const nodes = [
    { id: 'source1', name: 'Source A' },
    { id: 'source2', name: 'Source B' },
    { id: 'mid', name: 'Processing' },
    { id: 'target1', name: 'Output X' },
    { id: 'target2', name: 'Output Y' },
];

const links = [
    { source: 'source1', target: 'mid', value: 50 },
    { source: 'source2', target: 'mid', value: 30 },
    { source: 'mid', target: 'target1', value: 45 },
    { source: 'mid', target: 'target2', value: 35 },
];

<ChartProvider>
  <SankeyDiagram
    nodes={nodes}
    links={links}
    height={350}
  />
</ChartProvider>`;

// Sankey expects separate nodes and links arrays with string id/source/target
const nodes = [
    { id: 'source1', name: 'Source A' },
    { id: 'source2', name: 'Source B' },
    { id: 'mid', name: 'Processing' },
    { id: 'target1', name: 'Output X' },
    { id: 'target2', name: 'Output Y' },
];

const links = [
    { source: 'source1', target: 'mid', value: 50 },
    { source: 'source2', target: 'mid', value: 30 },
    { source: 'mid', target: 'target1', value: 45 },
    { source: 'mid', target: 'target2', value: 35 },
];

const SankeyDiagramBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Sankey Diagram" description="Flow between nodes">
        <SankeyDiagram
            nodes={nodes}
            links={links}
            height={350}
        />
    </DemoCard>
);

export default SankeyDiagramBasicDemo;
