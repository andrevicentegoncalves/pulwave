/**
 * PaginationDoc - Documentation for Pagination component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import PaginationBasicDemo from '../demos/PaginationBasicDemo';

const PaginationDoc: ComponentDoc = {
    name: 'Pagination',
    subtitle: 'Navigation for paged content.',
    description: 'Pagination provides navigation controls for browsing through paged data sets, including page numbers, prev/next buttons, and optional page size selector.',
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
        'Splitting large datasets into pages',
        'Data table navigation',
        'Search results pagination',
        'Product catalog browsing',
        'Content archives and listings',
    ],

    whenNotToUse: [
        { text: 'Small lists (< 20 items)', alternative: 'Display all items or simple scrolling' },
        { text: 'Continuous content browsing', alternative: 'Infinite scroll pattern' },
        { text: 'Sequential content', alternative: 'Prev/Next only navigation' },
        { text: 'Real-time feeds', alternative: 'Live updates with scroll' },
    ],

    overview: {
        description: 'Pagination with page numbers, prev/next controls, and page size selector.',
        variants: ['default', 'simple', 'compact'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard pagination usage.',
                component: PaginationBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Previous Button', description: 'Navigate to previous page' },
                { name: '2. Page Numbers', description: 'Direct page navigation' },
                { name: '3. Ellipsis', description: 'Indicates skipped pages' },
                { name: '4. Next Button', description: 'Navigate to next page' },
                { name: '5. Page Size Selector', description: 'Items per page control' },
                { name: '6. Page Info', description: 'Current page/total info' },
            ]
        },
        emphasis: 'Current page is visually highlighted.',
        alignment: 'Centered or right-aligned below content.',
    },

    content: {
        mainElements: 'Page numbers, navigation buttons, optional page size and info.',
        overflowContent: 'Long page ranges collapse with ellipsis.',
        internationalization: 'Labels and button text should be translatable.',
    },

    designRecommendations: [
        'Show 5-7 page numbers with ellipsis for long ranges.',
        'Disable prev/next at boundaries, don\'t hide.',
        'Position consistently at bottom of paginated content.',
        'Consider compact variant for mobile views.',
    ],

    developmentConsiderations: [
        'Use controlled mode with currentPage and onPageChange.',
        'Calculate totalPages from totalItems and pageSize.',
        'Handle boundary cases (first/last page).',
        'Consider URL sync for shareable page states.',
    ],

    props: [
        { name: 'currentPage', type: 'number', required: true, description: 'Current active page (1-indexed).' },
        { name: 'totalPages', type: 'number', required: true, description: 'Total number of pages.' },
        { name: 'onPageChange', type: '(page: number) => void', required: true, description: 'Callback when page changes.' },
        { name: 'siblingCount', type: 'number', required: false, description: 'Pages to show around current.', defaultValue: '1' },
        { name: 'boundaryCount', type: 'number', required: false, description: 'Pages to show at start/end.', defaultValue: '1' },
        { name: 'pageSize', type: 'number', required: false, description: 'Items per page.' },
        { name: 'onPageSizeChange', type: '(size: number) => void', required: false, description: 'Callback when page size changes.' },
        { name: 'showPageSize', type: 'boolean', required: false, description: 'Show page size selector.', defaultValue: 'false' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between pagination controls' },
            { key: 'Enter/Space', action: 'Activate focused button' },
            { key: 'Arrow Keys', action: 'Navigate within page numbers' },
        ],
        aria: [
            { attribute: 'nav aria-label="Pagination"', usage: 'Landmark for navigation' },
            { attribute: 'aria-current="page"', usage: 'Marks current page button' },
            { attribute: 'aria-disabled', usage: 'Disabled prev/next buttons' },
            { attribute: 'aria-label', usage: 'Descriptive labels for buttons' },
        ],
        screenReader: 'Announces: "Page [N] of [Total]", "Go to page [N]".',
        focusIndicator: 'Visible focus ring on buttons and page numbers.',
    },

    relatedComponents: [
        { name: 'DataTable', description: 'Table with pagination', path: 'components/data-display/data-table' },
        { name: 'InfiniteScroll', description: 'Continuous loading', path: 'components/data-display/infinite-scroll' },
        { name: 'FilterableDataTable', description: 'Filterable table pattern', path: 'patterns/data/filterable-data-table' },
    ],
};

export default PaginationDoc;
