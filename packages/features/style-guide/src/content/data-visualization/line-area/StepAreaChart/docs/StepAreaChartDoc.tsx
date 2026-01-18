import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const StepAreaChartDoc: ComponentDoc = {
    name: 'StepAreaChart',
    status: 'stable',
    version: '1.0.0',
    description: 'Area chart with step interpolation for discrete value changes. Combines the visual weight of an area chart with the discrete-change semantics of step charts. Ideal for capacity, utilization, or state duration visualization.',

    whenToUse: [
        'Capacity or resource utilization that changes in discrete steps',
        'State duration visualization where the "weight" of time matters',
        'Inventory levels with emphasis on quantity-over-time',
        'Service level or status history',
        'When both the magnitude and constancy of values are important',
    ],

    whenNotToUse: [
        'Continuous smooth data - use Area Chart',
        'Comparing individual step heights precisely - use Step Line Chart',
        'Many overlapping series - filled areas become confusing',
        'Negative values - step areas can be misleading below zero',
    ],

    usage: `
\`\`\`tsx
import { StepAreaChart, ChartProvider } from '@pulwave/ui/data-visualization';

const utilizationData = [
    { time: '09:00', cpu: 25 },
    { time: '10:00', cpu: 45 },
    { time: '11:00', cpu: 85 },
    { time: '12:00', cpu: 60 },
    { time: '13:00', cpu: 40 },
    { time: '14:00', cpu: 70 },
];

<ChartProvider>
  <StepAreaChart
    data={utilizationData}
    xKey="time"
    yKeys={['cpu']}
    stepType="stepAfter"
    fillOpacity={0.5}
    color="primary"
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A step area chart fills the area beneath a step line, creating rectangular blocks. This emphasizes both the duration at each level and the magnitude of values. Essential elements include axes, the filled area, and optional level annotations.',
        overflowContent: 'For dense step changes, the blocks become narrow. Consider aggregating or using a simpler line chart for very frequent changes.',
        internationalization: 'Format all axis labels and values according to locale. Support localization for any annotations or tooltips.',
    },

    formatting: {
        emphasis: 'Use semi-transparent fills (0.3-0.6 opacity) to show depth while maintaining readability of grid lines. Color intensity can indicate severity or importance of levels.',
        alignment: 'Start Y-axis at zero for accurate area perception. Align step transitions with grid lines when possible.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of data objects with x-axis and series values.' },
        { name: 'xKey', type: "string", required: true, description: 'Property name for X-axis values.' },
        { name: 'yKeys', type: "string[]", required: true, description: 'Property names for the Y-axis series to display.' },
        { name: 'stepType', type: "'step' | 'stepBefore' | 'stepAfter'", default: "'stepAfter'", description: 'When the step transition occurs.' },
        { name: 'color', type: "string", description: 'Color for the stroke and fill.' },
        { name: 'fillOpacity', type: "number", default: "0.4", description: 'Opacity of the area fill (0-1).' },
        { name: 'showGrid', type: "boolean", default: "true", description: 'Display grid lines.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Display legend for series identification.' },
        { name: 'height', type: "number", default: "300", description: 'Chart height in pixels.' },
        { name: 'animate', type: "boolean", default: "true", description: 'Enable entry animations.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the chart purpose (e.g., "Step area chart showing CPU utilization over time")' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table' },
        ],
        screenReader: 'Screen readers should announce each level and its duration. The area visual emphasis doesn\'t translate to audio, so focus on level values and transition times.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart and legend elements' },
            { key: 'Enter/Space', action: 'Toggle series visibility in legend' },
        ],
    },
};

export default StepAreaChartDoc;
