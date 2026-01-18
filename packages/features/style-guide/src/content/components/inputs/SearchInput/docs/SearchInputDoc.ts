/**
 * SearchInputDoc - Documentation for SearchInput component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import { SearchInputBasicDemo, SearchInputSizesDemo } from '../demos';

const SearchInputDoc: ComponentDoc = {
    name: 'SearchInput',
    subtitle: 'Optimized input for search operations.',
    description: 'Specialized input for search operations with search icon and clear functionality.',
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
        'Global search bars',
        'Filtering lists or tables',
        'Looking up records',
        'Quick find functionality',
        'Header navigation search',
    ],

    whenNotToUse: [
        { text: 'Standard data entry', alternative: 'Input component' },
        { text: 'Filtering by category', alternative: 'Select component' },
        { text: 'Complex multi-criteria search', alternative: 'SearchFilter component' },
    ],

    overview: {
        description: 'Input with search icon and clear button optimized for search.',
        variants: ['default', 'global'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard search input with clear button.',
                component: SearchInputBasicDemo,
            },
            {
                name: 'Sizes',
                description: 'Size variants aligned with other form controls.',
                component: SearchInputSizesDemo,
            },
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Search Icon', description: 'Magnifying glass icon indicating search' },
                { name: '2. Input Field', description: 'Text input for search query' },
                { name: '3. Clear Button', description: 'Button to clear search text' },
            ]
        },
        emphasis: 'Search icon provides immediate visual recognition.',
        alignment: 'Inline with navigation or above content to filter.',
    },

    content: {
        mainElements: 'Placeholder should indicate what can be searched.',
        overflowContent: 'Long search queries scroll within the input.',
        internationalization: 'Placeholder text should be translatable.',
    },

    designRecommendations: [
        'Use clear placeholder text describing searchable content.',
        'Show clear button only when there is input.',
        'Consider search suggestions or autocomplete.',
        'Provide visual feedback during search.',
        'Use appropriate size for context (global vs inline).',
    ],

    developmentConsiderations: [
        'Debounce search input for performance.',
        'Support Enter key to submit search.',
        'Clear button should focus the input after clearing.',
        'Consider loading state during search.',
        'Handle empty search gracefully.',
    ],

    props: [
        { name: 'value', type: 'string', description: 'Controlled search value' },
        { name: 'defaultValue', type: 'string', description: 'Default search value (uncontrolled)' },
        { name: 'onChange', type: '(value: string) => void', description: 'Callback when search value changes' },
        { name: 'onSearch', type: '(value: string) => void', description: 'Callback when search is submitted' },
        { name: 'placeholder', type: 'string', defaultValue: '"Search..."', description: 'Placeholder text' },
        { name: 'size', type: '"s" | "m" | "l"', defaultValue: '"m"', description: 'Size variant' },
        { name: 'clearable', type: 'boolean', defaultValue: 'true', description: 'Show clear button when has value' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disabled state' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Enter', action: 'Submit search' },
            { key: 'Escape', action: 'Clear search input' },
        ],
        aria: [
            { attribute: 'role="search"', usage: 'Identify search context' },
            { attribute: 'aria-label', usage: 'Describes the search input purpose' },
        ],
        screenReader: 'Announces search input and clear button.',
        focusIndicator: 'Focus ring on the input field.',
    },

    relatedComponents: [
        { name: 'Input', description: 'Standard text input', path: 'components/inputs/input' },
        { name: 'SearchFilter', description: 'Search with filter panel', path: 'components/inputs/search-filter' },
        { name: 'Select', description: 'Dropdown with search', path: 'components/inputs/select' },
    ],
};

export default SearchInputDoc;
