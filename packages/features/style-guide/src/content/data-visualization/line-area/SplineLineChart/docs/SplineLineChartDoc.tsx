import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const SplineLineChartDoc: ComponentDoc = {
    name: 'SplineLineChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Line chart with smooth spline (Bezier) interpolation between data points. Ideal for continuous data where smooth visual flow is preferred over showing exact point-to-point connections.',

    whenToUse: [
        'Continuous data with smooth natural transitions (temperature, waves)',
        'When visual flow and aesthetics are important',
        'Scientific data with expected smooth curves',
        'Marketing dashboards where a polished look is desired',
        'Interpolating between sampled data points',
    ],

    whenNotToUse: [
        'Discrete data changes (use Step Line Chart)',
        'When exact point-to-point accuracy is critical',
        'Financial data where interpolated values could be misleading',
        'Sparse data where curves might suggest false patterns',
    ],

    usage: `
\`\`\`tsx
import { SplineLineChart, ChartProvider } from '@pulwave/ui/data-visualization';

const temperatureData = [
    { hour: '00:00', temp: 18 },
    { hour: '04:00', temp: 15 },
    { hour: '08:00', temp: 17 },
    { hour: '12:00', temp: 24 },
    { hour: '16:00', temp: 26 },
    { hour: '20:00', temp: 21 },
];

<ChartProvider>
  <SplineLineChart
    data={temperatureData}
    xKey="hour"
    series={[{ key: 'temp', name: 'Temperature', color: 'primary' }]}
    showGrid
    showDots
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A spline line chart uses curved lines connecting data points via Bezier interpolation. Essential elements include axes, optional data point markers, and a legend for multiple series.',
        overflowContent: 'For many data points, the curves may become less smooth. Consider data aggregation or using a simpler line chart for dense datasets.',
        internationalization: 'Format axis values according to locale conventions. Ensure labels and tooltips support localization.',
    },

    formatting: {
        emphasis: 'Use line thickness and color saturation to emphasize primary series. The smooth curves naturally draw attention, so avoid cluttering with too many series.',
        alignment: 'Maintain consistent margins and grid alignment. Position legends where they don\'t interfere with curve perception.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of data objects with x-axis and series values.' },
        { name: 'series', type: "SeriesConfig[]", required: true, description: 'Configuration for each line series including key, name, and color.' },
        { name: 'xKey', type: "string", default: "'name'", description: 'Property name for X-axis values.' },
        { name: 'smooth', type: "boolean", default: "true", description: 'Enable spline (curved) interpolation. Set false for straight lines.' },
        { name: 'showDots', type: "boolean", default: "true", description: 'Display markers at each data point.' },
        { name: 'showGrid', type: "boolean", default: "true", description: 'Display grid lines.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Display legend for series identification.' },
        { name: 'height', type: "number", default: "300", description: 'Chart height in pixels.' },
        { name: 'animate', type: "boolean", default: "true", description: 'Enable entry animations.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the chart purpose and data trend' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table' },
        ],
        screenReader: 'Screen readers announce the chart type, series names, and overall trends. Provide a data table alternative for detailed value access.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart and legend elements' },
            { key: 'Enter/Space', action: 'Toggle series visibility in legend' },
        ],
    },
};

export default SplineLineChartDoc;
