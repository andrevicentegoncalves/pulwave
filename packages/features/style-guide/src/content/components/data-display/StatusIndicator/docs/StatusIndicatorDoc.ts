import { ComponentDoc } from '@pulwave/features-style-guide';
import * as StatusIndicatorDemos from '../demos';

const StatusIndicatorDoc: ComponentDoc = {
    name: 'StatusIndicator',
    subtitle: 'Visual presence and status indicator.',
    description: 'StatusIndicator shows user availability, connection status, or activity state using semantic colors and optional pulse animation.',
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
        'To show user availability/presence status',
        'For real-time connection indicators',
        'Next to avatars in chat or messaging contexts',
        'For system status displays',
        'Server or service health indicators',
    ],

    whenNotToUse: [
        { text: 'For category labels', alternative: 'Tag or Badge' },
        { text: 'For progress indication', alternative: 'Progress component' },
        { text: 'For notifications count', alternative: 'Badge component' },
        { text: 'For feature flags', alternative: 'Badge or Switch' },
    ],

    overview: {
        description: 'Status Indicators communicate state (online, offline, busy) using semantic colors and optional animations.',
        variants: ['online', 'offline', 'busy', 'away', 'dnd', 'invisible'],
        demos: [
            {
                name: 'Basic Statuses',
                description: 'Standard presence states.',
                component: StatusIndicatorDemos.StatusIndicatorBasicDemo,
            },
            {
                name: 'Pulse Animation',
                description: 'Active indicators with pulse effect.',
                component: StatusIndicatorDemos.StatusIndicatorPulseDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Indicator Dot', description: 'Colored status dot' },
                { name: '2. Pulse Ring', description: 'Optional animated ring' },
                { name: '3. Label', description: 'Optional text label' },
            ]
        },
        emphasis: 'Color conveys status meaning (green=online, red=busy, etc.).',
        alignment: 'Inline with adjacent elements, typically overlaid on Avatar.',
    },

    content: {
        mainElements: 'Status communicated primarily through color.',
        overflowContent: 'Optional label truncates if too long.',
        internationalization: 'Status labels should be translatable.',
    },

    designRecommendations: [
        'Use consistent status colors across the application.',
        'Pair with label for clarity when space allows.',
        'Use pulse animation sparingly for active states.',
        'Position consistently relative to avatars.',
    ],

    developmentConsiderations: [
        'Use CSS animations for pulse effect.',
        'Ensure color is not the only status indicator.',
        'Support real-time status updates.',
        'Handle unknown or null status gracefully.',
    ],

    props: [
        { name: 'status', type: '"online" | "offline" | "busy" | "away" | "dnd" | "invisible"', required: true, description: 'Status to display.' },
        { name: 'size', type: '"xs" | "s" | "m" | "l"', required: false, description: 'Size of the indicator dot.', defaultValue: '"m"' },
        { name: 'pulse', type: 'boolean', required: false, description: 'Show pulse animation (for online status).', defaultValue: 'false' },
        { name: 'label', type: 'string', required: false, description: 'Optional label text to display.' },
    ],

    accessibility: {
        keyboard: [],
        aria: [
            { attribute: 'role="status"', usage: 'Indicates this is a status indicator' },
            { attribute: 'aria-label', usage: 'Provides accessible name for the status' },
        ],
        screenReader: 'Status is announced with its label (e.g., "Online", "Away").',
        focusIndicator: 'Not applicable (non-interactive element).',
    },

    relatedComponents: [
        { name: 'Avatar', description: 'User profile images', path: 'components/data-display/avatar' },
        { name: 'Badge', description: 'Count or label indicators', path: 'components/data-display/badge' },
        { name: 'Tooltip', description: 'Status details on hover', path: 'components/feedback/tooltip' },
    ],
};

export default StatusIndicatorDoc;

