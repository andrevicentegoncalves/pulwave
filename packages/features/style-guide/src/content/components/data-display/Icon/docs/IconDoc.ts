import { ComponentDoc } from '@pulwave/features-style-guide';

/**
 * IconDoc - Documentation for Icon component
 */
const IconDoc: ComponentDoc = {
    name: 'Icon',
    subtitle: 'Consistent icon wrapper and styling.',
    description: 'Icon is a wrapper component providing consistent sizing, coloring, and styling for Lucide icons throughout the application.',
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
        'Displaying icons throughout the UI',
        'Consistent icon sizing across components',
        'Applying semantic colors to icons',
        'Icon buttons and interactive elements',
        'Visual indicators and decoration',
    ],

    whenNotToUse: [
        { text: 'Complex SVG illustrations', alternative: 'Img or inline SVG' },
        { text: 'Brand logos', alternative: 'Dedicated logo component' },
        { text: 'Animated graphics', alternative: 'Custom animation' },
    ],

    overview: {
        description: 'Icon component for Lucide icons.',
        variants: ['default'],
        demos: []
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Container', description: 'Wrapper element for sizing' },
                { name: '2. SVG', description: 'Icon SVG graphic' },
            ]
        },
        emphasis: 'Icons should complement text, not replace it for critical info.',
        alignment: 'Vertically centered with adjacent text.',
    },

    content: {
        mainElements: 'Icon name references Lucide icon library.',
        overflowContent: 'Not applicable (fixed size element).',
        internationalization: 'Icons are universal; use with translatable labels.',
    },

    designRecommendations: [
        'Use consistent icon sizes within a context.',
        'Pair icons with text labels for clarity.',
        'Use semantic colors appropriately.',
        'Maintain visual balance with surrounding elements.',
    ],

    developmentConsiderations: [
        'Use named exports from Lucide for tree-shaking.',
        'Provide aria-label or aria-hidden as appropriate.',
        'Support color inheritance from parent.',
        'Handle missing icon gracefully.',
    ],

    props: [
        { name: 'name', type: 'string', required: true, description: 'Lucide icon name.' },
        { name: 'size', type: '"xs" | "s" | "m" | "l" | "xl"', required: false, description: 'Icon size.', defaultValue: '"m"' },
        { name: 'color', type: 'string', required: false, description: 'Icon color (CSS color or token).' },
        { name: 'className', type: 'string', required: false, description: 'Additional CSS classes.' },
    ],

    accessibility: {
        keyboard: [],
        aria: [
            { attribute: 'aria-hidden="true"', usage: 'For decorative icons' },
            { attribute: 'aria-label', usage: 'For meaningful icons' },
            { attribute: 'role="img"', usage: 'When icon conveys meaning' },
        ],
        screenReader: 'Decorative icons hidden. Meaningful icons announced via aria-label.',
        focusIndicator: 'Not applicable (non-interactive element).',
    },

    relatedComponents: [
        { name: 'Button', description: 'Icon buttons', path: 'components/actions/button' },
        { name: 'Badge', description: 'Icon with badge', path: 'components/data-display/badge' },
        { name: 'Tooltip', description: 'Icon explanations', path: 'components/feedback/tooltip' },
    ],
};

export default IconDoc;
