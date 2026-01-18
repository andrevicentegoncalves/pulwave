import React from 'react';
import { NetworkDiagram } from '@pulwave/ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const nodes = [
    { id: '1', label: 'Server 1', group: 1 },
    { id: '2', label: 'Server 2', group: 1 },
    { id: '3', label: 'Database', group: 2 },
    { id: '4', label: 'Load Balancer', group: 3 },
    { id: '5', label: 'Client', group: 4 },
];

const links = [
    { source: '1', target: '3' },
    { source: '2', target: '3' },
    { source: '4', target: '1' },
    { source: '4', target: '2' },
    { source: '5', target: '4' },
];

export const NetworkDiagramBasicDemo = () => {
    return (
        <DemoCard title="Network Diagram" description="Displays a graph of nodes and their connections.">
            <NetworkDiagram
                nodes={nodes}
                links={links}
                height={500}
            />
        </DemoCard>
    );
};

