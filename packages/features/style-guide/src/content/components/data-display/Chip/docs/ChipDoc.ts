import { ComponentDoc } from '@pulwave/features-style-guide';
import { ChipBasicDemo, ChipSelectableDemo } from '../demos';

const ChipDoc: ComponentDoc = {
    name: 'Chip',
    subtitle: 'Compact interactive elements for selections.',
    description: 'Chip is a compact, interactive element used for selections, filtering, or input, representing user inputs, attributes, or actions in a visually distinct container.',
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
        'User input (e.g. entering tags)',
        'Making selections from a group',
        'Filtering content',
        'Complex entities (avatar + text)',
        'Removable selected items',
    ],

    whenNotToUse: [
        { text: 'Static categorization', alternative: 'Tag component' },
        { text: 'Status indicators', alternative: 'Badge component' },
        { text: 'Primary actions', alternative: 'Button component' },
        { text: 'Navigation', alternative: 'Link or Button' },
    ],

    overview: {
        description: 'Chips are compact elements that represent an input, attribute, or action.',
        variants: ['outline', 'filled', 'subtle', 'ghost'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard chips with various variants.',
                component: ChipBasicDemo,
            },
            {
                name: 'Selectable',
                description: 'Chips can be selected and deselected.',
                component: ChipSelectableDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Container', description: 'Chip outer container' },
                { name: '2. Avatar/Icon', description: 'Optional leading visual' },
                { name: '3. Label', description: 'Text content' },
                { name: '4. Remove Button', description: 'Optional close/remove action' },
            ]
        },
        emphasis: 'Selected state should be clearly visible.',
        alignment: 'Inline with other chips or content.',
    },

    content: {
        mainElements: 'Keep chip labels short (1-3 words).',
        overflowContent: 'Labels truncate with ellipsis if too long.',
        internationalization: 'Labels should be translatable.',
    },

    designRecommendations: [
        'Keep chip labels concise.',
        'Use consistent sizing within a chip group.',
        'Provide clear visual feedback for selected state.',
        'Include remove button for user-created chips.',
    ],

    developmentConsiderations: [
        'Handle both click and keyboard interactions.',
        'Support controlled and uncontrolled selection.',
        'Manage chip groups for multi-select scenarios.',
        'Ensure proper focus management in groups.',
    ],

    props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Chip label content.' },
        { name: 'variant', type: '"outline" | "filled" | "subtle" | "ghost"', required: false, description: 'Visual style.', defaultValue: '"outline"' },
        { name: 'size', type: '"s" | "m"', required: false, description: 'Size variant.', defaultValue: '"m"' },
        { name: 'selected', type: 'boolean', required: false, description: 'Selection state.', defaultValue: 'false' },
        { name: 'onSelect', type: '() => void', required: false, description: 'Callback when clicked for selection.' },
        { name: 'removable', type: 'boolean', required: false, description: 'Whether the chip shows a remove button.', defaultValue: 'false' },
        { name: 'onRemove', type: '() => void', required: false, description: 'Callback when remove button is clicked.' },
        { name: 'avatar', type: 'ReactNode', required: false, description: 'Avatar element to display.' },
        { name: 'icon', type: 'ReactNode', required: false, description: 'Icon element to display.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Focus the chip' },
            { key: 'Enter/Space', action: 'Toggle selection or activate' },
            { key: 'Delete/Backspace', action: 'Remove chip (if removable)' },
        ],
        aria: [
            { attribute: 'role="button"', usage: 'For interactive chips' },
            { attribute: 'aria-pressed', usage: 'For selectable chips' },
            { attribute: 'aria-label', usage: 'On remove button' },
        ],
        screenReader: 'Announces chip label and selected/pressed state.',
        focusIndicator: 'Focus ring around the chip.',
    },

    relatedComponents: [
        { name: 'Tag', description: 'Static categorization labels', path: 'components/data-display/tag' },
        { name: 'Badge', description: 'Status indicators', path: 'components/data-display/badge' },
        { name: 'Button', description: 'Primary actions', path: 'components/actions/button' },
    ],
};

export default ChipDoc;
