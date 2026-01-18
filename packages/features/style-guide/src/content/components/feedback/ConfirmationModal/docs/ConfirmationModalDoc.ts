import { ComponentDoc } from '@pulwave/features-style-guide';
import { ConfirmationModalBasicDemo } from '../demos';

const ConfirmationModalDoc: ComponentDoc = {
    name: 'ConfirmationModal',
    subtitle: 'Modal dialog for confirming user actions.',
    description: 'ConfirmationModal is a specialized modal used to request user confirmation for critical or irreversible actions. It provides consistent styling for warnings, danger states, and informational messages.',
    sourcePath: 'packages/ui/components/ConfirmationModal/ConfirmationModal.tsx',
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
        'Confirming destructive actions like delete or remove',
        'Irreversible operations requiring explicit approval',
        'Actions with significant consequences (data loss, payments)',
        'Logging out or ending sessions',
        'Discarding unsaved changes',
    ],

    whenNotToUse: [
        { text: 'Simple notifications', alternative: 'Toast or Alert component' },
        { text: 'Non-critical actions', alternative: 'Inline confirmation or undo pattern' },
        { text: 'Form validation errors', alternative: 'Inline field validation' },
        { text: 'Complex multi-step processes', alternative: 'Wizard or stepper pattern' },
    ],

    overview: {
        description: 'Use ConfirmationModal to require explicit user approval for critical actions.',
        variants: ['danger', 'warning', 'info', 'question'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard confirmation dialog with action types.',
                component: ConfirmationModalBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Icon', description: 'Visual indicator of action severity' },
                { name: '2. Title', description: 'Brief description of the action' },
                { name: '3. Message', description: 'Detailed explanation of consequences' },
                { name: '4. Cancel Button', description: 'Dismisses modal without action' },
                { name: '5. Confirm Button', description: 'Proceeds with the action' },
            ]
        },
        emphasis: 'Variant colors indicate severity. Danger uses red, warning uses amber.',
        alignment: 'Content centered. Buttons right-aligned with cancel before confirm.',
    },

    content: {
        mainElements: 'Title, message, and action buttons with severity-based styling.',
        overflowContent: 'Message should be concise. For long content, use full Modal.',
        internationalization: 'All text props should be translatable. Button order may vary by locale.',
    },

    designRecommendations: [
        'Use for destructive actions like deleting data or irreversible changes.',
        'Keep the title concise and the message descriptive.',
        'Use appropriate variants (danger, warning, info) to convey severity.',
        'Always provide a clear cancel option.',
    ],

    developmentConsiderations: [
        'Ensure `onConfirm` and `onClose` handlers are properly defined.',
        'Use the `loading` prop to prevent multiple submissions during async operations.',
        'Focus is trapped inside modal when open.',
    ],

    props: [
        { name: 'isOpen', type: 'boolean', required: true, description: 'Controls the visibility of the modal.', defaultValue: 'false' },
        { name: 'onClose', type: '() => void', required: true, description: 'Callback fired when the modal is closed.' },
        { name: 'onConfirm', type: '() => void', required: true, description: 'Callback fired when the confirm button is clicked.' },
        { name: 'title', type: 'string', required: false, description: 'Title of the confirmation modal.', defaultValue: '"Confirm Action"' },
        { name: 'message', type: 'string', required: false, description: 'Main message content explaining the confirmation request.' },
        { name: 'confirmText', type: 'string', required: false, description: 'Text for the confirm button.', defaultValue: '"Confirm"' },
        { name: 'cancelText', type: 'string', required: false, description: 'Text for the cancel button.', defaultValue: '"Cancel"' },
        { name: 'variant', type: '"danger" | "warning" | "info" | "question"', required: false, description: 'Visual variant indicating the nature of the confirmation.', defaultValue: '"warning"' },
        { name: 'loading', type: 'boolean', required: false, description: 'If true, shows a loading state on the confirm button and disables actions.', defaultValue: 'false' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between buttons' },
            { key: 'Escape', action: 'Close modal (triggers onClose)' },
            { key: 'Enter', action: 'Activate focused button' },
        ],
        aria: [
            { attribute: 'role="alertdialog"', usage: 'Indicates urgent confirmation dialog' },
            { attribute: 'aria-modal="true"', usage: 'Indicates modal behavior' },
            { attribute: 'aria-labelledby', usage: 'References the title' },
            { attribute: 'aria-describedby', usage: 'References the message' },
        ],
        screenReader: 'Announces: "[variant] confirmation: [title]. [message]". Focus moves to modal on open.',
        focusIndicator: 'Focus ring on buttons. Initial focus on cancel button for safety.',
    },

    relatedComponents: [
        { name: 'Modal', description: 'General-purpose modal', path: 'components/overlays/modal' },
        { name: 'Alert', description: 'Inline alert messages', path: 'components/feedback/alert' },
        { name: 'Toast', description: 'Temporary notifications', path: 'components/feedback/toast' },
    ],
};

export default ConfirmationModalDoc;

