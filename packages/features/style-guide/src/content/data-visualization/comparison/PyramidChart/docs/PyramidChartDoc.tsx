import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const PyramidChartDoc: ComponentDoc = {
    name: 'PyramidChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Triangular visualization for hierarchical data where levels increase from top to bottom. Unlike funnels (which show attrition), pyramids emphasize stable hierarchy levels like organizational structure or needs hierarchies.',

    whenToUse: [
        'Organizational hierarchy visualization (C-suite to employees)',
        'Maslow\'s hierarchy of needs or similar frameworks',
        'Classification taxonomies with levels',
        'Demographic age-sex pyramids (population)',
        'When lower levels are inherently larger/more foundational',
    ],

    whenNotToUse: [
        'Sequential process with attrition - use Funnel chart',
        'When levels don\'t have hierarchical relationship',
        'Precise value comparison needed - use bar chart',
        'More than 7-8 levels - becomes too compressed',
        'When values don\'t follow pyramid pattern (wide top, narrow bottom)',
    ],

    usage: `
\`\`\`tsx
import { PyramidChart, ChartProvider } from '@pulwave/ui/data-visualization';

const organizationalHierarchy = [
    { level: 'Executives', value: 5, description: 'C-Suite & VPs' },
    { level: 'Directors', value: 25, description: 'Department Heads' },
    { level: 'Managers', value: 80, description: 'Team Leads' },
    { level: 'Senior Staff', value: 200, description: 'Senior Individual Contributors' },
    { level: 'Staff', value: 500, description: 'Individual Contributors' },
];

<ChartProvider>
  <PyramidChart
    data={organizationalHierarchy}
    nameKey="level"
    valueKey="value"
    showPercentages
    orientation="up"
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A pyramid displays horizontal segments in triangular arrangement. Segment width represents value, with narrower at top. Labels show level names and values.',
        overflowContent: 'Best with 4-7 levels. Very narrow top segments may have label placement challenges. Consider abbreviations or tooltips for long labels.',
        internationalization: 'Format values according to locale. Level labels should be translatable. Pyramid shape is universally understood.',
    },

    formatting: {
        emphasis: 'Use color gradients or distinct colors per level. Top levels often warrant warmer/more prominent colors. Ensure sufficient contrast between adjacent levels.',
        alignment: 'Center-align the pyramid. Labels typically on the side. Ensure the triangular shape is clear and not too compressed.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of level objects ordered from top to bottom.' },
        { name: 'nameKey', type: "string", required: true, description: 'Property name for level labels.' },
        { name: 'valueKey', type: "string", required: true, description: 'Property name for level values.' },
        { name: 'orientation', type: "'up' | 'down'", default: "'up'", description: 'Pyramid points up (traditional) or down (inverted).' },
        { name: 'showPercentages', type: "boolean", default: "false", description: 'Display percentage of total for each level.' },
        { name: 'colors', type: "string[]", description: 'Custom colors for each level.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the hierarchy (e.g., "Pyramid showing organizational structure with 5 executives at top and 500 staff at base")' },
            { attribute: 'aria-describedby', usage: 'Links to hierarchy data table' },
        ],
        screenReader: 'Screen readers announce each level from top to bottom with name, count, and percentage. Describe the hierarchical relationship.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between pyramid levels' },
            { key: 'Enter', action: 'Show level details' },
        ],
    },
};

export default PyramidChartDoc;
