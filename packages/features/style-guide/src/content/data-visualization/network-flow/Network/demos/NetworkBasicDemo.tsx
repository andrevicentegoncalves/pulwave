/**
 * Network Basic Demo
 */
import React from 'react';
import { NetworkDiagram as Network } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { NetworkDiagram as Network, ChartProvider } from '@pulwave/ui/data-visualization';

const nodes = [
    { id: 'node1', label: 'Node 1', group: 1 },
    { id: 'node2', label: 'Node 2', group: 1 },
    { id: 'node3', label: 'Node 3', group: 2 },
    { id: 'node4', label: 'Node 4', group: 2 },
];

const links = [
    { source: 'node1', target: 'node2' },
    { source: 'node2', target: 'node3' },
    { source: 'node3', target: 'node4' },
    { source: 'node4', target: 'node1' },
];

<ChartProvider>
  <Network
    nodes={nodes}
    links={links}
    height={350}
  />
</ChartProvider>`;

// NetworkDiagram expects separate nodes and links arrays
const nodes = [
    { id: 'node1', label: 'Node 1', group: 1 },
    { id: 'node2', label: 'Node 2', group: 1 },
    { id: 'node3', label: 'Node 3', group: 2 },
    { id: 'node4', label: 'Node 4', group: 2 },
];

const links = [
    { source: 'node1', target: 'node2' },
    { source: 'node2', target: 'node3' },
    { source: 'node3', target: 'node4' },
    { source: 'node4', target: 'node1' },
];

const NetworkBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Network Diagram" description="Force-directed graph">
        <Network
            nodes={nodes}
            links={links}
            height={350}
        />
    </DemoCard>
);

export default NetworkBasicDemo;
