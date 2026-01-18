import { ComponentDoc } from '@pulwave/features-style-guide';

/**
 * CircleFlagDoc - Documentation for CircleFlag component
 */
const CircleFlagDoc: ComponentDoc = {
    name: 'CircleFlag',
    subtitle: 'Circular flag display for countries.',
    description: 'CircleFlag displays country flags in a circular format using ISO alpha-2 country codes, commonly used for language selection, region indicators, and internationalization features.',
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
        'Displaying country flags',
        'Language selection dropdowns',
        'Region and locale indicators',
        'Phone number country code selection',
        'User profile location display',
    ],

    whenNotToUse: [
        { text: 'Rectangular flags needed', alternative: 'Custom Flag component' },
        { text: 'Generic icons needed', alternative: 'Icon component' },
        { text: 'Status indicators', alternative: 'Badge or StatusIndicator' },
    ],

    overview: {
        description: 'CircleFlag displaying country code ISO alpha-2 flags.',
        variants: ['default'],
        demos: []
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Container', description: 'Circular clipping container' },
                { name: '2. Flag Image', description: 'Country flag graphic' },
            ]
        },
        emphasis: 'Flag should be recognizable at all supported sizes.',
        alignment: 'Inline, vertically centered with adjacent text.',
    },

    content: {
        mainElements: 'Uses ISO alpha-2 country codes (e.g., "US", "GB", "FR").',
        overflowContent: 'Not applicable (fixed circular format).',
        internationalization: 'Flag images are universal; alt text should be localized.',
    },

    designRecommendations: [
        'Use consistent sizing with surrounding elements.',
        'Provide fallback for unknown country codes.',
        'Consider border for flags with white backgrounds.',
        'Pair with country name for clarity.',
    ],

    developmentConsiderations: [
        'Validate ISO alpha-2 country codes.',
        'Handle missing or invalid codes gracefully.',
        'Optimize flag images for performance.',
        'Support various size variants.',
    ],

    props: [
        { name: 'countryCode', type: 'string', required: true, description: 'ISO alpha-2 country code.' },
        { name: 'size', type: '"xs" | "s" | "m" | "l" | "xl"', required: false, description: 'Size variant.', defaultValue: '"m"' },
        { name: 'className', type: 'string', required: false, description: 'Additional CSS classes.' },
    ],

    accessibility: {
        keyboard: [],
        aria: [
            { attribute: 'role="img"', usage: 'Identifies as image' },
            { attribute: 'aria-label', usage: 'Country name for screen readers' },
        ],
        screenReader: 'Announces country name from aria-label.',
        focusIndicator: 'Not applicable (non-interactive element).',
    },

    relatedComponents: [
        { name: 'Avatar', description: 'User profile images', path: 'components/data-display/avatar' },
        { name: 'LocaleSelector', description: 'Language/locale selection', path: 'components/data-display/locale-selector' },
        { name: 'Select', description: 'Dropdown selection', path: 'components/inputs/select' },
    ],
};

export default CircleFlagDoc;
