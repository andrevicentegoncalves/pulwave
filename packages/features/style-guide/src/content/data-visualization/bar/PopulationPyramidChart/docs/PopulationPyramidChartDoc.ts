import { PopulationPyramidChartBasicDemo } from '../demos';
import { ComponentDoc } from '@pulwave/features-style-guide';

const PopulationPyramidChartDoc: ComponentDoc = {
    name: 'PopulationPyramidChart',
    status: 'stable',
    version: '1.0.0',
    description: 'Back-to-back horizontal bar chart for visualizing the distribution of a population by age groups and gender. Also known as an age-sex pyramid.',

    whenToUse: [
        'Demographic analysis showing age and gender distribution',
        'Comparing two populations side by side (e.g., male vs female)',
        'Workforce composition analysis by age group',
        'Customer segmentation by age and category',
        'Historical demographic trend comparisons',
    ],

    whenNotToUse: [
        'Single population distribution - use a horizontal Bar Chart',
        'More than two categories to compare - use a grouped bar chart',
        'Non-demographic data without natural left/right split',
        'Time series data - use a Line or Area Chart',
    ],

    usage: `
\`\`\`tsx
import { PopulationPyramidChart, ChartProvider } from '@pulwave/ui/data-visualization';

const demographicData = [
    { ageGroup: '0-9', male: 5200, female: 4900 },
    { ageGroup: '10-19', male: 6100, female: 5800 },
    { ageGroup: '20-29', male: 7500, female: 7200 },
    { ageGroup: '30-39', male: 8200, female: 8100 },
    { ageGroup: '40-49', male: 7800, female: 7600 },
    { ageGroup: '50-59', male: 6500, female: 6800 },
    { ageGroup: '60-69', male: 4800, female: 5200 },
    { ageGroup: '70+', male: 3200, female: 4100 },
];

<ChartProvider>
  <PopulationPyramidChart
    data={demographicData}
    categoryKey="ageGroup"
    leftKey="male"
    rightKey="female"
    leftLabel="Male"
    rightLabel="Female"
    showLabels
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A population pyramid displays two horizontal bar charts facing opposite directions from a central axis. The vertical axis shows categories (typically age groups), while the horizontal axes show values (typically population counts). A center label and legend identify the two groups.',
        overflowContent: 'For many age groups, ensure adequate vertical spacing. Consider grouping fine-grained ages into broader categories. Scrolling may be needed for very detailed breakdowns.',
        internationalization: 'Number formatting should follow locale conventions. Labels for "Male" and "Female" or equivalent categories should be translatable. Consider that some cultures may have different conventions for left/right positioning.',
    },

    formatting: {
        emphasis: 'Use distinct, contrasting colors for the two sides. Traditional convention places males on the left (blue) and females on the right (pink/red), though any culturally appropriate colors work. The central axis should be clearly marked.',
        alignment: 'Center the pyramid within its container. Category labels can be placed on either side or in the center. Value scales should be symmetric for easy comparison.',
    },

    props: [
        { name: 'data', type: "object[]", required: true, description: 'Array of data objects with category and two value keys.' },
        { name: 'categoryKey', type: "string", required: true, description: 'Property name for the category labels (e.g., age groups).' },
        { name: 'leftKey', type: "string", required: true, description: 'Property name for the left-side values.' },
        { name: 'rightKey', type: "string", required: true, description: 'Property name for the right-side values.' },
        { name: 'leftLabel', type: "string", default: "'Left'", description: 'Display label for the left side (e.g., "Male").' },
        { name: 'rightLabel', type: "string", default: "'Right'", description: 'Display label for the right side (e.g., "Female").' },
        { name: 'leftColor', type: "string", default: "'primary'", description: 'Color for the left-side bars.' },
        { name: 'rightColor', type: "string", default: "'secondary'", description: 'Color for the right-side bars.' },
        { name: 'showLabels', type: "boolean", default: "false", description: 'Display value labels on or near bars.' },
        { name: 'height', type: "number", default: "400", description: 'Chart height in pixels.' },
        { name: 'barRadius', type: "number", default: "2", description: 'Corner radius for bars.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image for screen readers' },
            { attribute: 'aria-label', usage: 'Describes the pyramid purpose (e.g., "Population pyramid showing age distribution by gender")' },
            { attribute: 'aria-describedby', usage: 'Links to detailed data table for comprehensive access' },
        ],
        screenReader: 'Screen readers announce each age group with both left and right values. The dual-bar format is described as a comparison between two groups. A data table alternative is recommended for detailed analysis.',
        keyboard: [
            { key: 'Tab', action: 'Navigate to chart and legend elements' },
            { key: 'Arrow keys', action: 'Navigate between age groups (when focused)' },
        ],
    },

    demos: [
        {
            name: 'Basic Usage',
            description: 'A population pyramid comparing male and female distribution by age.',
            component: PopulationPyramidChartBasicDemo,
        },
    ],
};

export default PopulationPyramidChartDoc;
