import { ComponentDoc } from '@pulwave/features-style-guide';

/**
 * DataTableDoc - Documentation for DataTable component
 */
import { DataTableBasicDemo } from '../demos';

const DataTableDoc: ComponentDoc = {
    name: 'DataTable',
    subtitle: 'Feature-rich table for tabular data.',
    description: 'DataTable is a feature-rich table component for displaying and managing tabular data with sorting, filtering, pagination, row selection, and column customization.',
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
        'Displaying structured data',
        'Sortable and filterable lists',
        'Admin panels and dashboards',
        'CRUD operations on records',
        'Data exports and reporting',
    ],

    whenNotToUse: [
        { text: 'Simple lists', alternative: 'DataList component' },
        { text: 'Card-based layouts', alternative: 'CardGrid component' },
        { text: 'Key-value pairs', alternative: 'DataList component' },
        { text: 'Very large datasets', alternative: 'Virtualized table' },
    ],

    overview: {
        description: 'DataTable with sorting, filtering, pagination, and row selection.',
        variants: ['default', 'striped', 'compact'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard data table with sorting and filtering.',
                component: DataTableBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Header Row', description: 'Column headers with sort controls' },
                { name: '2. Body', description: 'Data rows' },
                { name: '3. Footer', description: 'Optional summary or pagination' },
                { name: '4. Selection Column', description: 'Checkboxes for row selection' },
                { name: '5. Actions Column', description: 'Row-level actions' },
            ]
        },
        emphasis: 'Column headers should clearly describe data.',
        alignment: 'Numbers right-aligned, text left-aligned.',
    },

    content: {
        mainElements: 'Column headers should be concise. Cell content should be scannable.',
        overflowContent: 'Long text truncates with tooltip. Tables scroll horizontally on overflow.',
        internationalization: 'Headers and data should be translatable. Number/date formatting respects locale.',
    },

    designRecommendations: [
        'Keep column count manageable (5-8 visible columns).',
        'Provide clear sorting indicators.',
        'Use pagination for large datasets.',
        'Include search/filter for data discovery.',
    ],

    developmentConsiderations: [
        'Implement efficient sorting algorithms.',
        'Support server-side pagination for large data.',
        'Handle column resizing and reordering.',
        'Consider virtualization for performance.',
    ],

    props: [
        { name: 'columns', type: 'Column[]', required: true, description: 'Column definitions.' },
        { name: 'data', type: 'T[]', required: true, description: 'Array of data rows.' },
        { name: 'sortable', type: 'boolean', required: false, description: 'Enable column sorting.', defaultValue: 'true' },
        { name: 'selectable', type: 'boolean', required: false, description: 'Enable row selection.', defaultValue: 'false' },
        { name: 'pagination', type: 'PaginationConfig', required: false, description: 'Pagination configuration.' },
        { name: 'onRowClick', type: '(row: T) => void', required: false, description: 'Row click handler.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between interactive elements' },
            { key: 'Arrow keys', action: 'Navigate cells' },
            { key: 'Space', action: 'Toggle row selection' },
            { key: 'Enter', action: 'Activate row or cell action' },
        ],
        aria: [
            { attribute: 'role="table"', usage: 'Identifies as table' },
            { attribute: 'aria-sort', usage: 'On sorted column headers' },
            { attribute: 'aria-selected', usage: 'On selected rows' },
        ],
        screenReader: 'Announces column headers and cell content. Sort state announced on column focus.',
        focusIndicator: 'Focus ring on interactive cells and controls.',
    },

    relatedComponents: [
        { name: 'DataList', description: 'For key-value data', path: 'components/data-display/data-list' },
        { name: 'Pagination', description: 'Page navigation', path: 'components/navigation/pagination' },
        { name: 'SearchFilter', description: 'Data filtering', path: 'components/inputs/search-filter' },
    ],
};

export default DataTableDoc;
