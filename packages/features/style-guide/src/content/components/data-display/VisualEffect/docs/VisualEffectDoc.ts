import { ComponentDoc } from '@pulwave/features-style-guide';
import * as VisualEffectDemos from '../demos';

export const VisualEffectDoc: ComponentDoc = {
    name: 'VisualEffect',
    description: 'VisualEffect provides scalable SVG animations for use as background elements, decorative accents, or ambient visual interest in empty states and loading screens.',
    status: 'stable',
    version: '1.0.0',
    lastUpdated: '2026-01-17',

    accessibilityStatus: {
        keyboard: 'skip' as const,
        focusManagement: 'skip' as const,
        colorContrast: 'pass' as const,
        screenReader: 'skip' as const,
    },

    whenToUse: [
        'Background decorations in sidebars or panels',
        'Empty state visual accents',
        'Loading screen ambient effects',
        'Hero section decorative elements',
        'Onboarding flow visual interest',
    ],

    whenNotToUse: [
        { text: 'Conveying information', alternative: 'Icon or illustration with meaning' },
        { text: 'Interactive elements', alternative: 'Button or clickable component' },
        { text: 'Loading indicators with progress', alternative: 'Spinner or Progress' },
        { text: 'Areas with dense content', alternative: 'Keep background clean' },
    ],

    overview: {
        description: 'Pure SVG animations for decorative backgrounds, automatically hidden from assistive technology.',
        variants: ['sidebar-wave', 'pulse-wave', 'ring-wave'],
        demos: VisualEffectDemos ? [
            {
                name: 'Visual Effects',
                description: 'Different animation variants for various contexts.',
                component: VisualEffectDemos.VisualEffectBasicDemo,
            },
        ] : [],
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. SVG Container', description: 'Scalable vector graphics container' },
                { name: '2. Animated Elements', description: 'CSS-animated paths and shapes' },
            ]
        },
        emphasis: 'Effects should be subtle and not compete with content. Use low opacity or muted colors.',
        alignment: 'Position absolute or fixed behind content. Use z-index to layer appropriately.',
    },

    content: {
        mainElements: 'Purely decorative SVG animations with no semantic content.',
        overflowContent: 'Effects scale with container. Consider clipping or positioning to prevent overflow.',
        internationalization: 'Not applicable - purely visual decoration.',
    },

    designRecommendations: [
        'Use sparingly to avoid distracting the user.',
        'Place behind content with lower z-index.',
        'Combine with neutral backgrounds for best effect.',
        'Consider reduced motion preferences.',
    ],

    developmentConsiderations: [
        'Pure SVG animations for performance.',
        'Automatically uses `aria-hidden="true"`.',
        'Parent container needs relative positioning for absolute placement.',
        'Respect prefers-reduced-motion media query.',
    ],

    props: [
        { name: 'variant', type: '"sidebar-wave" | "pulse-wave" | "ring-wave"', required: false, description: 'The visual effect animation style.', defaultValue: '"sidebar-wave"' },
        { name: 'size', type: '"s" | "m" | "l" | "xl"', required: false, description: 'Size of the effect container.', defaultValue: '"m"' },
        { name: 'className', type: 'string', required: false, description: 'Additional CSS classes for positioning or styling.' },
    ],

    accessibility: {
        keyboard: [],
        aria: [
            { attribute: 'aria-hidden="true"', usage: 'Automatically applied - hides from assistive technology' },
            { attribute: 'role="presentation"', usage: 'Marks as decorative' },
        ],
        screenReader: 'Hidden from screen readers as purely decorative.',
        focusIndicator: 'Not focusable - decorative only',
    },

    relatedComponents: [
        { name: 'Spinner', description: 'For loading indicators', path: 'components/feedback/spinner' },
        { name: 'Skeleton', description: 'For loading placeholders', path: 'components/feedback/skeleton' },
        { name: 'EmptyState', description: 'For empty content areas', path: 'components/feedback/empty-state' },
    ],
};

export default VisualEffectDoc;

