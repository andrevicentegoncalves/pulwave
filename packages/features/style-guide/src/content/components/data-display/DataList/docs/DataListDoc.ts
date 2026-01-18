/**
 * DataListDoc - Documentation for DataList component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import {
    DataListDraggableDemo,
    DataListSelectionDemo,
    DataListRichDemo
} from '../demos';

const DataListDoc: ComponentDoc = {
    name: 'DataList',
    subtitle: 'Structured list for displaying data.',
    description: 'DataList presents information in a structured list format with support for key-value pairs, drag-and-drop reordering, selection, and rich content.',
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
        'Displaying key-value pairs',
        'Record details view',
        'Summary information',
        'Reorderable lists',
        'Multi-select item lists',
    ],

    whenNotToUse: [
        { text: 'Tabular data with columns', alternative: 'DataTable component' },
        { text: 'Editable forms', alternative: 'Form components' },
        { text: 'Navigation menus', alternative: 'Menu component' },
        { text: 'Simple unstructured lists', alternative: 'Stack with items' },
    ],

    overview: {
        description: 'DataList presents information in a structured list format.',
        variants: ['default', 'selectable', 'draggable'],
        demos: [
            {
                name: 'Draggable List',
                description: 'Reorder items using drag and drop handles.',
                component: DataListDraggableDemo,
            },
            {
                name: 'Selectable List',
                description: 'Multi-select capability with counter.',
                component: DataListSelectionDemo,
            },
            {
                name: 'Rich Content',
                description: 'List items with complex content.',
                component: DataListRichDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. List Container', description: 'Wrapper for list items' },
                { name: '2. List Item', description: 'Individual row' },
                { name: '3. Label', description: 'Key or title text' },
                { name: '4. Value', description: 'Associated value or content' },
                { name: '5. Actions', description: 'Optional item actions' },
            ]
        },
        emphasis: 'Labels and values should have clear visual hierarchy.',
        alignment: 'Labels left-aligned, values can be left or right-aligned.',
    },

    content: {
        mainElements: 'Labels should be concise. Values can include rich content.',
        overflowContent: 'Long values truncate or wrap based on configuration.',
        internationalization: 'Labels and values should be translatable.',
    },

    designRecommendations: [
        'Use consistent label widths for alignment.',
        'Group related items visually.',
        'Provide clear drag handles for reorderable lists.',
        'Show selection count for multi-select lists.',
    ],

    developmentConsiderations: [
        'Implement accessible drag-and-drop.',
        'Handle selection state changes efficiently.',
        'Support keyboard navigation for all features.',
        'Consider virtualization for long lists.',
    ],

    props: [
        { name: 'items', type: 'DataListItem[]', required: true, description: 'Array of list items.' },
        { name: 'selectable', type: 'boolean', required: false, description: 'Enable item selection.', defaultValue: 'false' },
        { name: 'draggable', type: 'boolean', required: false, description: 'Enable drag-and-drop reordering.', defaultValue: 'false' },
        { name: 'selectedIds', type: 'string[]', required: false, description: 'Controlled selected item IDs.' },
        { name: 'onSelectionChange', type: '(ids: string[]) => void', required: false, description: 'Selection change callback.' },
        { name: 'onReorder', type: '(items: DataListItem[]) => void', required: false, description: 'Reorder callback.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between items' },
            { key: 'Space', action: 'Toggle item selection' },
            { key: 'Arrow Up/Down', action: 'Navigate items (in drag mode)' },
            { key: 'Space (hold)', action: 'Pick up item for dragging' },
        ],
        aria: [
            { attribute: 'role="list"', usage: 'Container role' },
            { attribute: 'role="listitem"', usage: 'Individual items' },
            { attribute: 'aria-selected', usage: 'For selectable items' },
        ],
        screenReader: 'Announces list items, selection state, and drag instructions.',
        focusIndicator: 'Focus ring on items and drag handles.',
    },

    relatedComponents: [
        { name: 'DataTable', description: 'For tabular data', path: 'components/data-display/data-table' },
        { name: 'Stack', description: 'Simple vertical layout', path: 'components/layout/stack' },
        { name: 'Card', description: 'Content containers', path: 'components/data-display/card' },
    ],
};

export default DataListDoc;
