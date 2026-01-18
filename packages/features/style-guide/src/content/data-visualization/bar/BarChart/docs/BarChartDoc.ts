/**
 * BarChartDoc - Documentation for BarChart
 */
import * as BarChartDemos from '../demos';

const BarChartDoc = {
    name: 'Bar Chart',
    description: 'Chart presenting data with rectangular bars. Supports vertical, horizontal, and stacked layouts.',
    status: 'stable' as const,
    version: '1.1.0',
    lastUpdated: '2026-01-03',

    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    whenToUse: [
        'Comparing categorical data',
        'Ranking items by value',
        'Distribution analysis',
    ],

    whenNotToUse: [
        { text: 'Continuous trends over time', alternative: 'Line Chart' },
        { text: 'Part-to-whole relationships', alternative: 'Pie Chart or Stacked Bar' },
    ],

    overview: {
        description: 'BarChart for categorical comparisons. Uses shared primitives for consistent styling and dark mode support.',
        variants: ['vertical', 'horizontal', 'stacked'],
        demos: [
            {
                name: 'Basic Bar Chart',
                description: 'Standard vertical bar chart.',
                component: BarChartDemos.BarChartBasicDemo,
            },
            {
                name: 'Grouped Bar Chart',
                description: 'Multiple series grouped by category.',
                component: BarChartDemos.BarChartGroupedDemo,
            },
            {
                name: 'Horizontal Bar Chart',
                description: 'Bars displayed horizontally.',
                component: BarChartDemos.BarChartHorizontalDemo,
            }
        ]
    },

    code: {
        primitives: [
            { name: 'useSeriesVisibility', description: 'Hook for legend toggle functionality' },
            { name: 'getAxisTickStyle', description: 'Returns tick styling from semanticColors' },
            { name: 'getChartMargins', description: 'Returns standard chart margins with horizontal bar support' },
            { name: 'ChartAxisTick', description: 'Custom tick with truncation and tooltip' },
        ],
        example: `import { BarChart, ChartProvider } from '@ui';

<ChartProvider>
  <BarChart 
    data={data}
    xKey="category"
    yKeys={['value']}
    layout="vertical"
    showLabels
  />
</ChartProvider>`
    },

    props: [
        { name: 'data', type: 'object[]', required: true, description: 'Data array' },
        { name: 'xKey', type: 'string', required: true, description: 'Key for X axis values' },
        { name: 'yKeys', type: 'string[]', required: true, description: 'Keys for Y axis series' },
        { name: 'layout', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Bar orientation' },
        { name: 'grouping', type: "'grouped' | 'stacked'", default: "'grouped'", description: 'Bar grouping mode' },
        { name: 'barRadius', type: 'number', default: '4', description: 'Bar corner radius' },
        { name: 'showLabels', type: 'boolean', default: 'false', description: 'Show value labels' },
    ],

    // Formatting
    formatting: {
        anatomy: {
            parts: [
                { name: '1. Chart Container', description: 'SVG container with responsive dimensions' },
                { name: '2. Axes', description: 'X and Y axes with labels and grid lines' },
                { name: '3. Bars', description: 'Rectangular data representations' },
                { name: '4. Legend', description: 'Series identification and toggle controls' },
                { name: '5. Tooltip', description: 'Interactive value display on hover' },
                { name: '6. Data Labels', description: 'Optional value labels on bars' },
            ]
        },
        emphasis: 'Use color to differentiate series. Highlight important categories with contrasting colors.',
        alignment: 'Align bars to a zero baseline. For horizontal layouts, align labels to the left.',
    },

    // Content Guidelines
    content: {
        mainElements: 'Axis labels should be concise (1-3 words). Use full category names on hover tooltips.',
        overflowContent: 'Long category names should be truncated with ellipsis. Full names shown in tooltips.',
        internationalization: 'Format numbers according to locale (thousands separators, decimal points). Support RTL layouts for horizontal bars.',
        furtherGuidance: 'Use consistent color mapping across related charts. Limit series to 5-7 for readability.',
    },

    // Universal Behaviors
    universalBehaviors: {
        states: 'Bars support hover (highlighted), selected (emphasized), and hidden (toggled via legend) states.',
        interactions: {
            mouse: 'Hover over bars to see tooltips with exact values. Click legend items to toggle series visibility.',
            keyboard: 'Tab to navigate between bars and legend. Enter/Space to toggle legend items.',
        },
        loading: 'Show skeleton bars during data loading. Animate bars on initial render.',
    },

    // Do's and Don'ts
    inUse: {
        dos: [
            'Start Y-axis at zero for accurate visual comparison',
            'Use consistent colors across related charts',
            'Limit series to 5-7 for clarity',
            'Show data labels for small datasets (<10 items)',
            'Use horizontal layout for long category names',
        ],
        donts: [
            "Don't use 3D effects or shadows",
            "Don't truncate Y-axis unless showing change over baseline",
            "Don't use too many colors (limit to 7 distinct hues)",
            "Don't stack unrelated metrics",
            "Don't omit axis labels",
        ],
    },

    // Accessibility
    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between bars and legend items' },
            { key: 'Enter/Space', action: 'Toggle legend item visibility' },
            { key: 'Arrow Keys', action: 'Navigate between bars (future enhancement)' },
        ],
        aria: [
            { attribute: 'role="img"', usage: 'Applied to chart container' },
            { attribute: 'aria-label', usage: 'Describes chart purpose (e.g., "Bar chart showing sales by region")' },
            { attribute: 'aria-describedby', usage: 'Links to data table for screen readers' },
            { attribute: 'role="button"', usage: 'Applied to legend items for toggling' },
        ],
        screenReader: 'Chart announced as image with descriptive label. Data table alternative provided for screen reader users. Legend items announced as toggleable buttons.',
        focusIndicator: 'Bars and legend items show visible focus ring on keyboard navigation.',
    },

    // Design Recommendations
    designRecommendations: [
        'Maintain 3:1 contrast ratio for bars against background',
        'Use semantic colors (success/error) for performance indicators',
        'Ensure sufficient spacing between bars for touch targets',
        'Provide data table alternative for accessibility',
    ],

    // Development Considerations
    developmentConsiderations: [
        'Wrap in ChartProvider for theme and responsive behavior',
        'Provide fallback data table for screen readers',
        'Use semantic HTML structure with proper ARIA labels',
        'Implement keyboard navigation for interactive elements',
        'Test with screen readers and keyboard-only navigation',
    ],

    // Related Components
    relatedComponents: [
        { name: 'Line Chart', description: 'For continuous trends over time', path: 'data-visualization/line/line-chart' },
        { name: 'Stacked Bar Chart', description: 'For part-to-whole comparisons', path: 'data-visualization/bar/stacked-bar-chart' },
        { name: 'Column Chart', description: 'Alternative term for vertical bar chart', path: 'data-visualization/bar/column-chart' },
    ],
};

export default BarChartDoc;
