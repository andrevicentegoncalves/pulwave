import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const FlowChartDoc: ComponentDoc = {
    name: 'FlowChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Visualizes sequential processes, workflows, or decision trees with nodes and directed edges. Ideal for documenting procedures, user journeys, and system architectures.',

    whenToUse: [
        'Documenting business processes or workflows',
        'Decision trees and branching logic',
        'User journey or customer flow visualization',
        'System architecture or data pipeline diagrams',
        'Onboarding processes or step-by-step guides',
    ],

    whenNotToUse: [
        'Showing magnitude/quantity flows - use Sankey diagram',
        'Complex network relationships - use Network chart',
        'Very large processes (>30 nodes) without hierarchy',
        'When the process is purely linear - use Timeline',
    ],

    usage: `
\`\`\`tsx
import { FlowChart, ChartProvider } from '@pulwave/ui/data-visualization';

const orderWorkflow = {
    nodes: [
        { id: 'start', label: 'Order Received', type: 'start' },
        { id: 'validate', label: 'Validate Payment', type: 'process' },
        { id: 'check', label: 'In Stock?', type: 'decision' },
        { id: 'ship', label: 'Ship Order', type: 'process' },
        { id: 'backorder', label: 'Create Backorder', type: 'process' },
        { id: 'end', label: 'Complete', type: 'end' },
    ],
    edges: [
        { from: 'start', to: 'validate' },
        { from: 'validate', to: 'check' },
        { from: 'check', to: 'ship', label: 'Yes' },
        { from: 'check', to: 'backorder', label: 'No' },
        { from: 'ship', to: 'end' },
        { from: 'backorder', to: 'end' },
    ]
};

<ChartProvider>
  <FlowChart
    nodes={orderWorkflow.nodes}
    edges={orderWorkflow.edges}
    direction="TB"
    nodeWidth={150}
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A flow chart displays nodes (steps/decisions) connected by directed edges (arrows). Node shapes indicate type: rectangles for processes, diamonds for decisions, ovals for start/end.',
        overflowContent: 'For large processes, consider swimlanes for organizational context, collapsible subprocesses, or paginated views.',
        internationalization: 'Node labels and edge labels should be translatable. Flow direction (left-to-right vs right-to-left) may need adjustment for RTL languages.',
    },

    formatting: {
        emphasis: 'Use consistent node shapes per type. Color nodes by status, department, or importance. Highlight the critical path if applicable.',
        alignment: 'Top-to-bottom (TB) or left-to-right (LR) layouts are most common. Align parallel branches. Use swimlanes for cross-functional processes.',
    },

    props: [
        { name: 'nodes', type: "Node[]", required: true, description: 'Array of node objects with id, label, and optional type.' },
        { name: 'edges', type: "Edge[]", required: true, description: 'Array of edge objects with from, to, and optional label.' },
        { name: 'direction', type: "'TB' | 'LR' | 'BT' | 'RL'", default: "'TB'", description: 'Flow direction: Top-Bottom, Left-Right, etc.' },
        { name: 'nodeWidth', type: "number", default: "120", description: 'Default width of nodes in pixels.' },
        { name: 'nodeHeight', type: "number", default: "40", description: 'Default height of nodes in pixels.' },
        { name: 'onNodeClick', type: "(node: Node) => void", description: 'Callback when a node is clicked.' },
        { name: 'editable', type: "boolean", default: "false", description: 'Enable interactive editing of the flow.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image for static view' },
            { attribute: 'aria-label', usage: 'Describes the process (e.g., "Flow chart showing order fulfillment workflow")' },
            { attribute: 'aria-describedby', usage: 'Links to process description list' },
        ],
        screenReader: 'Screen readers announce each node and its connections. Describe the flow path from start to end. Provide a numbered step list alternative.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between nodes' },
            { key: 'Arrow Keys', action: 'Navigate along edges to connected nodes' },
            { key: 'Enter', action: 'Activate node (show details or edit)' },
        ],
    },
};

export default FlowChartDoc;
