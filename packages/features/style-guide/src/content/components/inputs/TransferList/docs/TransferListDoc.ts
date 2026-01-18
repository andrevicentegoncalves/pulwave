import { ComponentDoc } from '@pulwave/features-style-guide';
import * as TransferListDemos from '../demos';

const doc: ComponentDoc = {
    name: 'TransferList',
    description: 'A dual-list component for shifting items between two lists, commonly used for permissions management, role assignment, or complex selection workflows.',
    id: 'transfer-list',
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
        'Permission and role assignment interfaces',
        'Moving items between available and selected lists',
        'Complex multi-select with source/target organization',
        'Feature flag or access control configuration',
        'Bulk assignment of items to categories',
    ],

    whenNotToUse: [
        { text: 'Simple multi-select', alternative: 'MultiSelect or Combobox' },
        { text: 'Single selection', alternative: 'Select or Radio' },
        { text: 'Few items (<10)', alternative: 'CheckboxGroup' },
        { text: 'Drag-and-drop ordering', alternative: 'Sortable list component' },
    ],

    overview: {
        description: 'Dual-list interface for transferring items between source and target lists.',
        variants: ['default', 'with-search'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard bi-directional transfer list with mock data.',
                component: TransferListDemos.TransferListDemo,
            },
        ],
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Source List', description: 'Available items to select from' },
                { name: '2. Target List', description: 'Currently selected items' },
                { name: '3. Transfer Buttons', description: 'Move items between lists' },
                { name: '4. List Headers', description: 'Titles and item counts' },
                { name: '5. Search Inputs', description: 'Optional filtering within lists' },
            ]
        },
        emphasis: 'Clear visual separation between source and target. Transfer buttons indicate direction.',
        alignment: 'Lists side-by-side with transfer buttons between. Full width in mobile.',
    },

    content: {
        mainElements: 'Two lists with selectable items and transfer controls between them.',
        overflowContent: 'Lists scroll independently. Search filters long lists.',
        internationalization: 'List titles and labels should be translatable. RTL layout reverses list positions.',
    },

    usage: `import { TransferList, TransferItem } from '@pulwave/ui';

const App = () => {
    const [targetKeys, setTargetKeys] = useState<string[]>([]);

    return (
        <TransferList
            dataSource={data}
            targetKeys={targetKeys}
            onChange={setTargetKeys}
            titles={['Source', 'Target']}
        />
    );
}`,

    props: [
        { name: 'dataSource', type: 'TransferItem[]', required: true, description: 'Array of data items to distribute between lists.' },
        { name: 'targetKeys', type: 'string[]', required: true, description: 'Keys of items currently in the target list.' },
        { name: 'onChange', type: '(nextTargetKeys, direction, moveKeys) => void', required: true, description: 'Callback when items are transferred between lists.' },
        { name: 'titles', type: '[string, string]', required: false, defaultValue: '["Source", "Target"]', description: 'Titles displayed above source and target lists.' },
        { name: 'showSearch', type: 'boolean', required: false, defaultValue: 'false', description: 'Enable search/filter functionality within lists.' },
        { name: 'disabled', type: 'boolean', required: false, defaultValue: 'false', description: 'Disable all interactions.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between lists and buttons' },
            { key: 'Space', action: 'Select/deselect item' },
            { key: 'Arrow Up/Down', action: 'Navigate within list' },
            { key: 'Enter', action: 'Activate transfer button' },
        ],
        aria: [
            { attribute: 'role="listbox"', usage: 'Each list is a listbox' },
            { attribute: 'aria-multiselectable', usage: 'Lists support multiple selection' },
            { attribute: 'aria-label', usage: 'Describes each list purpose' },
        ],
        screenReader: 'Announces list name, item count, and selection state. Transfer announces "N items moved to [list]".',
        focusIndicator: 'Focus ring on items and transfer buttons',
    },

    relatedComponents: [
        { name: 'Combobox', description: 'For simpler multi-select', path: 'components/inputs/combobox' },
        { name: 'CheckboxGroup', description: 'For smaller item sets', path: 'components/inputs/checkbox-group' },
        { name: 'DataTable', description: 'For tabular selection', path: 'components/data-display/data-table' },
    ],
};

export default doc;

