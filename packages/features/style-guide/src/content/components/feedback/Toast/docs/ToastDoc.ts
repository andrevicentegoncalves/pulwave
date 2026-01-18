/**
 * ToastDoc - Documentation for Toast component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import { ToastTypesDemo } from '../demos';

const ToastDoc: ComponentDoc = {
    name: 'Toast',
    subtitle: 'Transient notification messages.',
    description: 'Toast displays brief, auto-dismissing notification messages at screen edges, providing feedback for user actions and system events without interrupting workflow.',
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
        'Quick feedback after user actions (save, delete)',
        'Background process completion notifications',
        'Non-critical system notifications',
        'Undo action opportunities',
        'Brief success confirmations',
    ],

    whenNotToUse: [
        { text: 'Persistent messages', alternative: 'Alert component' },
        { text: 'Actions required from user', alternative: 'Modal or ConfirmationModal' },
        { text: 'Critical errors requiring attention', alternative: 'Alert with dismissible=false' },
        { text: 'Inline form validation', alternative: 'Input error state' },
    ],

    overview: {
        description: 'Toast shows brief, auto-dismissing messages at screen edge with semantic types.',
        variants: ['success', 'error', 'warning', 'info'],
        demos: [
            {
                name: 'Toast Types',
                description: 'Different semantic types of toasts.',
                component: ToastTypesDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Icon', description: 'Semantic icon matching toast type' },
                { name: '2. Message', description: 'Brief notification text' },
                { name: '3. Action (optional)', description: 'Undo or other action button' },
                { name: '4. Dismiss Button', description: 'Manual close option' },
            ]
        },
        emphasis: 'Toast should be noticeable but not disruptive to workflow.',
        alignment: 'Positioned at screen edge, typically bottom-right.',
    },

    content: {
        mainElements: 'Keep messages brief and actionable (1-2 sentences max).',
        overflowContent: 'Long messages truncate. Use Alert for detailed content.',
        internationalization: 'Message text should be translatable.',
    },

    designRecommendations: [
        'Keep toast messages brief and clear.',
        'Use appropriate semantic type for the message.',
        'Provide undo action for destructive operations.',
        'Stack multiple toasts from bottom or top.',
    ],

    developmentConsiderations: [
        'Use ToastProvider at app root for toast management.',
        'Access toast API via useToast hook.',
        'Configure default duration in provider.',
        'Handle toast queuing for multiple notifications.',
    ],

    props: [
        { name: 'message', type: 'ReactNode', required: true, description: 'Toast message content.' },
        { name: 'variant', type: '"success" | "error" | "warning" | "info"', required: false, description: 'Semantic variant/color.', defaultValue: '"info"' },
        { name: 'duration', type: 'number', required: false, description: 'Auto-dismiss duration in ms.', defaultValue: '5000' },
        { name: 'onClose', type: '() => void', required: false, description: 'Callback when toast is dismissed.' },
        { name: 'action', type: '{ label: string; onClick: () => void }', required: false, description: 'Optional action button.' },
        { name: 'position', type: '"top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center"', required: false, description: 'Screen position.', defaultValue: '"bottom-right"' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Escape', action: 'Dismiss toast (if focusable)' },
            { key: 'Tab', action: 'Focus action or dismiss button' },
        ],
        aria: [
            { attribute: 'role="status"', usage: 'For non-urgent info/success toasts' },
            { attribute: 'role="alert"', usage: 'For error/warning toasts' },
            { attribute: 'aria-live="polite"', usage: 'Announce without interrupting' },
            { attribute: 'aria-atomic="true"', usage: 'Announce entire toast content' },
        ],
        screenReader: 'Announces toast content based on role. Auto-dismisses after timeout.',
        focusIndicator: 'Focus ring on dismiss and action buttons.',
    },

    relatedComponents: [
        { name: 'Alert', description: 'Persistent in-page messages', path: 'components/feedback/alert' },
        { name: 'Modal', description: 'Dialog requiring attention', path: 'components/feedback/modal' },
        { name: 'Spinner', description: 'Loading indicator', path: 'components/feedback/spinner' },
    ],
};

export default ToastDoc;
