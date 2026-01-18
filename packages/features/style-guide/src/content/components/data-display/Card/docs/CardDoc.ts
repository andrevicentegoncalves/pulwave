/**
 * CardDoc - Documentation for Card component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import { CardBasicDemo, CardStructureDemo, CardVariantsDemo } from '../demos';

const CardDoc: ComponentDoc = {
    name: 'Card',
    subtitle: 'Container for grouping related content.',
    description: 'Card is a container component for grouping related content and actions, providing a consistent visual structure with optional elevation, borders, and interactive states.',
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
        'Grouping related information',
        'Product or content previews',
        'Dashboard widgets',
        'List items with rich content',
        'Profile cards and user summaries',
    ],

    whenNotToUse: [
        { text: 'Simple text blocks', alternative: 'Box or Stack component' },
        { text: 'Navigation items', alternative: 'Sidebar or Menu' },
        { text: 'Modal content', alternative: 'Modal component' },
    ],

    overview: {
        description: 'Card provides a consistent container with optional elevation, borders, and interactive states. It supports both a simple props-based API and a flexible Compound Component API.',
        variants: ['default (flat)', 'elevated', 'outlined', 'interactive'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'A simple card with header, body, and footer.',
                component: CardBasicDemo,
            },
            {
                name: 'Variants',
                description: 'Different visual styles for cards.',
                component: CardVariantsDemo,
            },
            {
                name: 'Interactive & Structure',
                description: 'Showcasing interactive states and Compound Component structure (`Card.Header`, `Card.Body`, `Card.Footer`).',
                component: CardStructureDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Card (Root)', description: 'Main container' },
                { name: '2. Card.Header', description: 'Top section for titles/actions' },
                { name: '3. Card.Body', description: 'Main content area (automatically padded)' },
                { name: '4. Card.Footer', description: 'Bottom section for actions' },
            ]
        },
        sizes: [
            { name: 'Default', height: 'Auto', description: 'Adapts to content height' },
        ]
    },

    content: {
        mainElements: 'Keep headers concise. Use clear hierarchy in the body. Primary actions go in the footer.',
        overflowContent: 'Cards should expand vertically with content. Avoid scrolling inside cards unless necessary.',
        internationalization: 'Allow flexibility in height for translated text expansion.',
    },

    universalBehaviors: {
        states: 'Default, Hover (if interactive), Focus (if interactive).',
        interactions: {
            mouse: 'Clickable cards trigger onClick content.',
            keyboard: 'Focusable via Tab if onClick is present. Enter/Space activates.',
        },
        loading: 'Use Skeleton components inside specific card areas for loading states.',
    },

    variantDocs: [
        {
            name: 'Default (Flat)',
            description: 'Standard card for most use cases, blends with background.',
            bestPractices: [
                'Use for grouping content on a gray background',
                'Combines well with grids',
            ],
        },
        {
            name: 'Elevated',
            description: 'Has a drop shadow to lift it from the background.',
            bestPractices: [
                'Use for draggable items or key dashboard stats',
                'Avoid overuse to maintain hierarchy',
            ],
        },
        {
            name: 'Outlined',
            description: 'Defined by a border stroke.',
            bestPractices: [
                'Use on white backgrounds where flat cards might be lost',
                'Good for list items',
            ],
        },
    ],



    props: [
        { name: 'children', type: 'ReactNode', default: '—', required: true, description: 'Content of the card. Use `Card.Body` for padded content in Compound mode.' },
        { name: 'header', type: 'ReactNode', default: '—', required: false, description: 'Legacy Prop for Header content' },
        { name: 'footer', type: 'ReactNode', default: '—', required: false, description: 'Legacy Prop for Footer content' },
        { name: 'variant', type: "'default' | 'elevated' | 'outlined'", default: "'default'", required: false, description: 'Visual style' },
        { name: 'padding', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", required: false, description: 'Inner spacing' },
        { name: 'onClick', type: '() => void', default: '—', required: false, description: 'Makes card interactive' },
        { name: 'noPadding', type: 'boolean', default: 'false', required: false, description: 'Removes default padding wrapper. Required when using subcomponents manually.' },
        { name: 'noHoverTransform', type: 'boolean', default: 'false', required: false, description: 'Disables movement effect on hover' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Focuses card (if clickable)' },
            { key: 'Enter/Space', action: 'Activates click handler (if clickable)' },
        ],
        aria: [
            { attribute: 'role="button"', usage: 'If onClick is provided' },
            { attribute: 'tabIndex="0"', usage: 'If onClick is provided' },
        ],
        screenReader: 'Treats card as a semantic grouping. Interactive cards are announced as buttons.',
    },

    designRecommendations: [
        'Use consistent heights for cards in the same row (CardGrid handles this)',
        'Place primary actions in the footer, right-aligned',
        'Use specific padding tokens for consistency',
    ],

    developmentConsiderations: [
        'Card expands to fill its flexible container (flex-grow: 1)',
        'Clickable cards wrap entire definition in a button role div',
    ],

    structure: [
        { part: 'Padding', token: 'spacing-5 (vertical), spacing-6 (horizontal)', value: 'Variable' },
        { part: 'Border Radius', token: 'border-radius-m', value: '8px' },
        { part: 'Border Width', token: 'border-width-xs', value: '1px' },
    ],

    relatedComponents: [
        { name: 'CardGrid', description: 'Grid layout for cards', path: 'components/data-display/card-grid' },
        { name: 'Box', description: 'Generic container', path: 'components/layout/box' },
        { name: 'Stack', description: 'Vertical content layout', path: 'components/layout/stack' },
    ],
};

export default CardDoc;
