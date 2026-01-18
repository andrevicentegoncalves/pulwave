/**
 * AlertDoc - Documentation for Alert component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import { AlertBasicDemo, AlertDismissibleDemo, AlertTypesDemo, AlertVariantsDemo } from '../demos';

const AlertDoc: ComponentDoc = {
    name: 'Alert',
    subtitle: 'Contextual feedback messages for user actions.',
    description: 'Alert provides contextual feedback messages with semantic types (info, success, warning, error), communicating important information about system state or user actions.',
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
        'System status messages after user actions',
        'Form validation feedback',
        'Important announcements',
        'Warnings about data or actions',
        'Persistent success confirmations',
    ],

    whenNotToUse: [
        { text: 'Transient notifications', alternative: 'Toast component' },
        { text: 'Confirmation dialogs', alternative: 'Modal or ConfirmationModal' },
        { text: 'Inline validation errors', alternative: 'Input error state' },
    ],

    overview: {
        description: 'Alert provides contextual feedback with semantic types (info, success, warning, error) and optional dismiss functionality. It communicates the state of interactions prominently.',
        variants: ['subtle', 'solid', 'outlined'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard Info alert usage.',
                component: AlertBasicDemo,
            },
            {
                name: 'Semantic Types',
                description: 'Info, Success, Warning, and Error variants.',
                component: AlertTypesDemo,
            },
            {
                name: 'Dismissible',
                description: 'Alert with a close button.',
                component: AlertDismissibleDemo,
            },
            {
                name: 'Visual Variants',
                description: 'Different styling options (e.g. toast-like or modal-like).',
                component: AlertVariantsDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Icon', description: 'Semantic icon matching alert type' },
                { name: '2. Content', description: 'Message text or rich content' },
                { name: '3. Dismiss Button', description: 'Optional close button' },
            ]
        },
        sizes: [
            { name: 'Default', height: 'Auto', description: 'Fluid height based on content' },
        ]
    },

    content: {
        mainElements: 'Use clear, direct language. Start with the most important information.',
        overflowContent: 'Text wraps naturally. Avoid extremely long paragraphs.',
        internationalization: 'Alert width adapts to content length.',
    },

    universalBehaviors: {
        states: 'Visible, Hidden (after dismiss), Hover (on dismiss button).',
        interactions: {
            mouse: 'Click dismiss button to close.',
            keyboard: 'Tab to focus dismiss button, Enter/Space to activate.',
        },
        loading: 'No native loading state.',
    },

    variantDocs: [
        {
            name: 'Inline (Default)',
            description: 'Standard alert meant to be placed within the content flow.',
            bestPractices: [
                'Place near the relevant content',
                'Use for persistent feedback',
            ],
        },
        {
            name: 'Modal / Banner',
            description: 'Full-width or prominent alert at top of page/modal.',
            bestPractices: [
                'Use for system-wide issues',
                'Use for critical errors preventing action',
            ],
        },
    ],



    props: [
        { name: 'status', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", required: false, description: 'Semantic status/color' },
        { name: 'variant', type: "'subtle' | 'solid' | 'outlined'", default: "'subtle'", required: false, description: 'Visual style' },
        { name: 'children', type: 'ReactNode', default: '—', required: false, description: 'Message content' },
        { name: 'title', type: 'string', default: '—', required: false, description: 'Alert title/heading' },
        { name: 'dismissible', type: 'boolean', default: 'false', required: false, description: 'Shows close button' },
        { name: 'onDismiss', type: '() => void', default: '—', required: false, description: 'Callback when closed' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Focus dismiss button' },
            { key: 'Enter/Space', action: 'Activate dismiss button' },
        ],
        aria: [
            { attribute: 'role="alert"', usage: 'Announce to screen readers immediately' },
            { attribute: 'aria-label="Dismiss alert"', usage: 'On close button' },
        ],
        screenReader: 'Announces alert content when it appears. Dismiss button has label.',
    },

    designRecommendations: [
        'Do not overuse alerts; use only for significant state changes.',
        'Ensure color alone is not the only indicator of type (icons help).',
        'Place alerts near relevant content or at page/section top.',
        'Use appropriate semantic type for the message context.',
    ],

    developmentConsiderations: [
        'Use role="alert" for important messages that need immediate announcement.',
        'Consider auto-dismiss for success alerts.',
        'Handle dismiss callback to update parent state.',
        'Support both controlled and uncontrolled dismiss.',
    ],

    structure: [
        { part: 'Icon Size', token: 'icon-size-m', value: '20px' },
        { part: 'Gap', token: 'spacing-3', value: '12px' },
        { part: 'Border Radius', token: 'border-radius-s', value: '4px' },
    ],

    relatedComponents: [
        { name: 'Toast', description: 'Transient auto-dismissing messages', path: 'components/feedback/toast' },
        { name: 'Modal', description: 'Critical blocking dialogs', path: 'components/feedback/modal' },
        { name: 'Badge', description: 'Status indicators', path: 'components/data-display/badge' },
    ],
};

export default AlertDoc;
