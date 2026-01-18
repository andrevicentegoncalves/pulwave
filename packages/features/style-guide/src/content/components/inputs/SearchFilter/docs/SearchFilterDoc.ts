import { ComponentDoc } from '@pulwave/features-style-guide';

/**
 * SearchFilterDoc - Documentation for SearchFilter component
 */
const SearchFilterDoc: ComponentDoc = {
    name: 'SearchFilter',
    subtitle: 'Search input with expandable filter panel.',
    description: 'A search input combined with an expandable filter panel for complex filtering scenarios.',
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
        'Searching with additional criteria (filters)',
        'Complex data tables or lists',
        'When screen real estate is limited (expandable filters)',
        'Multi-criteria filtering interfaces',
        'Advanced search functionality',
    ],

    whenNotToUse: [
        { text: 'Simple search without filters', alternative: 'SearchInput component' },
        { text: 'Always-visible filters', alternative: 'Sidebar or Filter Bar' },
        { text: 'Single filter criterion', alternative: 'Select with search' },
    ],

    overview: {
        description: 'Combines a search bar with a toggleable area for additional filter controls. Displays active filters as removable badges.',
        variants: ['default'],
        demos: []
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Toggle', description: 'Button to expand/collapse filter panel' },
                { name: '2. Search Input', description: 'Main search field with clear button' },
                { name: '3. Filter Panel', description: 'Expandable area for additional controls' },
                { name: '4. Active Filters', description: 'Badges showing currently applied filters' },
                { name: '5. Actions', description: 'Search and Reset buttons in panel' },
            ]
        },
        emphasis: 'Active filters prominently displayed as removable badges.',
        alignment: 'Filter panel expands below the search bar.',
    },

    content: {
        mainElements: 'Search placeholder and filter labels should be clear.',
        overflowContent: 'Many active filters wrap to multiple lines.',
        internationalization: 'Placeholders, labels, and button text should be translatable.',
    },

    designRecommendations: [
        'Show filter count when panel is collapsed.',
        'Display active filters as removable chips.',
        'Provide clear and reset actions.',
        'Group related filters logically.',
        'Consider debouncing search input.',
    ],

    developmentConsiderations: [
        'Support controlled and uncontrolled expanded state.',
        'Handle filter removal callbacks.',
        'Debounce search input for performance.',
        'Maintain filter state on panel toggle.',
        'Support keyboard navigation in filter panel.',
    ],

    props: [
        { name: 'placeholder', type: 'string', defaultValue: '"Search..."', description: 'Placeholder text for search input' },
        { name: 'onSearch', type: '(term: string) => void', description: 'Callback when search is triggered or input changes' },
        { name: 'onReset', type: '() => void', description: 'Callback when Reset button is clicked' },
        { name: 'isExpanded', type: 'boolean', defaultValue: 'false', description: 'Controlled expanded state of filter panel' },
        { name: 'activeFilters', type: '(string | ActiveFilter)[]', defaultValue: '[]', description: 'List of active filters to display as badges' },
        { name: 'children', type: 'ReactNode', description: 'Content of the filter panel (form controls)' },
        { name: 'className', type: 'string', description: 'Additional CSS class' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between search, toggle, and filters' },
            { key: 'Enter', action: 'Submit search or toggle filter panel' },
            { key: 'Escape', action: 'Collapse filter panel' },
        ],
        aria: [
            { attribute: 'role="search"', usage: 'Identifies search region' },
            { attribute: 'aria-expanded', usage: 'Indicates filter panel state' },
            { attribute: 'aria-controls', usage: 'References the filter panel' },
        ],
        screenReader: 'Announces search field, filter toggle state, and active filters.',
        focusIndicator: 'Focus ring on all interactive elements.',
    },

    relatedComponents: [
        { name: 'SearchInput', description: 'Simple search input', path: 'components/inputs/search-input' },
        { name: 'Tag', description: 'Active filter display', path: 'components/data-display/tag' },
        { name: 'DataTable', description: 'Often used with tables', path: 'components/data-display/data-table' },
    ],
};

export default SearchFilterDoc;
