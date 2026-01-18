/**
 * BubblePackChartDoc - Documentation for BubblePackChart
 */
import * as BubblePackChartDemos from '../demos';

const BubblePackChartDoc = {
    name: 'Bubble Pack Chart',
    description: 'Hierarchical data visualization using packed bubbles.',
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
        'Hierarchical data structures',
        'Comparing values across levels',
        'Visualizing clusters',
    ],

    whenNotToUse: [
        { text: 'Exact value comparisons', alternative: 'Bar Chart' },
        { text: 'Time series data', alternative: 'Line Chart' },
    ],

    overview: {
        description: 'Pack layout to display hierarchy as nested bubbles.',
        variants: ['default'],
        demos: [
            {
                name: 'Basic Bubble Pack',
                description: 'Nested bubble visualization.',
                component: BubblePackChartDemos.BubblePackChartBasicDemo,
            }
        ]
    },

    code: {
        primitives: ['ChartTooltip'],
        example: `<ChartProvider>
  <BubblePackChart
    data={hierarchyData}
    nameKey="name"
    valueKey="value"
  />
</ChartProvider>`,
    },

    props: [
        { name: 'data', type: 'HierarchyNode', required: true, description: 'Hierarchical data with nested children' },
        { name: 'nameKey', type: 'string', default: "'name'", description: 'Key for bubble label' },
        { name: 'valueKey', type: 'string', default: "'value'", description: 'Key for bubble size calculation' },
        { name: 'colorScheme', type: 'string[]', description: 'Array of colors for hierarchy levels' },
        { name: 'minRadius', type: 'number', default: '20', description: 'Minimum bubble radius in pixels' },
        { name: 'padding', type: 'number', default: '3', description: 'Padding between nested bubbles' },
        { name: 'showLabels', type: 'boolean', default: 'true', description: 'Display bubble labels' },
    ],

    // Formatting
    formatting: {
        anatomy: {
            parts: [
                { name: '1. Chart Container', description: 'SVG container for packed layout' },
                { name: '2. Bubbles', description: 'Circles representing hierarchical nodes' },
                { name: '3. Parent Bubbles', description: 'Larger circles containing children' },
                { name: '4. Leaf Bubbles', description: 'Smallest circles with no children' },
                { name: '5. Labels', description: 'Text showing bubble names and values' },
                { name: '6. Tooltip', description: 'Interactive details on hover' },
            ]
        },
        emphasis: 'Use color saturation to distinguish hierarchy levels. Brighter colors for leaf nodes, muted for parents.',
        alignment: 'Bubbles are algorithmically packed for optimal space usage. Labels centered within bubbles.',
    },

    // Content Guidelines
    content: {
        mainElements: 'Labels should show name and value. Use abbreviated numbers for large values (e.g., 1.2K, 3.5M).',
        overflowContent: 'Long labels should be hidden if bubble is too small. Full text shown in tooltip on hover.',
        internationalization: 'Format numbers according to locale. Use appropriate abbreviations (K, M, B) based on locale.',
        furtherGuidance: 'Use consistent color mapping for similar categories. Limit hierarchy depth to 3-4 levels for clarity.',
    },

    // Universal Behaviors
    universalBehaviors: {
        states: 'Bubbles support hover (highlighted), selected (emphasized), and zoomed (expanded) states.',
        interactions: {
            mouse: 'Hover bubbles to see tooltip with details. Click to zoom into parent bubble. Double-click to zoom out.',
            keyboard: 'Tab to navigate between bubbles. Enter to zoom in. Escape to zoom out. Arrow keys to move focus.',
        },
        loading: 'Show loading state during data processing. Animate bubble transitions on zoom.',
    },

    // Do's and Don'ts
    inUse: {
        dos: [
            'Use for comparing relative sizes within hierarchies',
            'Show 3-4 levels of hierarchy maximum',
            'Use consistent color scheme across related charts',
            'Provide zoom capability for deep hierarchies',
            'Display value abbreviations (K, M, B) for large numbers',
        ],
        donts: [
            "Don't use for precise value comparisons (use bar chart instead)",
            "Don't show more than 50-100 bubbles at once",
            "Don't use too many colors (limit to 7-10 distinct hues)",
            "Don't omit tooltips for detailed information",
            "Don't pack bubbles too tightly (min 3px padding)",
        ],
    },

    // Accessibility
    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between bubbles' },
            { key: 'Enter/Space', action: 'Zoom into parent bubble or select leaf' },
            { key: 'Escape', action: 'Zoom out to parent level' },
            { key: 'Arrow Keys', action: 'Navigate between sibling bubbles' },
            { key: 'Home', action: 'Return to root view' },
        ],
        aria: [
            { attribute: 'role="img"', usage: 'Applied to chart container' },
            { attribute: 'aria-label', usage: 'Describes chart purpose (e.g., "Bubble pack chart showing file sizes by category")' },
            { attribute: 'role="button"', usage: 'Applied to interactive parent bubbles' },
            { attribute: 'aria-expanded', usage: 'Indicates if parent bubble is zoomed (true/false)' },
            { attribute: 'aria-describedby', usage: 'Links to data table alternative' },
        ],
        screenReader: 'Chart announced as image with descriptive label. Hierarchy structure announced when navigating. Data table alternative provided.',
        focusIndicator: 'Bubbles show visible focus ring on keyboard navigation. Ring adjusts to bubble size.',
    },

    // Design Recommendations
    designRecommendations: [
        'Use sequential color schemes for hierarchy levels (light to dark)',
        'Ensure 3:1 contrast ratio for labels against bubble fill',
        'Provide sufficient padding between bubbles for visual separation',
        'Use stroke on focus to ensure visibility on all backgrounds',
        'Test with colorblind-friendly palettes',
    ],

    // Development Considerations
    developmentConsiderations: [
        'Wrap in ChartProvider for theme support',
        'Implement efficient packing algorithm for large datasets',
        'Provide data table alternative for screen readers',
        'Add zoom state management with smooth transitions',
        'Support keyboard navigation through hierarchy',
        'Optimize rendering for 100+ bubbles using virtualization',
    ],

    // Related Components
    relatedComponents: [
        { name: 'Tree Map', description: 'For rectangular hierarchy visualization', path: 'data-visualization/hierarchical/tree-map' },
        { name: 'Sunburst Chart', description: 'For radial hierarchy with clearer parent-child relationships', path: 'data-visualization/hierarchical/sunburst' },
        { name: 'Scatter Plot', description: 'For non-hierarchical bubble comparisons', path: 'data-visualization/scatter/scatter-plot' },
    ],
};

export default BubblePackChartDoc;

