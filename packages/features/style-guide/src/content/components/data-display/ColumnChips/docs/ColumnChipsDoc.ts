import { ComponentDoc } from '@pulwave/features-style-guide';
import * as ColumnChipsDemos from '../demos';

export const ColumnChipsDoc: ComponentDoc = {
    name: 'ColumnChips',
    description: 'A component to visualize selected tables and columns, often used in query builders, data export interfaces, or database schema displays.',
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
        'Query builder interfaces showing selected fields',
        'Data export configuration with column selection',
        'Database schema visualization',
        'Report builder column selections',
        'API field selection displays',
    ],

    whenNotToUse: [
        { text: 'Simple tag/chip displays', alternative: 'Chip or Tag component' },
        { text: 'Generic multi-select', alternative: 'MultiSelect or Combobox' },
        { text: 'Hierarchical data without columns', alternative: 'TreeView component' },
        { text: 'Flat list of items', alternative: 'DataList or Stack' },
    ],

    overview: {
        description: 'Displays a set of tables and their associated columns with optional edit controls.',
        variants: ['default', 'editable'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Displays a set of tables and their associated columns.',
                component: ColumnChipsDemos.ColumnChipsBasicDemo,
            },
        ],
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Table Chip', description: 'Container representing a database table' },
                { name: '2. Column Chips', description: 'Nested chips for table columns' },
                { name: '3. Remove Buttons', description: 'Delete controls when editable' },
                { name: '4. Overflow Indicator', description: '+N when exceeding limits' },
            ]
        },
        emphasis: 'Table names should be visually distinct from column names. Use consistent chip sizing.',
        alignment: 'Tables flow horizontally with wrapping. Columns nested within each table chip.',
    },

    content: {
        mainElements: 'Table chips containing column chips. Structure reflects database schema hierarchy.',
        overflowContent: 'Limits control visible items. Overflow shows +N indicator. Tooltip shows hidden items.',
        internationalization: 'Table and column names come from data. Remove button labels should be translatable.',
    },

    props: [
        { name: 'data', type: 'Record<string, string[]>', required: false, description: 'Map of table names to their column arrays.' },
        { name: 'onRemove', type: '(table: string) => void', required: false, description: 'Handler called when removing an entire table.' },
        { name: 'onRemoveColumn', type: '(table: string, column: string) => void', required: false, description: 'Handler called when removing a specific column.' },
        { name: 'editable', type: 'boolean', required: false, defaultValue: 'false', description: 'Show remove buttons for editing selections.' },
        { name: 'maxTablesShown', type: 'number', required: false, defaultValue: '5', description: 'Maximum number of visible tables before overflow.' },
        { name: 'maxColumnsShown', type: 'number', required: false, defaultValue: '3', description: 'Maximum columns shown per table before overflow.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between chips and remove buttons' },
            { key: 'Delete/Backspace', action: 'Remove focused item when editable' },
            { key: 'Enter/Space', action: 'Activate remove button' },
        ],
        aria: [
            { attribute: 'role="group"', usage: 'Groups table with its columns' },
            { attribute: 'aria-label', usage: 'Describes the selection (e.g., "Selected columns")' },
            { attribute: 'aria-describedby', usage: 'Links to helper text explaining the selection' },
        ],
        screenReader: 'Announces: "Table [name] with [N] columns: [column list]". Remove buttons announce their action.',
        focusIndicator: 'Focus ring on individual chips and remove buttons',
    },

    relatedComponents: [
        { name: 'Chip', description: 'Individual chip component', path: 'components/data-display/chip' },
        { name: 'Tag', description: 'Simple tag display', path: 'components/data-display/tag' },
        { name: 'TreeView', description: 'Hierarchical data display', path: 'components/data-display/tree-view' },
    ],
};

export default ColumnChipsDoc;
