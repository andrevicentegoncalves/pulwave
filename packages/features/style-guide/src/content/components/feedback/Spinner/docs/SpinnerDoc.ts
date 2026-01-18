/**
 * SpinnerDoc - Documentation for Spinner component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import * as SpinnerDemos from '../demos';

const SpinnerDoc: ComponentDoc = {
    name: 'Spinner',
    subtitle: 'Loading indicator for indeterminate wait states.',
    description: 'Spinner is an animated loading indicator for indeterminate wait states, showing users that an operation is in progress without known completion time.',
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
        'Async operations in progress',
        'Page or section loading states',
        'Button loading state (inline)',
        'Data fetching indicators',
        'Form submission processing',
    ],

    whenNotToUse: [
        { text: 'Known progress percentage', alternative: 'Progress component' },
        { text: 'Content placeholders', alternative: 'Skeleton component' },
        { text: 'Full page loading', alternative: 'PageLoader component' },
        { text: 'Very short operations', alternative: 'Optimistic UI updates' },
    ],

    overview: {
        description: 'Animated spinner with size variants and optional label.',
        variants: ['default', 'primary'],
        demos: [
            {
                name: 'Sizes',
                description: 'Spinners come in standard t-shirt sizes.',
                component: SpinnerDemos.SpinnerSizesDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Spinner Circle', description: 'Animated rotating indicator' },
                { name: '2. Label (optional)', description: 'Text describing the operation' },
            ]
        },
        emphasis: 'Spinner should be appropriately sized for its context.',
        alignment: 'Center-aligned by default. Inline with button text when used in buttons.',
    },

    content: {
        mainElements: 'Optional label describes what is loading.',
        overflowContent: 'Not applicable (fixed size element).',
        internationalization: 'Label text should be translatable.',
    },

    designRecommendations: [
        'Use size appropriate to context (small for buttons, medium for sections).',
        'Consider adding label for longer operations.',
        'Use primary color variant for emphasis.',
        'Position centrally within loading area.',
    ],

    developmentConsiderations: [
        'Use CSS animations for smooth performance.',
        'Provide aria-label for accessibility.',
        'Consider delay before showing for very short operations.',
        'Use in combination with Suspense boundaries.',
    ],

    props: [
        { name: 'size', type: '"xs" | "s" | "m" | "l" | "xl"', required: false, description: 'Size variant.', defaultValue: '"m"' },
        { name: 'variant', type: '"default" | "primary"', required: false, description: 'Color variant.', defaultValue: '"default"' },
        { name: 'label', type: 'string', required: false, description: 'Optional text label.' },
        { name: 'className', type: 'string', required: false, description: 'Additional CSS classes.' },
    ],

    accessibility: {
        keyboard: [],
        aria: [
            { attribute: 'role="status"', usage: 'Indicates loading status' },
            { attribute: 'aria-busy="true"', usage: 'Indicates busy state' },
            { attribute: 'aria-label', usage: 'Describes loading operation' },
        ],
        screenReader: 'Announces "Loading" or custom label when spinner appears.',
        focusIndicator: 'Not applicable (non-interactive element).',
    },

    relatedComponents: [
        { name: 'Skeleton', description: 'Content placeholder loading', path: 'components/feedback/skeleton' },
        { name: 'Progress', description: 'Determinate progress indicator', path: 'components/data-display/progress' },
        { name: 'PageLoader', description: 'Full page loading', path: 'components/feedback/page-loader' },
    ],
};

export default SpinnerDoc;
