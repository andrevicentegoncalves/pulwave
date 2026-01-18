import NestedSidebarBasicDemo from '../demos/NestedSidebarBasicDemo';
import { ComponentDoc } from '@pulwave/features-style-guide';

const NestedSidebarDoc: ComponentDoc = {
    name: 'NestedSidebar',
    subtitle: 'Multi-level sidebar navigation with search.',
    description: 'Multi-level sidebar navigation with search functionality for complex hierarchical structures.',
    status: 'stable',
    version: '1.0.0',
    lastUpdated: '2026-01-17',

    accessibilityStatus: {
        keyboard: 'pass' as const,
        screenReader: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
    },

    whenToUse: [
        'Use for complex applications with deep navigation hierarchies',
        'Applications requiring searchable navigation',
        'Documentation sites with many sections',
        'Admin panels with categorized features',
        'Multi-tenant applications with scoped navigation',
    ],

    whenNotToUse: [
        { text: 'Simple flat navigation', alternative: 'Menu component' },
        { text: 'Top-level navigation only', alternative: 'Navbar component' },
        { text: 'Content tab switching', alternative: 'Tabs component' },
    ],

    overview: {
        description: 'NestedSidebar provides a hierarchical navigation structure with support for sections, categories, and items. It includes built-in search functionality to filter navigation items.',
        variants: ['default'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Multi-level sidebar navigation with search.',
                component: NestedSidebarBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Search Input', description: 'Filter navigation items' },
                { name: '2. Section Header', description: 'Top-level grouping' },
                { name: '3. Category', description: 'Mid-level expandable group' },
                { name: '4. Navigation Item', description: 'Leaf-level clickable item' },
                { name: '5. Active Indicator', description: 'Highlights current selection' },
            ]
        },
        emphasis: 'Active section, category, and item clearly highlighted.',
        alignment: 'Hierarchical indentation shows nesting level.',
    },

    content: {
        mainElements: 'Section, category, and item labels should be descriptive.',
        overflowContent: 'Long labels truncate with tooltip on hover.',
        internationalization: 'All navigation labels should be translatable.',
    },

    designRecommendations: [
        'Limit hierarchy depth to 3 levels maximum.',
        'Use icons for sections and categories.',
        'Expand active path automatically.',
        'Show search when item count is high.',
        'Provide visual distinction between levels.',
    ],

    developmentConsiderations: [
        'Implement efficient search filtering.',
        'Handle deep navigation state.',
        'Support URL-based active state.',
        'Manage expanded/collapsed state.',
        'Consider virtualization for large navigation trees.',
    ],

    props: [
        { name: 'sections', type: 'NavigationItem[]', required: true, description: 'Hierarchical array of navigation items (sections -> categories -> items).' },
        { name: 'activeItem', type: 'string', description: 'ID of the currently active item.' },
        { name: 'activeCategory', type: 'string', description: 'ID of the currently active category.' },
        { name: 'activeSection', type: 'string', description: 'ID of the currently active section.' },
        { name: 'onSelect', type: '(itemId: string, categoryId: string, sectionId: string) => void', description: 'Callback fired when a navigation item is selected.' },
        { name: 'className', type: 'string', description: 'Additional CSS classes.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between search and navigation items' },
            { key: 'Enter/Space', action: 'Select item or toggle category' },
            { key: 'Arrow Up/Down', action: 'Navigate between visible items' },
            { key: 'Arrow Right', action: 'Expand category' },
            { key: 'Arrow Left', action: 'Collapse category or move to parent' },
        ],
        aria: [
            { attribute: 'role="navigation"', usage: 'Identifies navigation region' },
            { attribute: 'role="tree"', usage: 'For hierarchical structure' },
            { attribute: 'role="treeitem"', usage: 'For navigation items' },
            { attribute: 'aria-expanded', usage: 'For expandable sections/categories' },
            { attribute: 'aria-current', usage: 'Indicates active item' },
        ],
        screenReader: 'Announces navigation structure and active states.',
        focusIndicator: 'Focus ring on all interactive elements.',
    },

    relatedComponents: [
        { name: 'Menu', description: 'Simpler flat navigation', path: 'components/navigation/menu' },
        { name: 'TreeView', description: 'Data-focused hierarchical display', path: 'components/data-display/tree-view' },
        { name: 'SearchInput', description: 'Search functionality', path: 'components/inputs/search-input' },
    ],
};

export default NestedSidebarDoc;

