import { ComponentDoc } from '@pulwave/features-style-guide';
import {
    BadgeVariantsDemo,
    BadgeCountDemo,
    BadgeDotDemo,
    BadgeIconCircleDemo,
    BadgeOutlineDemo,
    BadgeSizesDemo,
    BadgeStatusDemo,
    BadgeWithIconsDemo
} from '../demos';

/**
 * BadgeDoc - Enhanced documentation for Badge component
 * 
 * Following IBM Carbon Design System patterns.
 */
const BadgeDoc: ComponentDoc = {
    name: 'Badge',
    description: 'Badges indicate status, count, or category with compact visual indicators using a Status + Variant system.',
    status: 'stable',

    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    whenToUse: [
        'Showing notification counts',
        'Indicating item status (new, pending, complete)',
        'Labeling categories or tags',
        'Highlighting feature availability (beta, new)',
        'Compact visual differentiation',
        'Icon-only circular indicators',
    ],

    whenNotToUse: [
        { text: 'Detailed status information', alternative: 'Alert or Status Indicator' },
        { text: 'User-dismissible messages', alternative: 'Toast or Alert' },
        { text: 'Long text content', alternative: 'Tag or Chip' },
        { text: 'Interactive elements', alternative: 'Button or Chip' },
    ],

    overview: {
        description: 'Badge uses a "Status" (color intent) and "Variant" (visual style) system to provide flexible, consistent badges.',
        variants: ['Solid (heavy)', 'Soft (medium)', 'Outlined (light)'],
        demos: [
            {
                name: 'Badge Matrix',
                description: 'A comprehensive view of all Badge statuses and variants.',
                component: BadgeVariantsDemo,
            },
            {
                name: 'Sizes',
                description: 'Available badge sizes from xs to xl.',
                component: BadgeSizesDemo,
            },
            {
                name: 'Status Colors',
                description: 'Semantic status colors for feedback.',
                component: BadgeStatusDemo,
            },
            {
                name: 'Outline Variant',
                description: 'Lightweight outline style.',
                component: BadgeOutlineDemo,
            },
            {
                name: 'With Icons',
                description: 'Badges with leading icons.',
                component: BadgeWithIconsDemo,
            },
            {
                name: 'Count Badge',
                description: 'Notification counts with overflow handling.',
                component: BadgeCountDemo,
            },
            {
                name: 'Dot Badge',
                description: 'Minimal indicator for status or unseen items.',
                component: BadgeDotDemo,
            },
            {
                name: 'Icon Circle',
                description: 'Circular icon-only badges.',
                component: BadgeIconCircleDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Container', description: 'Pill-shaped background with border radius' },
                { name: '2. Label', description: 'Text or number content' },
                { name: '3. Icon', description: 'Optional leading icon' },
                { name: '4. Close Button', description: 'Optional remove button (when removable)' },
            ]
        },
        sizes: [
            { name: 'Extra Small (xs)', height: '20px', description: 'Minimal indicators, dot badges' },
            { name: 'Small (s)', height: '24px', description: 'Compact tables, inline notifications' },
            { name: 'Medium (m)', height: '32px', description: 'Default badge size' },
            { name: 'Large (l)', height: '40px', description: 'Prominent status indicators' },
            { name: 'Extra Large (xl)', height: '48px', description: 'Hero or marketing badges' },
        ],
        emphasis: 'Use Solid for high emphasis, Soft for default, Outlined for low emphasis.',
        alignment: 'Position badges top-right of avatar/icons, or inline with labels.',
    },

    content: {
        mainElements: 'Keep text to 1-2 words or numbers. Use abbreviations for counts over 99 (99+).',
        overflowContent: 'Truncate at 99+ for counts. Never wrap badge text.',
        internationalization: 'Numbers are universal. Text badges need translation.',
    },

    // Per-Status Documentation
    variantDocs: [
        {
            name: 'Brand Colors',
            description: 'Primary, Secondary, and Tertiary for brand-aligned badges.',
            bestPractices: ['Use Primary for key actions', 'Use Secondary/Tertiary for supporting info'],
        },
        {
            name: 'Neutral',
            description: 'Default grayscale badge for general categorization without semantic meaning.',
            bestPractices: ['Use for tags and categories', 'Good for counts without urgency'],
        },
        {
            name: 'Success',
            description: 'Indicates positive status like completed, active, or approved.',
            bestPractices: ['Use for completed tasks', 'Good for "Active" or "Online" status'],
        },
        {
            name: 'Warning',
            description: 'Indicates attention needed but not critical.',
            bestPractices: ['Use for pending or draft status', 'Good for expiring items'],
        },
        {
            name: 'Error',
            description: 'Indicates critical status or failures.',
            bestPractices: ['Use for failed or blocked items', 'Limit usage to critical states'],
        },
        {
            name: 'Info',
            description: 'Informational badges for tips or notes.',
            bestPractices: ['Use for "Beta", "New", informational labels'],
        },
    ],

    modifiers: [
        { name: 'With Icon', description: 'Leading icon for visual context (checkmark, warning).' },
        { name: 'Circle', description: 'Circular badge for icon-only displays (set circle prop).' },
        { name: 'Removable', description: 'Shows close button for user-dismissible badges.' },
    ],

    props: [
        { name: 'status', type: "'neutral' | 'primary' | 'secondary' | 'tertiary' | 'info' | 'success' | 'warning' | 'error' | 'danger' | 'critical' | 'promotion' | 'premium' | 'discovery' | 'maintenance' | 'growth' | 'urgent'", default: "'neutral'", required: false, description: 'Semantic status color' },
        { name: 'variant', type: "'heavy' | 'medium' | 'light'", default: "'medium'", required: false, description: 'Visual emphasis: heavy (solid), medium (soft), light (outlined)' },
        { name: 'size', type: "'xs' | 's' | 'm' | 'l' | 'xl'", default: "'m'", required: false, description: 'Size variant' },
        { name: 'icon', type: 'ReactNode', default: '—', required: false, description: 'Leading icon' },
        { name: 'circle', type: 'boolean', default: 'false', required: false, description: 'Make badge circular (icon-only)' },
        { name: 'removable', type: 'boolean', default: 'false', required: false, description: 'Show remove button' },
        { name: 'onRemove', type: '() => void', default: '—', required: false, description: 'Callback when remove is clicked' },
        { name: 'clickable', type: 'boolean', default: 'false', required: false, description: 'Apply interactive styles' },
        { name: 'children', type: 'ReactNode', default: '—', required: false, description: 'Badge content' },
    ],

    styleTokens: [
        {
            variant: 'Status',
            states: [
                { state: 'Primary', textToken: '--color-primary-800', backgroundToken: '--color-primary-200' },
                { state: 'Secondary', textToken: '--color-secondary-800', backgroundToken: '--color-secondary-200' },
                { state: 'Tertiary', textToken: '--color-tertiary-800', backgroundToken: '--color-tertiary-200' },
                { state: 'Success', textToken: '--color-feedback-success-800', backgroundToken: '--color-feedback-success-200' },
                { state: 'Warning', textToken: '--color-feedback-warning-800', backgroundToken: '--color-feedback-warning-200' },
                { state: 'Error', textToken: '--color-feedback-error-800', backgroundToken: '--color-feedback-error-200' },
            ],
        },
    ],

    structure: [
        { part: 'Padding (horizontal)', token: '--spacing-4', value: '16px' },
        { part: 'Height (m)', token: '--badge-height', value: '32px' },
        { part: 'Border radius', token: '--border-radius-xl', value: '12px' },
        { part: 'Icon size', token: '--scale-4', value: '16px' },
    ],

    anatomy: {
        parts: [
            { name: 'Container', description: 'Pill-shaped wrapper' },
            { name: 'Icon', description: 'Optional leading icon' },
            { name: 'Content', description: 'Text or number content' },
            { name: 'Close', description: 'Optional remove button' },
        ]
    },

    inUse: {
        dos: [
            'Use semantic colors for status meaning',
            'Keep text concise (1-2 words)',
            'Position consistently relative to parent',
            'Use circle prop for icon-only badges',
            'Use variant="heavy" for high emphasis',
        ],
        donts: [
            'Don\'t use for long messages',
            'Don\'t make badges primary interactive elements',
            'Don\'t use error status for non-error states',
            'Don\'t stack multiple badges on same element',
        ],
        examples: []
    },

    accessibility: {
        keyboard: [],
        aria: [
            { attribute: 'role="status"', usage: 'For dynamic count badges' },
            { attribute: 'aria-label', usage: 'Provide context for screen readers' },
        ],
        screenReader: 'Badge content should be announced with context, e.g., "3 new notifications".',
        focusIndicator: 'Badges are typically non-interactive and don\'t receive focus.',
    },

    designRecommendations: [
        'Use consistent badge positioning across the application',
        'Don\'t rely on color alone - add icons for accessibility',
        'Use variant="heavy" sparingly for maximum impact',
        'Limit to one badge per element to avoid visual clutter',
    ],

    developmentConsiderations: [
        'Use aria-label for screen reader context on count badges',
        'Update badge live regions for dynamic counts',
        'Consider hiding purely decorative badges from screen readers',
        'Use status prop for colors, variant prop for emphasis',
    ],

    relatedComponents: [
        { name: 'Tag', description: 'Use for removable labels or filters', path: '/components/data-display/tag' },
        { name: 'Chip', description: 'Use for interactive selections', path: '/components/data-display/chip' },
        { name: 'StatusIndicator', description: 'Use for connection/online status', path: '/components/data-display/status-indicator' },
    ],

    responsiveBehavior: [
        { breakpoint: 'All', behavior: 'Badge size remains consistent across breakpoints' },
    ],
};

export default BadgeDoc;
