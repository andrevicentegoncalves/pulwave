import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const SunburstChartDoc: ComponentDoc = {
    name: 'SunburstChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Hierarchical chart using concentric rings to show nested data relationships. The center represents the root, with each ring showing a deeper level of hierarchy. Excellent for exploring and drilling into hierarchical data.',

    whenToUse: [
        'Exploring multi-level hierarchical data interactively',
        'Showing part-to-whole relationships across hierarchy levels',
        'File system or organizational structure visualization',
        'Category breakdown with subcategories (e.g., budget by department)',
        'When drill-down interaction is valuable',
    ],

    whenNotToUse: [
        'Flat categorical data - use pie or bar chart',
        'Comparing values at same level precisely - use treemap or bar',
        'Very deep hierarchies (>5 levels) become hard to read',
        'Many small leaf nodes - labels become unreadable',
        'When exact value comparison matters more than structure',
    ],

    usage: `
\`\`\`tsx
import { SunburstChart, ChartProvider } from '@pulwave/ui/data-visualization';

const budgetData = {
    name: 'Total Budget',
    children: [
        {
            name: 'Engineering',
            children: [
                { name: 'Frontend', value: 250000 },
                { name: 'Backend', value: 300000 },
                { name: 'DevOps', value: 150000 },
            ]
        },
        {
            name: 'Marketing',
            children: [
                { name: 'Digital', value: 180000 },
                { name: 'Brand', value: 120000 },
            ]
        },
        {
            name: 'Operations',
            value: 200000
        },
    ]
};

<ChartProvider>
  <SunburstChart
    data={budgetData}
    size={400}
    innerRadius={40}
    showLabels
    onSegmentClick={(node) => console.log('Clicked:', node)}
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A sunburst displays concentric rings where arc angle represents proportion and ring depth represents hierarchy level. Essential elements include the root center, colored segments, labels, and interactive tooltips.',
        overflowContent: 'Works best with 2-4 hierarchy levels. More levels make outer rings very thin. Consider filtering or aggregating deep branches. Zoomable sunbursts allow drilling into sections.',
        internationalization: 'Format values according to locale. Node labels should be translatable. Consider text direction for label placement in RTL languages.',
    },

    formatting: {
        emphasis: 'Color by root category for visual grouping. Use color gradients within branches for depth perception. Highlight the path from root to hovered segment.',
        alignment: 'Center the chart. Labels work best on outer segments - inner ones may need tooltips. Consider starting angle for most important category.',
    },

    props: [
        { name: 'data', type: "HierarchyNode", required: true, description: 'Hierarchical data with name, value (for leaves), and children arrays.' },
        { name: 'nameKey', type: "string", default: "'name'", description: 'Property name for node labels.' },
        { name: 'valueKey', type: "string", default: "'value'", description: 'Property name for leaf node values.' },
        { name: 'size', type: "number", default: "400", description: 'Chart diameter in pixels.' },
        { name: 'innerRadius', type: "number", default: "60", description: 'Radius of the center hole in pixels.' },
        { name: 'showLabels', type: "boolean", default: "true", description: 'Display labels on segments.' },
        { name: 'onSegmentClick', type: "(node: HierarchyNode) => void", description: 'Callback when a segment is clicked for drill-down.' },
        { name: 'colors', type: "string[]", description: 'Custom color palette for root-level categories.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the hierarchy (e.g., "Sunburst chart showing budget allocation by department")' },
            { attribute: 'aria-describedby', usage: 'Links to hierarchical data table' },
        ],
        screenReader: 'Screen readers announce current level, segment name, value, and percentage. Navigation should follow the hierarchy structure. Provide a collapsible tree table alternative.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between segments at current level' },
            { key: 'Enter', action: 'Drill into selected segment' },
            { key: 'Escape', action: 'Zoom back to parent level' },
            { key: 'Arrow Keys', action: 'Navigate sibling segments' },
        ],
    },
};

export default SunburstChartDoc;
