import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const ProgressRingsChartDoc: ComponentDoc = {
    name: 'ProgressRingsChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Concentric circular progress rings for displaying multiple metrics in a compact space. Similar to Apple Watch activity rings, showing progress toward multiple goals simultaneously with an engaging visual.',

    whenToUse: [
        'Multiple progress metrics in compact space (fitness apps)',
        'Goal tracking with visual engagement',
        'Dashboard widgets showing 2-4 KPIs',
        'When Apple Watch ring metaphor resonates',
        'Activity or achievement tracking displays',
    ],

    whenNotToUse: [
        'More than 4-5 rings - becomes cluttered',
        'Precise value comparison needed',
        'Non-percentage/progress data',
        'When ring ordering could confuse users',
        'Space is very limited - use simple bars',
    ],

    usage: `
\`\`\`tsx
import { ProgressRingsChart, ChartProvider } from '@pulwave/ui/data-visualization';

const fitnessData = [
    { name: 'Move', value: 85, color: '#EF4444' },
    { name: 'Exercise', value: 65, color: '#10B981' },
    { name: 'Stand', value: 92, color: '#3B82F6' },
];

<ChartProvider>
  <ProgressRingsChart
    data={fitnessData}
    size={200}
    ringWidth={20}
    showLabels
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'Concentric rings where each ring represents a metric, filled proportionally to progress. Outer rings are typically more important. Elements include rings, optional center content, and legend.',
        overflowContent: 'Works best with 2-4 rings. More rings require larger size. Consider stacking mini-ring charts instead of many concentric rings.',
        internationalization: 'Metric names should be translatable. Format percentages according to locale. Ring direction typically clockwise.',
    },

    formatting: {
        emphasis: 'Use distinct, vibrant colors for each ring. Consider ordering by importance (outer = primary). Add subtle animation on load.',
        alignment: 'Center the rings. Ensure adequate spacing between rings. Legend should clearly associate colors with metrics.',
    },

    props: [
        { name: 'data', type: "Array<{name, value, color, max?}>", required: true, description: 'Array of ring data with name, progress value (0-100 or 0-max), and color.' },
        { name: 'size', type: "number", default: "200", description: 'Overall chart size in pixels.' },
        { name: 'ringWidth', type: "number", default: "20", description: 'Thickness of each ring in pixels.' },
        { name: 'ringGap', type: "number", default: "4", description: 'Gap between rings in pixels.' },
        { name: 'showLabels', type: "boolean", default: "false", description: 'Show metric labels in legend.' },
        { name: 'animated', type: "boolean", default: "true", description: 'Animate rings on load.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes all rings (e.g., "Progress rings: Move 85%, Exercise 65%, Stand 92%")' },
            { attribute: 'aria-describedby', usage: 'Links to detailed metrics list' },
        ],
        screenReader: 'Announce each metric with name and percentage. List in order of importance (outer to inner). State if any goals are complete.',
        keyboard: [
            { key: 'Tab', action: 'Focus the chart' },
        ],
    },
};

export default ProgressRingsChartDoc;
