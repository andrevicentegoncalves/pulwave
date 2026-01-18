import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const RoseDoc: ComponentDoc = {
    name: 'RoseChart',
    status: 'stable',
    version: '1.1.0',
    description: 'A Nightingale rose diagram (polar area chart) where segments have equal angles but radii proportional to values. More visually impactful than pie charts for showing magnitude differences while maintaining categorical grouping.',

    whenToUse: [
        'Cyclical data like months, hours, or seasons',
        'When visual impact matters more than precision',
        'Comparing magnitudes across equal-weight categories',
        'Wind direction frequency (wind rose)',
        'Time-based patterns with polar representation',
    ],

    whenNotToUse: [
        'Part-to-whole relationships - use pie or donut',
        'Many categories (>12) - becomes cluttered',
        'When precise comparison is critical (area distortion)',
        'Non-cyclical categorical data',
        'When audience is unfamiliar with polar charts',
    ],

    usage: `
\`\`\`tsx
import { RoseChart, ChartProvider } from '@pulwave/ui/data-visualization';

const monthlyData = [
    { name: 'Jan', value: 120 },
    { name: 'Feb', value: 95 },
    { name: 'Mar', value: 140 },
    { name: 'Apr', value: 165 },
    { name: 'May', value: 180 },
    { name: 'Jun', value: 210 },
];

<ChartProvider>
  <RoseChart
    data={monthlyData}
    size={400}
    innerRadius={0.2}
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A circular chart with wedge-shaped segments. Each segment spans an equal angle, but the radius varies by value. Creates a flower-like pattern where larger values "bloom" outward.',
        overflowContent: 'Works best with 6-12 categories. Categories are typically evenly spaced around the circle. Consider grouping for more categories.',
        internationalization: 'Category labels should be translatable. Format values according to locale. Rotation/start angle may need adjustment for RTL.',
    },

    formatting: {
        emphasis: 'Use distinct colors per category or a gradient based on value. Start at 12 o\'clock position for time-based data. Add gridlines for value reference.',
        alignment: 'Center the chart. Ensure labels don\'t overlap. Consider legend for color coding if not using category labels directly.',
    },

    props: [
        { name: 'data', type: "Array<{name, value, color?}>", required: true, description: 'Array of category data with values.' },
        { name: 'size', type: "number", default: "400", description: 'Chart diameter in pixels.' },
        { name: 'innerRadius', type: "number", default: "0", description: 'Inner radius ratio (0-1), 0 for full rose, >0 for donut style.' },
        { name: 'startAngle', type: "number", default: "0", description: 'Starting angle in degrees (0 = 3 o\'clock, 90 = 12 o\'clock).' },
        { name: 'showLabels', type: "boolean", default: "true", description: 'Display category labels.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the chart (e.g., "Rose chart showing monthly sales with June highest")' },
            { attribute: 'aria-describedby', usage: 'Links to data table' },
        ],
        screenReader: 'Announce each category with its value, proceeding clockwise. State maximum and minimum values. Provide tabular alternative.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between segments' },
            { key: 'Enter', action: 'Show segment details' },
        ],
    },
};

export default RoseDoc;
