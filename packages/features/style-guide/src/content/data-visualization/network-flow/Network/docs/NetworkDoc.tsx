import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const NetworkDoc: ComponentDoc = {
    name: 'Network',
    status: 'stable',
    version: '1.1.0',
    description: 'Visualizes relationships between entities using nodes and links with force-directed or other layout algorithms. Ideal for social networks, knowledge graphs, and complex relationship exploration.',

    whenToUse: [
        'Social network analysis and community detection',
        'Knowledge graphs and concept relationships',
        'System dependencies or API relationships',
        'Exploring complex many-to-many relationships',
        'When network topology and clustering matter',
    ],

    whenNotToUse: [
        'Sequential processes - use Flow Chart',
        'Quantity/magnitude flows - use Sankey diagram',
        'Very large networks (>500 nodes) without aggregation',
        'Hierarchical relationships - use Tree or Org Chart',
        'When precise positioning matters - force layout is organic',
    ],

    usage: `
\`\`\`tsx
import { Network, ChartProvider } from '@pulwave/ui/data-visualization';

const socialNetwork = {
    nodes: [
        { id: 'alice', label: 'Alice', group: 'engineering' },
        { id: 'bob', label: 'Bob', group: 'engineering' },
        { id: 'carol', label: 'Carol', group: 'design' },
        { id: 'dave', label: 'Dave', group: 'design' },
        { id: 'eve', label: 'Eve', group: 'product' },
    ],
    links: [
        { source: 'alice', target: 'bob' },
        { source: 'alice', target: 'carol' },
        { source: 'bob', target: 'eve' },
        { source: 'carol', target: 'dave' },
        { source: 'dave', target: 'eve' },
    ]
};

<ChartProvider>
  <Network
    nodes={socialNetwork.nodes}
    links={socialNetwork.links}
    layout="force"
    groupColors={{
        engineering: '#3B82F6',
        design: '#10B981',
        product: '#F59E0B',
    }}
    nodeSize={20}
    linkDistance={100}
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A network chart displays nodes (entities) connected by links (relationships). Force-directed layout positions related nodes closer together, revealing clusters naturally.',
        overflowContent: 'For large networks, use aggregation (collapse clusters), filtering, or semantic zoom. Consider pagination or search for very large graphs.',
        internationalization: 'Node labels should be translatable. Layout algorithms are language-agnostic.',
    },

    formatting: {
        emphasis: 'Color nodes by group/category for cluster identification. Size nodes by importance (degree, centrality). Link thickness can represent relationship strength.',
        alignment: 'Force-directed layouts are organic and non-deterministic. Use radial layout for hierarchical aspects. Enable zoom and pan for exploration.',
    },

    props: [
        { name: 'nodes', type: "Array<{id, label, group?, size?}>", required: true, description: 'Array of node objects with id, label, optional group and size.' },
        { name: 'links', type: "Array<{source, target, weight?}>", required: true, description: 'Array of link objects connecting nodes by id.' },
        { name: 'layout', type: "'force' | 'radial' | 'circular'", default: "'force'", description: 'Layout algorithm for node positioning.' },
        { name: 'groupColors', type: "Record<string, string>", description: 'Map of group identifiers to colors.' },
        { name: 'nodeSize', type: "number", default: "15", description: 'Default node radius in pixels.' },
        { name: 'linkDistance', type: "number", default: "80", description: 'Target link distance for force layout.' },
        { name: 'onNodeClick', type: "(node: Node) => void", description: 'Callback when a node is clicked.' },
        { name: 'zoomable', type: "boolean", default: "true", description: 'Enable zoom and pan interactions.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the network (e.g., "Network diagram showing team collaboration relationships")' },
            { attribute: 'aria-describedby', usage: 'Links to relationship table' },
        ],
        screenReader: 'Screen readers announce each node with its label, group, and number of connections. Describe network statistics (node count, clusters). Provide an adjacency list alternative.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between nodes' },
            { key: 'Arrow Keys', action: 'Navigate to connected nodes' },
            { key: 'Enter', action: 'Select node and show details' },
            { key: '+/-', action: 'Zoom in/out' },
        ],
    },
};

export default NetworkDoc;
