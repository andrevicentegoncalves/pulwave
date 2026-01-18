import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const TreemapDoc: ComponentDoc = {
    name: 'Treemap',
    status: 'stable',
    version: '1.1.0',
    description: 'Space-filling visualization using nested rectangles to display hierarchical data. Rectangle area is proportional to value, making it excellent for comparing sizes across and within categories.',

    whenToUse: [
        'Showing part-to-whole relationships in hierarchical data',
        'Comparing sizes across many categories efficiently',
        'Disk space or portfolio allocation visualization',
        'When space efficiency matters (fits many items in bounded area)',
        'Identifying outliers in large datasets by visual prominence',
    ],

    whenNotToUse: [
        'Precise value comparison - rectangles are hard to compare',
        'When hierarchy structure is more important than values',
        'Very deep hierarchies (>3-4 levels)',
        'Temporal data or trends - use line or bar charts',
        'When many items have similar sizes (hard to distinguish)',
    ],

    usage: `
\`\`\`tsx
import { TreemapChart, ChartProvider } from '@pulwave/ui/data-visualization';

const portfolioData = {
    name: 'Portfolio',
    children: [
        {
            name: 'Technology',
            children: [
                { name: 'AAPL', value: 45000 },
                { name: 'MSFT', value: 38000 },
                { name: 'GOOGL', value: 32000 },
            ]
        },
        {
            name: 'Healthcare',
            children: [
                { name: 'JNJ', value: 22000 },
                { name: 'PFE', value: 18000 },
            ]
        },
        {
            name: 'Finance',
            children: [
                { name: 'JPM', value: 25000 },
                { name: 'BAC', value: 15000 },
            ]
        },
    ]
};

<ChartProvider>
  <TreemapChart
    data={portfolioData}
    nameKey="name"
    valueKey="value"
    colorByRoot
    showLabels
    padding={2}
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A treemap displays rectangles where area represents value. Nesting shows hierarchy - parent rectangles contain children. Essential elements include sized rectangles, category colors, and labels.',
        overflowContent: 'Squarified layout algorithm produces the most readable rectangles. Very small values may become invisible. Consider filtering or aggregating small items into "Other".',
        internationalization: 'Format values according to locale. Labels should be translatable. Rectangle sizes remain meaningful across languages.',
    },

    formatting: {
        emphasis: 'Color by root category for grouping. Use darker shades for nested levels. Borders help distinguish adjacent rectangles. Highlight on hover for identification.',
        alignment: 'Fill the available container. Padding between rectangles aids readability. Labels should truncate or hide when rectangles are too small.',
    },

    props: [
        { name: 'data', type: "HierarchyNode", required: true, description: 'Hierarchical data with name, value, and children arrays.' },
        { name: 'nameKey', type: "string", default: "'name'", description: 'Property name for node labels.' },
        { name: 'valueKey', type: "string", default: "'value'", description: 'Property name for sizing rectangles.' },
        { name: 'colorByRoot', type: "boolean", default: "true", description: 'Color rectangles by their top-level parent category.' },
        { name: 'showLabels', type: "boolean", default: "true", description: 'Display labels on rectangles (auto-hides for small ones).' },
        { name: 'padding', type: "number", default: "2", description: 'Padding between rectangles in pixels.' },
        { name: 'tile', type: "'squarify' | 'binary' | 'slice' | 'dice'", default: "'squarify'", description: 'Layout algorithm for rectangle arrangement.' },
        { name: 'onNodeClick', type: "(node: HierarchyNode) => void", description: 'Callback when a rectangle is clicked.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the hierarchy (e.g., "Treemap showing portfolio allocation by sector")' },
            { attribute: 'aria-describedby', usage: 'Links to hierarchical data table' },
        ],
        screenReader: 'Screen readers announce node name, value, percentage of total, and parent category. Provide a sortable data table alternative for detailed exploration.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between rectangles' },
            { key: 'Enter', action: 'Drill into selected rectangle' },
            { key: 'Escape', action: 'Zoom back to parent level' },
        ],
    },
};

export default TreemapDoc;
