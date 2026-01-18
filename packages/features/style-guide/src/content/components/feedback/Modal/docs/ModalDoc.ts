/**
 * ModalDoc - Documentation for Modal component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import { ModalBasicDemo, ModalSizesDemo } from '../demos';

const ModalDoc: ComponentDoc = {
    name: 'Modal',
    subtitle: 'Overlay dialog for focused user interaction.',
    description: 'Modal is an overlay dialog that blocks the main content, focusing user attention on critical tasks, confirmations, or complex forms requiring completion before returning to the application.',
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
        'Confirming destructive actions',
        'Complex forms requiring focus',
        'Displaying detailed content',
        'User authentication flows',
        'Multi-step wizards or processes',
    ],

    whenNotToUse: [
        { text: 'Simple confirmations', alternative: 'ConfirmationModal' },
        { text: 'Brief notifications', alternative: 'Toast component' },
        { text: 'Non-blocking content', alternative: 'Drawer or side panel' },
    ],

    overview: {
        description: 'Modals (also known as Dialogs) are overlay windows that disable the underlying content, requiring users to interact with the modal before returning to the main application. They are used for critical actions, information, or workflows.',
        variants: ['default', 'sizes', 'confirmation'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'A standard modal with header, body, and footer.',
                component: ModalBasicDemo,
            },
            {
                name: 'Sizes',
                description: 'Modals come in multiple sizes: small, medium (default), large, and fullscreen.',
                component: ModalSizesDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: 'Overlay', description: 'Semi-transparent background that dims the rest of the screen' },
                { name: 'Container', description: 'The main modal window' },
                { name: 'Header', description: 'Contains title and close button' },
                { name: 'Body', description: 'Main content area' },
                { name: 'Footer', description: 'Contains action buttons' },
            ]
        },
        sizes: [
            { name: 'Small (s)', height: '400px width', description: 'Simple confirmations or alerts' },
            { name: 'Medium (m)', height: '600px width', description: 'Standard size for most content' },
            { name: 'Large (l)', height: '800px width', description: 'Complex forms or data display' },
            { name: 'Fullscreen', height: '100% width', description: 'Immersive tasks or large previews' },
        ]
    },

    content: {
        mainElements: 'Titles should be concise and action-oriented. Buttons should follow the primary/secondary pattern.',
        overflowContent: 'Body content scrolls independently if it exceeds the max-height of the modal.',
        internationalization: 'Modal width accommodates expanded text in translated languages.',
    },

    universalBehaviors: {
        states: 'Open (visible), Closed (hidden), and Loading (actions disabled).',
        interactions: {
            mouse: 'Clicking overlay closes the modal (unless persistent). Clicking close button closes modal.',
            keyboard: 'Escape key closes modal. Tab keeps focus trapped within modal content.',
        },
        loading: 'Footer actions can show loading state without closing the modal.',
    },

    variantDocs: [
        {
            name: 'Standard Modal',
            description: 'Used for general content, forms, or information display.',
            bestPractices: [
                'Always include a title',
                'Provide a clear way to close',
                'Keep content focused on a single task'
            ]
        }
    ],



    // Props
    props: [
        { name: 'isOpen', type: 'boolean', default: 'false', required: true, description: 'Controls visibility of the modal' },
        { name: 'onClose', type: '() => void', default: '—', required: true, description: 'Callback when modal is closed' },
        { name: 'title', type: 'string', default: '—', required: false, description: 'Modal header title' },
        { name: 'size', type: "'s' | 'm' | 'l' | 'fullscreen'", default: "'m'", required: false, description: 'Width of the modal' },
        { name: 'children', type: 'ReactNode', default: '—', required: true, description: 'Modal body content' },
        { name: 'footer', type: 'ReactNode', default: '—', required: false, description: 'Modal footer content (usually buttons)' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Escape', action: 'Close modal' },
            { key: 'Tab', action: 'Traps focus within modal elements' },
            { key: 'Shift + Tab', action: 'Traps focus within modal elements (reverse)' },
        ],
        aria: [
            { attribute: 'role="dialog"', usage: 'Identify container as a dialog' },
            { attribute: 'aria-modal="true"', usage: 'Indicate it is a modal window' },
            { attribute: 'aria-labelledby', usage: 'Links modal to its title' },
            { attribute: 'aria-describedby', usage: 'Links modal to its description/body' },
        ],
        screenReader: 'Focus moves to modal when opened. Background content is hidden from screen readers via aria-hidden.',
        focusIndicator: 'Focus is trapped inside the modal. Close button is usually the first focusable element.',
    },

    designRecommendations: [
        'Use standard button placement in footers (Primary on right)',
        'Avoid stacking multiple modals',
        'Use scrim/overlay to block background interaction',
    ],

    developmentConsiderations: [
        'Use FocusTrap to manage keyboard navigation',
        'Ensure z-index is higher than other page elements',
        'Handle body scroll locking when modal is open',
    ],

    styleTokens: [
        {
            variant: 'Modal',
            states: [
                { state: 'Container', textToken: '--color-text-default', backgroundToken: '--color-surface-default', borderToken: '--color-border-default' },
                { state: 'Overlay', textToken: '—', backgroundToken: '--color-overlay', borderToken: '—' },
            ],
        },
    ],

    structure: [
        { part: 'Overlay', token: 'z-index: 1000', value: 'Fixed position' },
        { part: 'Container', token: 'border-radius-l', value: '12px' },
        { part: 'Padding', token: 'spacing-6', value: '24px' },
    ],

    relatedComponents: [
        { name: 'ConfirmationModal', description: 'Simplified modal for confirmations', path: 'components/feedback/confirmation-modal' },
        { name: 'Drawer', description: 'Side panel overlay', path: 'components/overlays/drawer' },
        { name: 'Alert', description: 'Inline feedback messages', path: 'components/feedback/alert' },
    ],
};

export default ModalDoc;
