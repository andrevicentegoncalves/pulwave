import { ComponentDoc } from '@pulwave/features-style-guide';
import { RTLDemo } from '../demos';

export const RTLDoc: ComponentDoc = {
    name: 'RTL Support',
    subtitle: 'Bidirectional layout support.',
    description: 'Bidirectional layout support using PulwaveProvider and CSS logical properties, enabling proper rendering for right-to-left languages like Arabic, Hebrew, and Persian.',
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
        'Applications supporting RTL languages (Arabic, Hebrew, Persian)',
        'Multi-language applications with language switcher',
        'Global products requiring localization',
        'Documentation sites for international audiences',
        'E-commerce platforms with RTL market support',
    ],

    whenNotToUse: [
        { text: 'LTR-only applications', alternative: 'Standard layout properties' },
        { text: 'Fixed visual layouts', alternative: 'Absolute positioning' },
        { text: 'Directional content (timelines)', alternative: 'Semantic direction, not text direction' },
        { text: 'Non-text UI (charts, diagrams)', alternative: 'Consider if mirroring makes sense' },
    ],

    overview: {
        description: 'Context-based text direction control with automatic layout mirroring.',
        variants: ['ltr', 'rtl'],
        demos: [
            {
                name: 'RTL Toggle',
                description: 'Toggle direction to see logical properties in action.',
                component: RTLDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. PulwaveProvider', description: 'Context provider with direction state' },
                { name: '2. useDirection Hook', description: 'Access current direction' },
                { name: '3. Logical Properties', description: 'CSS properties that respect direction' },
            ]
        },
        emphasis: 'All components use logical properties for automatic mirroring.',
        alignment: 'Start/end replaces left/right for proper RTL support.',
    },

    content: {
        mainElements: 'Direction context, logical CSS properties, and mirrored layouts.',
        overflowContent: 'Scroll direction follows text direction.',
        internationalization: 'Core foundation for RTL language support.',
    },

    designRecommendations: [
        'Use logical properties (inline-start, inline-end) instead of left/right.',
        'Test all layouts in both LTR and RTL modes.',
        'Consider cultural differences beyond just mirroring.',
        'Keep icons directional when they represent direction (arrows).',
    ],

    developmentConsiderations: [
        'Set dir attribute on html or body element.',
        'Use CSS logical properties for spacing and positioning.',
        'Some icons may need manual RTL handling (chevrons, arrows).',
        'Test with actual RTL content, not just mirrored English.',
    ],

    props: [
        { name: 'direction', type: '"ltr" | "rtl"', required: false, description: 'Current text direction.', defaultValue: '"ltr"' },
        { name: 'setDirection', type: '(dir: Direction) => void', required: false, description: 'Function to toggle direction.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Tab order follows document direction' },
        ],
        aria: [
            { attribute: 'dir="rtl"', usage: 'Sets document direction' },
        ],
        screenReader: 'Screen readers automatically adapt to document direction.',
        focusIndicator: 'Focus order follows logical reading direction.',
    },

    relatedComponents: [
        { name: 'PulwaveProvider', description: 'Main context provider', path: 'foundation/provider' },
        { name: 'Typography', description: 'Text rendering system', path: 'foundation/typography' },
        { name: 'Grid', description: 'Layout grid system', path: 'foundation/grid' },
    ],
};

export default RTLDoc;
