import { ComponentDoc } from '@pulwave/features-style-guide';
import { TagBasicDemo, TagRemovableDemo } from '../demos';

export const TagDoc: ComponentDoc = {
    name: 'Tag',
    subtitle: 'Labels for categorization and metadata.',
    description: 'Tag provides visual labels for categorization, metadata, or keywords, helping users quickly identify and filter content.',
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
        'Categorizing content',
        'Displaying metadata labels',
        'Keywords and topic tags',
        'Filter indicators',
        'Article or content taxonomy',
    ],

    whenNotToUse: [
        { text: 'Status indication', alternative: 'Badge component' },
        { text: 'Complex selection inputs', alternative: 'Chip component' },
        { text: 'Navigation', alternative: 'Link or Button' },
        { text: 'Notification counts', alternative: 'Badge component' },
    ],

    overview: {
        description: 'Tags help categorize content or display metadata.',
        variants: ['solid', 'subtle', 'outline'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard tags for categorization.',
                component: TagBasicDemo,
            },
            {
                name: 'Removable',
                description: 'Tags that can be dismissed.',
                component: TagRemovableDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Container', description: 'Tag wrapper with background' },
                { name: '2. Label', description: 'Text content' },
                { name: '3. Remove Button', description: 'Optional close/remove action' },
            ]
        },
        emphasis: 'Color indicates category or semantic meaning.',
        alignment: 'Inline with adjacent text or other tags.',
    },

    content: {
        mainElements: 'Keep tag labels short (1-2 words).',
        overflowContent: 'Labels truncate with ellipsis if too long.',
        internationalization: 'Labels should be translatable.',
    },

    designRecommendations: [
        'Keep tag labels concise.',
        'Use semantic colors consistently.',
        'Group related tags visually.',
        'Limit number of tags per item (3-5 recommended).',
    ],

    developmentConsiderations: [
        'Handle click events for clickable tags.',
        'Support removal with onRemove callback.',
        'Consider truncation for long labels.',
        'Ensure proper focus management in groups.',
    ],

    props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Tag label content.' },
        { name: 'color', type: '"neutral" | "primary" | "success" | "warning" | "error" | "info"', required: false, description: 'Color theme.', defaultValue: '"neutral"' },
        { name: 'variant', type: '"solid" | "subtle" | "outline"', required: false, description: 'Visual style.', defaultValue: '"solid"' },
        { name: 'size', type: '"s" | "m"', required: false, description: 'Size variant.', defaultValue: '"m"' },
        { name: 'removable', type: 'boolean', required: false, description: 'Whether the tag shows a remove button.', defaultValue: 'false' },
        { name: 'onRemove', type: '() => void', required: false, description: 'Callback for removal.' },
        { name: 'clickable', type: 'boolean', required: false, description: 'Makes the tag interactive.', defaultValue: 'false' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Focus the tag (if clickable/removable)' },
            { key: 'Enter/Space', action: 'Activate click or remove' },
        ],
        aria: [
            { attribute: 'role="button"', usage: 'For clickable tags' },
            { attribute: 'aria-label', usage: 'On remove button' },
        ],
        screenReader: 'Announces tag label and interactive state.',
        focusIndicator: 'Focus ring on interactive tags.',
    },

    relatedComponents: [
        { name: 'Chip', description: 'Interactive selection elements', path: 'components/data-display/chip' },
        { name: 'Badge', description: 'Status indicators', path: 'components/data-display/badge' },
        { name: 'SearchFilter', description: 'Filter by tags', path: 'components/inputs/search-filter' },
    ],
};

export default TagDoc;
