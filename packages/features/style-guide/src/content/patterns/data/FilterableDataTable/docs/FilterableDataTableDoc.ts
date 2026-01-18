import { ComponentDoc } from '@pulwave/features-style-guide';
import { FilterableDataTableBasicDemo } from '../demos';

export const FilterableDataTableDoc: ComponentDoc = {
    name: 'FilterableDataTable',
    subtitle: 'Search, filter, and display data.',
    description: 'FilterableDataTable is a composite pattern combining Search, Filtering, and DataTable into a unified interface for data exploration and management workflows.',
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
        'Data management pages with search and filtering',
        'Admin panels with entity listings',
        'Dashboard tables with quick filters',
        'Resource browsers with faceted search',
        'Report tables with configurable columns',
    ],

    whenNotToUse: [
        { text: 'Simple static tables', alternative: 'DataTable without filters' },
        { text: 'Card-based layouts', alternative: 'CardGrid with SearchFilter' },
        { text: 'Tree-structured data', alternative: 'TreeView component' },
        { text: 'Read-only displays', alternative: 'DataList component' },
    ],

    overview: {
        description: 'A composite pattern combining Search, Filtering, and DataTable.',
        variants: ['default'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard configuration with search, column filters, and actions.',
                component: FilterableDataTableBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Search Bar', description: 'Text input for full-text search' },
                { name: '2. Filter Controls', description: 'Dropdowns, toggles for filtering' },
                { name: '3. Action Buttons', description: 'Export, add, bulk actions' },
                { name: '4. Data Table', description: 'Sortable, paginated data display' },
            ]
        },
        emphasis: 'Search is prominent. Filters are contextual. Actions right-aligned.',
        alignment: 'Toolbar above table. Search left, filters center, actions right.',
    },

    content: {
        mainElements: 'Search input, filter controls, action buttons, and data table.',
        overflowContent: 'Table scrolls horizontally on mobile. Pagination handles large datasets.',
        internationalization: 'Placeholder text, column headers, and labels should be translatable.',
    },

    designRecommendations: [
        'Keep filter controls relevant to the data being displayed.',
        'Use consistent column ordering across similar tables.',
        'Provide clear empty states when filters return no results.',
    ],

    developmentConsiderations: [
        'Manage filter state in parent component or URL params.',
        'Use debounced search for performance.',
        'Consider server-side pagination for large datasets.',
    ],

    props: [
        { name: 'data', type: 'T[]', required: true, description: 'Array of data objects to display.' },
        { name: 'columns', type: 'DataTableColumn[]', required: true, description: 'Column definitions for the table.' },
        { name: 'onSearch', type: '(term: string) => void', required: false, description: 'Callback for search term changes.' },
        { name: 'filterControls', type: 'ReactNode', required: false, description: 'Custom filter components to render in the header.' },
        { name: 'actions', type: 'ReactNode', required: false, description: 'Action buttons to render in the top right.' },
        { name: 'loading', type: 'boolean', required: false, description: 'Loading state for the table.', defaultValue: 'false' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between controls and table' },
            { key: 'Enter', action: 'Submit search or activate button' },
            { key: 'Arrow Keys', action: 'Navigate table rows when focused' },
            { key: 'Escape', action: 'Clear search or close dropdowns' },
        ],
        aria: [
            { attribute: 'role="search"', usage: 'Search region identification' },
            { attribute: 'aria-live="polite"', usage: 'Announces result count changes' },
            { attribute: 'aria-busy', usage: 'Indicates loading state' },
        ],
        screenReader: 'Announces: "[N] results found" after search/filter. Table headers announce sort state.',
        focusIndicator: 'Focus ring on all interactive elements.',
    },

    relatedComponents: [
        { name: 'DataTable', description: 'Table without filters', path: 'components/data-display/data-table' },
        { name: 'SearchFilter', description: 'Search with advanced filters', path: 'patterns/search/search-filter' },
        { name: 'ExportData', description: 'Export table data', path: 'patterns/data/export-data' },
    ],
};

export default FilterableDataTableDoc;
