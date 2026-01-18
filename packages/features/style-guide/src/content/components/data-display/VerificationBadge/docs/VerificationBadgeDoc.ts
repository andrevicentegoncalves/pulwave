import { ComponentDoc } from '@pulwave/features-style-guide';

/**
 * VerificationBadgeDoc - Documentation for VerificationBadge component
 */
const VerificationBadgeDoc: ComponentDoc = {
    name: 'VerificationBadge',
    subtitle: 'Badge indicating verified status.',
    description: 'VerificationBadge displays a visual indicator of verification status, commonly used for user accounts, official profiles, or trust signals.',
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
        'User verification status',
        'Official account indicators',
        'Trust signals',
        'Identity verification markers',
        'Credential or certification display',
    ],

    whenNotToUse: [
        { text: 'Generic status', alternative: 'Badge component' },
        { text: 'Notification counts', alternative: 'Badge component' },
        { text: 'Category labels', alternative: 'Tag component' },
    ],

    overview: {
        description: 'VerificationBadge with different levels of verification.',
        variants: ['verified', 'unverified', 'pending'],
        demos: []
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Icon', description: 'Verification checkmark or status icon' },
                { name: '2. Container', description: 'Badge background and border' },
            ]
        },
        emphasis: 'Verified state should be immediately recognizable.',
        alignment: 'Typically positioned near usernames or profile images.',
    },

    content: {
        mainElements: 'Icon communicates verification level.',
        overflowContent: 'Not applicable (fixed size element).',
        internationalization: 'Status text should be translatable.',
    },

    designRecommendations: [
        'Use consistent placement across the application.',
        'Ensure icon is recognizable at all sizes.',
        'Consider tooltip explaining verification level.',
        'Do not overuse verification indicators.',
    ],

    developmentConsiderations: [
        'Handle different verification levels.',
        'Support size variants for different contexts.',
        'Provide accessible description.',
        'Consider animation for status changes.',
    ],

    props: [
        { name: 'verified', type: 'boolean', required: true, description: 'Whether verified status is active.' },
        { name: 'level', type: '"standard" | "official" | "premium"', required: false, description: 'Verification level.', defaultValue: '"standard"' },
        { name: 'size', type: '"s" | "m" | "l"', required: false, description: 'Badge size.', defaultValue: '"m"' },
        { name: 'showLabel', type: 'boolean', required: false, description: 'Show text label.', defaultValue: 'false' },
    ],

    accessibility: {
        keyboard: [],
        aria: [
            { attribute: 'aria-label', usage: 'Describes verification status' },
            { attribute: 'role="img"', usage: 'When badge is purely visual' },
        ],
        screenReader: 'Announces verification status (e.g., "Verified account").',
        focusIndicator: 'Not applicable (non-interactive element).',
    },

    relatedComponents: [
        { name: 'Avatar', description: 'User profile images', path: 'components/data-display/avatar' },
        { name: 'Badge', description: 'Generic status badges', path: 'components/data-display/badge' },
        { name: 'StatusIndicator', description: 'Presence indicators', path: 'components/data-display/status-indicator' },
    ],
};

export default VerificationBadgeDoc;
