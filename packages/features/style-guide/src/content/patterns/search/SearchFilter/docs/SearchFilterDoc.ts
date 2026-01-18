import { ComponentDoc } from '@pulwave/features-style-guide';
import SearchFilterBasicDemo from '../demos/SearchFilterBasicDemo';

export const SearchFilterDoc: ComponentDoc = {
    name: 'SearchFilter',
    subtitle: 'Search with advanced filtering.',
    description: 'SearchFilter is a composite component providing search functionality with an expandable panel for advanced filtering criteria, commonly used in data-heavy interfaces.',
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
        'Data tables with complex filtering needs',
        'Search pages with multiple filter criteria',
        'Product catalogs with faceted search',
        'Admin interfaces with configurable views',
        'Any list view requiring advanced filtering',
    ],

    whenNotToUse: [
        { text: 'Simple keyword search', alternative: 'SearchInput component' },
        { text: 'Single filter criterion', alternative: 'Select or toggle filter' },
        { text: 'Command palette search', alternative: 'CommandPalette component' },
        { text: 'Autocomplete search', alternative: 'Combobox component' },
    ],

    overview: {
        description: 'Search input with expandable advanced filter panel.',
        variants: ['default', 'with-filters'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Search filter with expandable panel.',
                component: SearchFilterBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Search Input', description: 'Primary text search field' },
                { name: '2. Filter Toggle', description: 'Expand/collapse filter panel' },
                { name: '3. Active Filters', description: 'Badges showing applied filters' },
                { name: '4. Filter Panel', description: 'Expandable advanced filters' },
                { name: '5. Reset Button', description: 'Clear all filters' },
            ]
        },
        emphasis: 'Search input is primary. Filter panel reveals on demand.',
        alignment: 'Search input full-width. Filters expand below.',
    },

    content: {
        mainElements: 'Search input with filter toggle, active filter badges, and expandable panel.',
        overflowContent: 'Filter panel scrolls if many filters. Active filters wrap to new lines.',
        internationalization: 'Placeholder text, filter labels, and badges should be translatable.',
    },

    designRecommendations: [
        'Keep commonly used filters visible; hide advanced options in panel.',
        'Show active filter badges for quick visibility and removal.',
        'Provide a clear reset option for all filters.',
        'Use consistent filter types (select, checkbox, date range).',
    ],

    developmentConsiderations: [
        'Debounce search input for performance.',
        'Manage filter state in parent component or URL params.',
        'Consider server-side filtering for large datasets.',
        'Reset should clear both search and all filters.',
    ],

    props: [
        { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text for the search input.', defaultValue: '"Search..."' },
        { name: 'onSearch', type: '(term: string) => void', required: true, description: 'Callback fired when search is executed.' },
        { name: 'onReset', type: '() => void', required: false, description: 'Callback fired when filters are reset.' },
        { name: 'activeFilters', type: 'ActiveFilter[]', required: false, description: 'Array of active filter badges to display.' },
        { name: 'isExpanded', type: 'boolean', required: false, description: 'Controlled expanded state of the filter panel.' },
        { name: 'onToggleExpand', type: '() => void', required: false, description: 'Callback when filter panel is toggled.' },
        { name: 'children', type: 'ReactNode', required: false, description: 'Content to render inside the expandable filter panel.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Enter', action: 'Submit search' },
            { key: 'Escape', action: 'Clear search or close filter panel' },
            { key: 'Tab', action: 'Navigate between search and filters' },
            { key: 'Backspace', action: 'Remove last active filter (when focused)' },
        ],
        aria: [
            { attribute: 'role="search"', usage: 'Identifies search region' },
            { attribute: 'aria-expanded', usage: 'Filter panel expansion state' },
            { attribute: 'aria-controls', usage: 'Links toggle to filter panel' },
            { attribute: 'aria-live="polite"', usage: 'Announces result count changes' },
        ],
        screenReader: 'Announces: "[N] active filters. [M] results found". Filter changes announced.',
        focusIndicator: 'Focus ring on search input, toggle, and filter controls.',
    },

    relatedComponents: [
        { name: 'SearchInput', description: 'Simple search field', path: 'components/inputs/search-input' },
        { name: 'FilterableDataTable', description: 'Table with built-in search', path: 'patterns/data/filterable-data-table' },
        { name: 'Badge', description: 'Active filter badges', path: 'components/data-display/badge' },
    ],
};

export default SearchFilterDoc;
