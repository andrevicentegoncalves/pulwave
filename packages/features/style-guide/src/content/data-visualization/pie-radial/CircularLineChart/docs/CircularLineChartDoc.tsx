import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const CircularLineChartDoc: ComponentDoc = {
    name: 'CircularLineChart',
    status: 'stable',
    version: '1.0.0',
    description: 'A radar/spider chart displaying multivariate data as a polygon on circular axes. Each axis represents a variable, making it excellent for comparing items across multiple dimensions simultaneously.',

    whenToUse: [
        'Comparing multiple attributes of items (product features)',
        'Performance profiles across dimensions',
        'Skill assessments and competency mapping',
        'When the cyclic nature of data has meaning',
        'Showing relative strengths and weaknesses',
    ],

    whenNotToUse: [
        'More than 10 variables - becomes unreadable',
        'When precise value comparison is critical',
        'Non-comparable variables with different scales',
        'Time series data - use line chart',
        'When area perception matters (areas are distorted)',
    ],

    usage: `
\`\`\`tsx
import { CircularLineChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { subject: 'Math', A: 120, B: 110 },
    { subject: 'Science', A: 98, B: 130 },
    { subject: 'English', A: 86, B: 100 },
    { subject: 'History', A: 99, B: 85 },
];

<ChartProvider>
  <CircularLineChart
    data={data}
    categoryKey="subject"
    dataKeys={[
      { key: 'A', name: 'Student A', color: '#3B82F6' },
      { key: 'B', name: 'Student B', color: '#10B981' },
    ]}
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A circular chart with axes radiating from the center, one for each variable. Data points are plotted on each axis and connected to form a polygon. Essential elements include axes, gridlines, and filled/stroked polygons.',
        overflowContent: 'Works best with 3-8 variables. More variables require larger chart size. Consider grouping or filtering when many attributes exist.',
        internationalization: 'Variable labels should be translatable. Values formatted per locale. Layout works for both LTR and RTL.',
    },

    formatting: {
        emphasis: 'Use semi-transparent fills to see overlapping series. Distinct colors for each series. Consistent scale across all axes.',
        alignment: 'Start at 12 o\'clock position. Space axes evenly. Provide clear axis labels outside the chart area.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of data objects with category and values for each series.' },
        { name: 'categoryKey', type: "string", required: true, description: 'Property name for axis/category labels.' },
        { name: 'dataKeys', type: "Array<{key, name, color}>", required: true, description: 'Configuration for each data series to plot.' },
        { name: 'fillOpacity', type: "number", default: "0.3", description: 'Opacity of the filled area (0-1).' },
        { name: 'showGrid', type: "boolean", default: "true", description: 'Show circular gridlines.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the comparison (e.g., "Radar chart comparing two students across subjects")' },
            { attribute: 'aria-describedby', usage: 'Links to data comparison table' },
        ],
        screenReader: 'Announce each series with all variable values. Compare series for highest/lowest points. Provide tabular alternative.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between series' },
            { key: 'Arrow Keys', action: 'Navigate around axis points' },
            { key: 'Enter', action: 'Show point details' },
        ],
    },
};

export default CircularLineChartDoc;
