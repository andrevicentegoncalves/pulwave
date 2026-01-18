import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const ThresholdAreaChartDoc: ComponentDoc = {
    name: 'ThresholdAreaChart',
    status: 'stable',
    version: '1.0.0',
    description: 'Area chart with a threshold line that colors areas above and below the target differently. Ideal for visualizing performance against goals, SLA compliance, or budget tracking.',

    whenToUse: [
        'Comparing actual values against a target or SLA threshold',
        'Budget vs actual spending over time',
        'Performance metrics against goals',
        'Temperature or environmental monitoring against limits',
        'Any metric where above/below a line has different significance',
    ],

    whenNotToUse: [
        'No meaningful threshold exists for the data',
        'Multiple thresholds needed - becomes visually complex',
        'Comparing multiple series - use a standard Line Chart',
        'When the threshold changes over time dynamically',
    ],

    usage: `
\`\`\`tsx
import { ThresholdAreaChart, ChartProvider } from '@pulwave/ui/data-visualization';

const salesData = [
    { month: 'Jan', sales: 2800 },
    { month: 'Feb', sales: 3200 },
    { month: 'Mar', sales: 2900 },
    { month: 'Apr', sales: 3500 },
    { month: 'May', sales: 4200 },
    { month: 'Jun', sales: 3100 },
];

<ChartProvider>
  <ThresholdAreaChart
    data={salesData}
    xKey="month"
    yKey="sales"
    threshold={3000}
    thresholdLabel="Target: $3,000"
    aboveColor="success"
    belowColor="error"
    showLegend
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A threshold area chart displays an area chart split by a horizontal threshold line. Areas above the threshold use one color (typically positive/success) and areas below use another (typically negative/warning). Essential elements include the threshold line with optional label, and a legend explaining the color coding.',
        overflowContent: 'For complex datasets, ensure the threshold line remains visible. Consider using a semi-transparent overlay rather than full opacity for better context.',
        internationalization: 'Format threshold values and axis labels according to locale. Ensure threshold labels are translatable.',
    },

    formatting: {
        emphasis: 'Use semantic colors (green above, red below) when appropriate. The threshold line should be clearly visible but not overpowering. Consider adding a subtle dashed style to the threshold line.',
        alignment: 'Clearly label the threshold value. Consider adding annotations when the line crosses the threshold. Position the threshold label to not obscure data.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of time series data objects.' },
        { name: 'xKey', type: "string", default: "'name'", description: 'Property name for X-axis values.' },
        { name: 'yKey', type: "string", default: "'value'", description: 'Property name for Y-axis values.' },
        { name: 'threshold', type: "number", required: true, description: 'The threshold value for the dividing line.' },
        { name: 'thresholdLabel', type: "string", description: 'Label text displayed alongside the threshold line.' },
        { name: 'aboveColor', type: "string", default: "'success'", description: 'Color for the area above the threshold.' },
        { name: 'belowColor', type: "string", default: "'error'", description: 'Color for the area below the threshold.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Display legend explaining above/below colors.' },
        { name: 'height', type: "number", default: "300", description: 'Chart height in pixels.' },
        { name: 'animate', type: "boolean", default: "true", description: 'Enable entry animations.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the chart with threshold context (e.g., "Sales chart showing performance against $3,000 target")' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table' },
        ],
        screenReader: 'Screen readers should announce the threshold value, periods above threshold, and periods below threshold. Summarize overall performance (e.g., "Above target 4 of 6 months").',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart and legend elements' },
            { key: 'Enter/Space', action: 'Toggle elements visibility in legend' },
        ],
    },
};

export default ThresholdAreaChartDoc;
