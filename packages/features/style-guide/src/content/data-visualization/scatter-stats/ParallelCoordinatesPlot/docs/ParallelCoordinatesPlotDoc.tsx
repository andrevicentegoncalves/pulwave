import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const ParallelCoordinatesPlotDoc: ComponentDoc = {
    name: 'ParallelCoordinatesPlot',
    status: 'stable',
    version: '1.0.0',
    description: 'Visualizes multi-dimensional data with parallel vertical axes connected by polylines. Ideal for finding patterns, identifying outliers, comparing items across 4-12 dimensions, and discovering correlations.',

    whenToUse: [
        'Exploring relationships across many dimensions (4-12 variables)',
        'Identifying clusters or patterns in multivariate data',
        'Comparing individual records across multiple attributes',
        'Finding outliers that deviate from common patterns',
        'Interactive data exploration with brushing and filtering',
    ],

    whenNotToUse: [
        'Fewer than 4 dimensions - use scatter plot matrix',
        'More than 15 dimensions - becomes too cluttered',
        'Large datasets (1000+ items) without aggregation',
        'When precise value reading matters - use data table',
        'Audience unfamiliar with multivariate visualization',
    ],

    usage: `
\`\`\`tsx
import { ParallelCoordinatesPlot, ChartProvider } from '@pulwave/ui/data-visualization';

const carData = [
    { name: 'Model A', mpg: 32, horsepower: 130, weight: 2800, acceleration: 16, year: 82 },
    { name: 'Model B', mpg: 28, horsepower: 150, weight: 3200, acceleration: 14, year: 84 },
    { name: 'Model C', mpg: 22, horsepower: 200, weight: 3800, acceleration: 12, year: 80 },
    { name: 'Model D', mpg: 38, horsepower: 90, weight: 2200, acceleration: 18, year: 85 },
];

<ChartProvider>
  <ParallelCoordinatesPlot
    data={carData}
    dimensions={['mpg', 'horsepower', 'weight', 'acceleration', 'year']}
    colorBy="mpg"
    showBrush
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'Parallel coordinates display vertical axes for each dimension. Each data item is a polyline connecting its values across all axes. Essential elements include axis labels, scales, and interactive brushes for filtering.',
        overflowContent: 'Works best with 4-12 dimensions. More axes require horizontal scrolling or dimension selection. Consider dimension ordering to reveal correlations between adjacent axes.',
        internationalization: 'Format numeric values according to locale. Dimension labels should be translatable. Ensure adequate axis spacing for longer labels.',
    },

    formatting: {
        emphasis: 'Color lines by a categorical or continuous variable to reveal groupings. Use transparency for overlapping lines. Highlight selected items with full opacity.',
        alignment: 'Order dimensions to place correlated variables adjacent. Most important dimensions at edges (first and last) are most visible.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of multi-dimensional data objects.' },
        { name: 'dimensions', type: "string[]", required: true, description: 'Array of property names to display as parallel axes.' },
        { name: 'colorBy', type: "string", description: 'Property name to use for line coloring.' },
        { name: 'axisWidth', type: "number", default: "80", description: 'Spacing between vertical axes in pixels.' },
        { name: 'showBrush', type: "boolean", default: "true", description: 'Enable brush selection on axes for filtering.' },
        { name: 'lineOpacity', type: "number", default: "0.5", description: 'Opacity of polylines (0-1).' },
        { name: 'showLabels', type: "boolean", default: "true", description: 'Display dimension labels above axes.' },
        { name: 'onBrush', type: "(selection: BrushSelection) => void", description: 'Callback when brush selection changes.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the multivariate analysis (e.g., "Parallel coordinates plot comparing cars across 5 dimensions")' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table' },
        ],
        screenReader: 'Due to visual complexity, parallel coordinates are difficult for screen readers. Provide a comprehensive data table alternative. Announce brush selections and filtered counts.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between axes' },
            { key: 'Arrow Up/Down', action: 'Adjust brush selection on focused axis' },
            { key: 'Escape', action: 'Clear all brush selections' },
        ],
    },
};

export default ParallelCoordinatesPlotDoc;
