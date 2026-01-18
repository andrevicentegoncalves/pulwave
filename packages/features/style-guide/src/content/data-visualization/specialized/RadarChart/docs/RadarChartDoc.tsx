import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const RadarChartDoc: ComponentDoc = {
    name: 'RadarChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Spider/web chart displaying multivariate data with each variable on its own axis radiating from the center. Ideal for comparing profiles, skill assessments, and multi-criteria analysis across 1-3 entities.',

    whenToUse: [
        'Comparing performance profiles across multiple dimensions',
        'Skill or competency assessments (spider diagrams)',
        'Product feature comparison (2-3 products)',
        'Quality metrics dashboards with 5-8 dimensions',
        'When the "shape" of the profile is meaningful',
    ],

    whenNotToUse: [
        'More than 3 overlapping series - becomes unreadable',
        'Variables on very different scales without normalization',
        'Precise value comparison - area distortion misleads',
        'Fewer than 3 or more than 12 variables',
        'When variables aren\'t equally important',
    ],

    usage: `
\`\`\`tsx
import { RadarChart, ChartProvider } from '@pulwave/ui/data-visualization';

const skillsData = [
    { skill: 'JavaScript', candidate1: 90, candidate2: 75 },
    { skill: 'React', candidate1: 85, candidate2: 90 },
    { skill: 'TypeScript', candidate1: 80, candidate2: 85 },
    { skill: 'CSS', candidate1: 70, candidate2: 80 },
    { skill: 'Testing', candidate1: 75, candidate2: 65 },
    { skill: 'DevOps', candidate1: 60, candidate2: 70 },
];

<ChartProvider>
  <RadarChart
    data={skillsData}
    angleKey="skill"
    dataKeys={['candidate1', 'candidate2']}
    dataKeyNames={{ candidate1: 'Alice', candidate2: 'Bob' }}
    showGrid
    fillOpacity={0.3}
    maxValue={100}
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A radar chart displays axes radiating from center, one per variable. Data points on each axis connect to form a polygon. Multiple series create overlapping shapes.',
        overflowContent: 'Best with 5-8 variables. Fewer makes the shape meaningless; more becomes cluttered. Normalize variables to the same scale.',
        internationalization: 'Variable labels should be translatable. Format values according to locale. Shape comparison works across languages.',
    },

    formatting: {
        emphasis: 'Use distinct colors for each series with semi-transparent fills. Grid lines help read values. Highlight differences between series.',
        alignment: 'Center the chart. First variable typically at top (12 o\'clock). Ensure labels don\'t overlap the chart.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of objects with one property per variable and values for each series.' },
        { name: 'angleKey', type: "string", required: true, description: 'Property name for variable/axis labels.' },
        { name: 'dataKeys', type: "string[]", required: true, description: 'Array of property names for each series to display.' },
        { name: 'dataKeyNames', type: "Record<string, string>", default: "{}", description: 'Display names for series in legend.' },
        { name: 'showGrid', type: "boolean", default: "true", description: 'Display polar grid lines.' },
        { name: 'fillOpacity', type: "number", default: "0.3", description: 'Opacity of the series area fills (0-1).' },
        { name: 'maxValue', type: "number", description: 'Maximum value for all axes (for normalization).' },
        { name: 'colors', type: "string[]", description: 'Custom colors for each series.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the comparison (e.g., "Radar chart comparing skills of Alice and Bob across 6 dimensions")' },
            { attribute: 'aria-describedby', usage: 'Links to data table' },
        ],
        screenReader: 'Screen readers announce each series with all its values by variable. Describe notable strengths/weaknesses. Provide comparison table alternative.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart and legend' },
            { key: 'Arrow Keys', action: 'Navigate between variables' },
        ],
    },
};

export default RadarChartDoc;
