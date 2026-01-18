/**
 * ComboboxDoc - Documentation for Combobox component
 * 
 * Combobox is an autocomplete + select hybrid for searchable option selection.
 * Supports async search, creatable options, and keyboard navigation.
 * 
 * @version 1.0.0
 */
import { ComboboxDemo, ComboboxMultiDemo, ComboboxCreatableDemo, ComboboxVirtualDemo, ComboboxSizesDemo } from '../demos';

const ComboboxDoc = {
    name: 'Combobox',
    description: 'Autocomplete + Select hybrid for searchable option selection. Combines text input filtering with dropdown selection.',
    status: 'stable' as const,
    version: '1.0.0',
    lastUpdated: '2026-01-01',

    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    whenToUse: [
        'Long option lists that need filtering',
        'When users might not know exact option names',
        'Server-side search/autocomplete',
        'Tag input or multi-select with search',
        'Creating new options on the fly',
    ],

    whenNotToUse: [
        { text: 'Few options (< 5)', alternative: 'Select or RadioGroup' },
        { text: 'No search needed', alternative: 'Select' },
        { text: 'Free-form text input', alternative: 'Input' },
    ],

    componentComparison: [
        {
            component: 'Combobox',
            description: 'Searchable dropdown with autocomplete.',
            useWhen: 'Users need to search/filter options.',
            characteristics: ['Text input', 'Filtering', 'Async search'],
        },
        {
            component: 'Select',
            description: 'Static dropdown selection.',
            useWhen: 'Options are manageable without search.',
            characteristics: ['Click to open', 'No filtering', 'Tree support'],
        },
        {
            component: 'SearchInput',
            description: 'Text search with suggestions.',
            useWhen: "Searching content, not selecting from predefined options.",
            characteristics: ['Free-form', 'Suggestions', 'Navigation'],
        },
    ],

    overview: {
        description: 'Combobox provides an input field that filters a dropdown list of options. Users can type to filter, use keyboard navigation, and select options. Supports async search for server-side filtering and creatable mode for new options.',
        variants: ['single', 'multi', 'creatable', 'async'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard single-select combobox.',
                component: ComboboxDemo,
            },
            {
                name: 'Multi-select',
                description: 'Select multiple items with clearable tags.',
                component: ComboboxMultiDemo,
            },
            {
                name: 'Creatable',
                description: 'Allow users to create new options.',
                component: ComboboxCreatableDemo,
            },
            {
                name: 'Virtualized (10k items)',
                description: 'Efficiently renders large lists using the `virtualized` prop.',
                component: ComboboxVirtualDemo,
            },
            {
                name: 'Sizes',
                description: 'Size variants aligned with other form controls (xs, s, m, l, xl).',
                component: ComboboxSizesDemo,
            },
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: 'Control', description: 'Input container with search icon' },
                { name: 'Input', description: 'Text input for filtering' },
                { name: 'Clear button', description: 'Optional clear selection button' },
                { name: 'Dropdown', description: 'Floating options list' },
                { name: 'Option', description: 'Selectable item with optional icon/description' },
            ]
        },
        sizes: [
            { name: 'xs', description: 'Extra small, compact UI' },
            { name: 's', description: 'Small' },
            { name: 'm', description: 'Medium (default)' },
            { name: 'l', description: 'Large' },
        ],
    },

    props: [
        { name: 'options', type: 'ComboboxOption<T>[]', required: true, description: 'Available options' },
        { name: 'value', type: 'T', description: 'Selected value' },
        { name: 'onChange', type: '(value: T | undefined) => void', description: 'Change handler' },
        { name: 'onSearch', type: '(query: string) => void', description: 'Async search handler' },
        { name: 'placeholder', type: 'string', default: "'Search...'", description: 'Placeholder text' },
        { name: 'size', type: "'xs' | 's' | 'm' | 'l'", default: "'m'", description: 'Input size' },
        { name: 'clearable', type: 'boolean', default: 'true', description: 'Allow clearing' },
        { name: 'creatable', type: 'boolean', default: 'false', description: 'Allow creating new options' },
        { name: 'onCreate', type: '(inputValue: string) => void', description: 'Create option handler' },
        { name: 'loading', type: 'boolean', default: 'false', description: 'Loading state' },
        { name: 'emptyMessage', type: 'string', default: "'No results found'", description: 'Empty state message' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Arrow Down/Up', action: 'Navigate options' },
            { key: 'Enter', action: 'Select highlighted option' },
            { key: 'Escape', action: 'Close dropdown' },
            { key: 'Type', action: 'Filter options' },
        ],
        aria: [
            { attribute: 'role="combobox"', usage: 'Input element' },
            { attribute: 'role="listbox"', usage: 'Dropdown container' },
            { attribute: 'aria-expanded', usage: 'Open state' },
            { attribute: 'aria-activedescendant', usage: 'Highlighted option' },
        ],
    },

    inUse: {
        dos: [
            'Use for long option lists',
            'Provide meaningful placeholder',
            'Handle loading states for async search',
            'Show helpful empty messages',
        ],
        donts: [
            "Don't use for small option sets",
            "Don't disable keyboard navigation",
            "Don't ignore loading/error states",
        ],
        examples: [
            { title: 'Country Select', description: 'Search and select country', code: '<Combobox options={countries} placeholder="Select country" />' },
            { title: 'Async Search', description: 'Server-side filtering', code: '<Combobox options={results} onSearch={fetchResults} isLoading={loading} />' },
            { title: 'Multi-select', description: 'Select multiple options with tags', code: '<Combobox multiple options={options} value={selected} onChange={setSelected} />' },
        ]
    },

    relatedComponents: [
        { name: 'Select', description: 'Static dropdown selection' },
        { name: 'SearchInput', description: 'Free-form search' },
        { name: 'Input', description: 'Text input' },
    ],
};

export default ComboboxDoc;
