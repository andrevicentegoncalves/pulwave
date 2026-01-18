import { ComponentDoc } from '@pulwave/features-style-guide';

/**
 * TreeViewDoc - Documentation for TreeView component
 */
const TreeViewDoc: ComponentDoc = {
    name: 'TreeView',
    subtitle: 'Hierarchical data display with expandable nodes.',
    description: 'TreeView displays hierarchical data with expandable nodes, supporting selection, drag-and-drop, and keyboard navigation for file browsers, category trees, and nested data structures.',
    status: 'stable',
    version: '1.0.0',
    lastUpdated: '2026-01-17',

    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    whenToUse: [
        'File system views',
        'Category navigation',
        'Nested data structures',
        'Organization hierarchies',
        'Folder/document navigation',
    ],

    whenNotToUse: [
        { text: 'Flat lists', alternative: 'DataList component' },
        { text: 'Single-level selection', alternative: 'Menu or Select' },
        { text: 'Sequential content', alternative: 'Accordion component' },
        { text: 'Simple parent-child', alternative: 'Nested sidebar' },
    ],

    overview: {
        description: 'TreeView with expand/collapse, selection, and drag-drop support.',
        variants: ['default', 'selectable', 'draggable'],
        demos: []
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Root Container', description: 'Tree wrapper element' },
                { name: '2. Tree Node', description: 'Individual item in hierarchy' },
                { name: '3. Expand/Collapse Icon', description: 'Toggle for child visibility' },
                { name: '4. Node Content', description: 'Label, icon, or custom content' },
                { name: '5. Indentation', description: 'Visual depth indicator' },
            ]
        },
        emphasis: 'Expand icons clearly indicate expandable nodes.',
        alignment: 'Nodes indented based on depth level.',
    },

    content: {
        mainElements: 'Node labels should be concise and descriptive.',
        overflowContent: 'Long labels truncate. Consider tooltip for full text.',
        internationalization: 'Node labels should be translatable.',
    },

    designRecommendations: [
        'Use consistent indentation for clarity.',
        'Provide visual feedback for expanded state.',
        'Limit visible depth for usability.',
        'Consider lazy loading for large trees.',
    ],

    developmentConsiderations: [
        'Support lazy loading of children.',
        'Handle selection state efficiently.',
        'Implement accessible drag-and-drop.',
        'Support keyboard navigation fully.',
    ],

    props: [
        { name: 'data', type: 'TreeNode[]', required: true, description: 'Hierarchical tree data.' },
        { name: 'selectable', type: 'boolean', required: false, description: 'Enable node selection.', defaultValue: 'false' },
        { name: 'draggable', type: 'boolean', required: false, description: 'Enable drag-and-drop.', defaultValue: 'false' },
        { name: 'expandedIds', type: 'string[]', required: false, description: 'Controlled expanded node IDs.' },
        { name: 'selectedIds', type: 'string[]', required: false, description: 'Controlled selected node IDs.' },
        { name: 'onExpand', type: '(id: string) => void', required: false, description: 'Callback when node expanded.' },
        { name: 'onSelect', type: '(id: string) => void', required: false, description: 'Callback when node selected.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Arrow Right', action: 'Expand node or move to first child' },
            { key: 'Arrow Left', action: 'Collapse node or move to parent' },
            { key: 'Arrow Up/Down', action: 'Navigate between visible nodes' },
            { key: 'Enter/Space', action: 'Select node or activate action' },
            { key: 'Home/End', action: 'Jump to first/last node' },
        ],
        aria: [
            { attribute: 'role="tree"', usage: 'Container role' },
            { attribute: 'role="treeitem"', usage: 'Individual nodes' },
            { attribute: 'aria-expanded', usage: 'On expandable nodes' },
            { attribute: 'aria-selected', usage: 'On selected nodes' },
        ],
        screenReader: 'Announces node label, expanded state, and depth level.',
        focusIndicator: 'Focus ring on current node.',
    },

    relatedComponents: [
        { name: 'Accordion', description: 'For sequential expandable sections', path: 'components/data-display/accordion' },
        { name: 'Menu', description: 'For flat navigation', path: 'components/navigation/menu' },
        { name: 'NestedSidebar', description: 'For navigation hierarchies', path: 'components/navigation/nested-sidebar' },
    ],
};

export default TreeViewDoc;
