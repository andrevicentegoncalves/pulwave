import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const PictogramChartDoc: ComponentDoc = {
    name: 'PictogramChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Uses repeated icons to represent quantities, making data more relatable and memorable. Each icon represents a unit value. Excellent for infographics, reports, and communicating statistics to general audiences.',

    whenToUse: [
        'Infographics for general audiences',
        'Making statistics more relatable (e.g., "1 in 4 people...")',
        'Reports and presentations needing visual impact',
        'Small to medium quantities (10-100 icons)',
        'When the icon metaphor strengthens understanding',
    ],

    whenNotToUse: [
        'Large values requiring thousands of icons',
        'Precise comparison between categories',
        'Scientific or technical audiences who prefer standard charts',
        'When no meaningful icon exists for the data',
        'Real-time data updates (icons are harder to animate)',
    ],

    usage: `
\`\`\`tsx
import { PictogramChart, ChartProvider } from '@pulwave/ui/data-visualization';

const surveyResults = [
    { category: 'Satisfied', value: 72, color: '#10B981' },
    { category: 'Neutral', value: 18, color: '#6B7280' },
    { category: 'Dissatisfied', value: 10, color: '#EF4444' },
];

<ChartProvider>
  <PictogramChart
    data={surveyResults}
    icon="person"
    valueKey="value"
    iconPerUnit={2}
    total={100}
    layout="grid"
    columns={10}
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A pictogram displays repeated icons where each icon represents a fixed value. Filled icons show the count, empty/grayed icons can show remaining capacity.',
        overflowContent: 'Works best with 20-100 icons. Very many icons become hard to count. Use iconPerUnit scaling (e.g., 1 icon = 1000 people) for large values.',
        internationalization: 'Category labels should be translatable. Icons are language-neutral. Format the scale legend according to locale.',
    },

    formatting: {
        emphasis: 'Choose icons that match the data context (people for population, trees for environmental data). Color-code by category. Use partial icons for remainders.',
        alignment: 'Grid layout is most common. Row layout works for bar-like comparison. Ensure consistent spacing between icons.',
    },

    props: [
        { name: 'data', type: "Array<{category, value, color?}>", required: true, description: 'Array of category objects with values.' },
        { name: 'icon', type: "string", default: "'circle'", description: 'Icon name, character, or emoji to represent units.' },
        { name: 'valueKey', type: "string", default: "'value'", description: 'Property name for category values.' },
        { name: 'iconPerUnit', type: "number", default: "1", description: 'Value each icon represents.' },
        { name: 'layout', type: "'grid' | 'row'", default: "'grid'", description: 'Arrangement of icons.' },
        { name: 'total', type: "number", description: 'Total capacity (shows unfilled icons for remainder).' },
        { name: 'columns', type: "number", default: "10", description: 'Number of columns in grid layout.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the data (e.g., "Pictogram showing 72% satisfied, 18% neutral, 10% dissatisfied")' },
            { attribute: 'aria-describedby', usage: 'Links to data summary' },
        ],
        screenReader: 'Screen readers announce each category with name, count, and percentage. State the scale (e.g., "each icon represents 2 responses").',
        keyboard: [
            { key: 'Tab', action: 'Navigate between categories' },
        ],
    },
};

export default PictogramChartDoc;
