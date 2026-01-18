import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const SankeyDiagramDoc: ComponentDoc = {
    name: 'SankeyDiagram',
    status: 'stable',
    version: '1.1.0',
    description: 'Visualizes flow magnitude between nodes where link width is proportional to quantity. Excellent for showing how values split, merge, and transform through a system - energy flows, budget allocation, user journeys.',

    whenToUse: [
        'Energy flow or material balance visualization',
        'Budget allocation and spending breakdowns',
        'User flow through conversion funnels',
        'Supply chain and logistics flows',
        'When showing quantity conservation through stages matters',
    ],

    whenNotToUse: [
        'Bidirectional or cyclic flows - use Chord diagram',
        'Process sequence without quantities - use Flow Chart',
        'Very many nodes (>30) - becomes illegible',
        'When precise values matter more than proportions',
        'Simple two-stage flows - use stacked bar or alluvial',
    ],

    usage: `
\`\`\`tsx
import { SankeyDiagram, ChartProvider } from '@pulwave/ui/data-visualization';

const energyFlow = {
    nodes: [
        { name: 'Solar' },
        { name: 'Wind' },
        { name: 'Natural Gas' },
        { name: 'Power Grid' },
        { name: 'Residential' },
        { name: 'Commercial' },
        { name: 'Industrial' },
    ],
    links: [
        { source: 0, target: 3, value: 120 },  // Solar -> Grid
        { source: 1, target: 3, value: 80 },   // Wind -> Grid
        { source: 2, target: 3, value: 200 },  // Gas -> Grid
        { source: 3, target: 4, value: 150 },  // Grid -> Residential
        { source: 3, target: 5, value: 120 },  // Grid -> Commercial
        { source: 3, target: 6, value: 130 },  // Grid -> Industrial
    ]
};

<ChartProvider>
  <SankeyDiagram
    nodes={energyFlow.nodes}
    links={energyFlow.links}
    nodeWidth={20}
    nodePadding={12}
    linkOpacity={0.5}
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A Sankey diagram displays nodes (stages/categories) connected by flows (links) whose width represents quantity. Flows visually show how values split or merge.',
        overflowContent: 'Works best with 3-5 stages and 10-20 nodes total. For complex flows, consider highlighting specific paths or allowing interactive filtering.',
        internationalization: 'Format flow values according to locale. Node labels should be translatable. Flow direction (left-to-right) may need adjustment for RTL.',
    },

    formatting: {
        emphasis: 'Color flows by source category for traceability. Use gradient colors from source to target for visual flow. Ensure sufficient contrast between adjacent flows.',
        alignment: 'Nodes align in columns by stage. Vertical ordering within columns should minimize link crossings. Labels on nodes, values on hover.',
    },

    props: [
        { name: 'nodes', type: "Array<{name: string}>", required: true, description: 'Array of node objects with name property.' },
        { name: 'links', type: "Array<{source, target, value}>", required: true, description: 'Array of flow links with source/target indices and value.' },
        { name: 'nodeWidth', type: "number", default: "20", description: 'Width of node rectangles in pixels.' },
        { name: 'nodePadding', type: "number", default: "10", description: 'Vertical padding between nodes in pixels.' },
        { name: 'linkOpacity', type: "number", default: "0.5", description: 'Opacity of flow links (0-1).' },
        { name: 'colors', type: "string[]", description: 'Custom color palette for nodes.' },
        { name: 'onLinkClick', type: "(link: Link) => void", description: 'Callback when a flow link is clicked.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the flow (e.g., "Sankey diagram showing energy flow from sources to consumers")' },
            { attribute: 'aria-describedby', usage: 'Links to flow data table' },
        ],
        screenReader: 'Screen readers announce each flow path with source, target, and value. Summarize total inflows and outflows per node. Provide a structured table alternative.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between nodes' },
            { key: 'Enter', action: 'Focus on flows connected to selected node' },
            { key: 'Arrow Keys', action: 'Navigate between flows' },
        ],
    },
};

export default SankeyDiagramDoc;
