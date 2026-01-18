import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const ProgressRingsDoc: ComponentDoc = {
    name: 'ProgressRingsChart',
    status: 'stable',
    version: '1.0.0',
    description: 'Visualizes multiple progress metrics as concentric rings. Similar to Apple Watch activity rings. Ideal for showing progress toward multiple goals in a compact, visually appealing format.',

    whenToUse: [
        'Dashboard KPIs showing progress toward multiple goals',
        'Fitness or activity tracking with multiple metrics',
        'Multi-dimensional progress visualization (e.g., project completion across areas)',
        'When a compact, modern aesthetic is desired',
        'Comparing progress rates across 2-4 related metrics',
    ],

    whenNotToUse: [
        'More than 4-5 rings become hard to read',
        'Precise value comparison is needed - use bar charts',
        'Metrics are unrelated or have very different scales',
        'When historical trend is important - use line charts',
    ],

    usage: `
\`\`\`tsx
import { ProgressRingsChart, ChartProvider } from '@pulwave/ui/data-visualization';

const activityData = [
    { name: 'Move', value: 75, max: 100, color: 'error' },
    { name: 'Exercise', value: 45, max: 60, color: 'success' },
    { name: 'Stand', value: 10, max: 12, color: 'primary' },
];

<ChartProvider>
  <ProgressRingsChart
    data={activityData}
    centerValue="75%"
    centerLabel="Move Goal"
    size={200}
    strokeWidth={12}
    gap={4}
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'Progress rings display concentric circular tracks, each partially filled to indicate progress. Essential elements include the rings, center content (optional summary), and a legend identifying each ring.',
        overflowContent: 'Limit to 3-4 rings. Inner rings become very small with more. Consider multiple ring charts for more metrics.',
        internationalization: 'Format percentages and values according to locale. Ring labels should be translatable.',
    },

    formatting: {
        emphasis: 'Use distinct, high-contrast colors for each ring. The outermost ring is most prominent. Background tracks should be subtle but visible.',
        alignment: 'Center the rings chart. Position center content clearly. Place legend where it doesn\'t crowd the visualization.',
    },

    props: [
        { name: 'data', type: "Array<{name, value, max?, color}>", required: true, description: 'Array of ring data with name, current value, optional max, and color.' },
        { name: 'centerValue', type: "string", description: 'Primary value displayed in the center.' },
        { name: 'centerLabel', type: "string", description: 'Label displayed below the center value.' },
        { name: 'size', type: "number", default: "200", description: 'Overall diameter of the chart in pixels.' },
        { name: 'strokeWidth', type: "number", default: "12", description: 'Width of each ring stroke.' },
        { name: 'gap', type: "number", default: "4", description: 'Gap between concentric rings.' },
        { name: 'showTrack', type: "boolean", default: "true", description: 'Show background track for each ring.' },
        { name: 'animate', type: "boolean", default: "true", description: 'Enable fill animation on render.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes all progress metrics (e.g., "Progress rings showing Move at 75%, Exercise at 75%, Stand at 83%")' },
            { attribute: 'aria-valuenow', usage: 'Each ring can have current value for assistive tech' },
            { attribute: 'aria-valuemax', usage: 'Each ring can have max value' },
        ],
        screenReader: 'Screen readers announce each ring\'s metric name, current value, and progress percentage. The center content is announced separately.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart (typically non-interactive)' },
        ],
    },
};

export default ProgressRingsDoc;
