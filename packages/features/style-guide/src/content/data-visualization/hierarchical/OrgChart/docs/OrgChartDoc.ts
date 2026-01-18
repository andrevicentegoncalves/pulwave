/**
 * OrgChartDoc - Documentation for OrgChart
 */
import * as OrgChartDemos from '../demos';

const OrgChartDoc = {
    name: 'Org Chart',
    description: 'Chart displaying the hierarchy of an organization.',
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
        'Displaying reporting structures',
        'Family trees',
    ],

    whenNotToUse: [
        { text: 'Non-hierarchical networks', alternative: 'Network' },
    ],

    overview: {
        description: 'Tree structure for organizational relationship.',
        variants: ['vertical', 'horizontal'],
        demos: [
            {
                name: 'Basic Org Chart',
                description: 'Organizational hierarchy visualization.',
                component: OrgChartDemos.OrgChartBasicDemo,
            }
        ]
    },

    code: {
        primitives: ['ChartTooltip'],
        example: `<ChartProvider>
  <OrgChart
    data={orgData}
    nodeComponent={CustomNode}
  />
</ChartProvider>`,
    },

    props: [
        { name: 'data', type: 'OrgNode[]', required: true, description: 'Organization data with parent-child relationships' },
        { name: 'nodeComponent', type: 'React.Component', description: 'Custom node renderer for org chart nodes' },
        { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Chart layout direction' },
        { name: 'nodeWidth', type: 'number', default: '200', description: 'Width of each node in pixels' },
        { name: 'nodeHeight', type: 'number', default: '80', description: 'Height of each node in pixels' },
        { name: 'levelGap', type: 'number', default: '100', description: 'Vertical gap between hierarchy levels' },
        { name: 'siblingGap', type: 'number', default: '20', description: 'Horizontal gap between sibling nodes' },
    ],

    // Formatting
    formatting: {
        anatomy: {
            parts: [
                { name: '1. Chart Container', description: 'SVG container for hierarchical layout' },
                { name: '2. Nodes', description: 'Boxes representing individuals or entities' },
                { name: '3. Connectors', description: 'Lines showing reporting relationships' },
                { name: '4. Node Content', description: 'Name, title, and optional metadata' },
                { name: '5. Expand/Collapse Controls', description: 'Toggle visibility of sub-trees' },
            ]
        },
        emphasis: 'Use visual hierarchy to distinguish levels. Root node should be most prominent.',
        alignment: 'Center-align nodes under their parent. Maintain equal spacing between siblings.',
    },

    // Content Guidelines
    content: {
        mainElements: 'Node labels should show name and role/title. Keep text concise to avoid overflow.',
        overflowContent: 'Long names or titles should be truncated with ellipsis. Full text shown in tooltip on hover.',
        internationalization: 'Support RTL layouts by mirroring horizontal orientation. Use locale-appropriate name formatting.',
        furtherGuidance: 'Use consistent node styling across hierarchy. Indicate collapsed branches with visual cues.',
    },

    // Universal Behaviors
    universalBehaviors: {
        states: 'Nodes support hover (highlighted), selected (emphasized), expanded/collapsed states.',
        interactions: {
            mouse: 'Hover nodes to see full details in tooltip. Click to select. Click expand icon to toggle sub-tree.',
            keyboard: 'Arrow keys to navigate hierarchy. Enter/Space to expand/collapse. Tab to move between nodes.',
        },
        loading: 'Show skeleton nodes during data loading. Animate layout transitions when expanding/collapsing.',
    },

    // Do's and Don'ts
    inUse: {
        dos: [
            'Use clear visual hierarchy with consistent node sizing',
            'Show reporting lines clearly without overlaps',
            'Provide expand/collapse for large organizations',
            'Use tooltips for additional employee information',
            'Center root node at the top (vertical) or left (horizontal)',
        ],
        donts: [
            "Don't overcrowd nodes with too much text",
            "Don't use inconsistent node sizes across levels",
            "Don't cross reporting lines unnecessarily",
            "Don't show more than 50-100 nodes at once",
            "Don't omit expand/collapse controls for deep hierarchies",
        ],
    },

    // Accessibility
    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between nodes' },
            { key: 'Arrow Keys', action: 'Navigate hierarchy (Up/Down for levels, Left/Right for siblings)' },
            { key: 'Enter/Space', action: 'Expand/collapse node sub-tree' },
            { key: 'Home', action: 'Jump to root node' },
            { key: 'End', action: 'Jump to last visible node' },
        ],
        aria: [
            { attribute: 'role="tree"', usage: 'Applied to chart container' },
            { attribute: 'role="treeitem"', usage: 'Applied to each node' },
            { attribute: 'aria-expanded', usage: 'Indicates if node children are visible (true/false)' },
            { attribute: 'aria-level', usage: 'Indicates hierarchy depth (1 for root, 2 for direct reports, etc.)' },
            { attribute: 'aria-label', usage: 'Describes chart purpose (e.g., "Company organizational chart")' },
            { attribute: 'aria-posinset / aria-setsize', usage: 'Position and total siblings count' },
        ],
        screenReader: 'Chart announced as tree with navigable hierarchy. Each node announced with name, role, level, and expansion state.',
        focusIndicator: 'Nodes show visible focus ring on keyboard navigation. Expand/collapse icons receive focus.',
    },

    // Design Recommendations
    designRecommendations: [
        'Use subtle background colors to differentiate hierarchy levels',
        'Ensure 3:1 contrast for connector lines against background',
        'Provide sufficient touch targets (min 44x44px) for expand icons',
        'Use consistent avatar or icon placement within nodes',
        'Maintain clear visual separation between nodes (min 20px gap)',
    ],

    // Development Considerations
    developmentConsiderations: [
        'Implement virtual scrolling for large organizations (>100 nodes)',
        'Provide keyboard navigation with arrow keys',
        'Use ARIA tree role for proper screen reader support',
        'Add data table alternative for linear hierarchy view',
        'Implement expand/collapse state management',
        'Support zoom and pan for large hierarchies',
    ],

    // Related Components
    relatedComponents: [
        { name: 'Tree Map', description: 'For space-filling hierarchy visualization', path: 'data-visualization/hierarchical/tree-map' },
        { name: 'Sunburst Chart', description: 'For radial hierarchy visualization', path: 'data-visualization/hierarchical/sunburst' },
        { name: 'Network Graph', description: 'For non-hierarchical relationship networks', path: 'data-visualization/network/network-graph' },
    ],
};

export default OrgChartDoc;

