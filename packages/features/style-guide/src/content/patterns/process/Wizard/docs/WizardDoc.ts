import { ComponentDoc } from '@pulwave/features-style-guide';

export const WizardDoc: ComponentDoc = {
    name: 'Wizard',
    subtitle: 'Step-by-step process guidance.',
    description: 'The Wizard component guides users through a multi-step process, displaying progress, validating steps, and managing navigation between steps with clear visual feedback.',
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
        'Multi-step registration or onboarding flows',
        'Complex form submissions with logical sections',
        'Checkout processes with multiple stages',
        'Setup or configuration workflows',
        'Any linear process requiring user guidance',
    ],

    whenNotToUse: [
        { text: 'Non-linear navigation', alternative: 'Tabs or accordion' },
        { text: 'Simple single-page forms', alternative: 'Form component' },
        { text: 'Content browsing', alternative: 'Tabs or pagination' },
        { text: 'Quick actions', alternative: 'Single confirmation modal' },
    ],

    overview: {
        description: 'Multi-step process guidance with progress tracking and navigation.',
        variants: ['default', 'with-icons'],
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Progress Indicator', description: 'Visual step progress (stepper)' },
                { name: '2. Step Title', description: 'Current step name' },
                { name: '3. Step Content', description: 'Form or content for current step' },
                { name: '4. Navigation Buttons', description: 'Back, Next, and Finish buttons' },
                { name: '5. Error Alert', description: 'Optional error message display' },
            ]
        },
        emphasis: 'Progress indicator shows completion. Current step content is the focus.',
        alignment: 'Progress top or side. Content centered. Navigation at bottom.',
    },

    content: {
        mainElements: 'Progress stepper, step content area, and navigation controls.',
        overflowContent: 'Step content scrolls independently. Navigation remains visible.',
        internationalization: 'Step titles, button labels, and error messages should be translatable.',
    },

    designRecommendations: [
        'Use for complex tasks that can be broken down into linear steps.',
        'Keep the number of steps manageable (3-5 is ideal).',
        'Clearly label each step and provide feedback upon completion.',
        'Allow users to navigate back to previous steps.',
    ],

    developmentConsiderations: [
        'Manage currentStep state in the parent component.',
        'Implement onNext, onBack, and onFinish handlers.',
        'Ensure the steps prop includes valid icons and titles.',
        'Validate step data before allowing progression.',
    ],

    props: [
        { name: 'steps', type: 'WizardStep[]', required: true, description: 'Array of step objects with title and icon.' },
        { name: 'currentStep', type: 'number', required: true, description: 'Index of the currently active step (0-based).' },
        { name: 'onNext', type: '() => void', required: true, description: 'Callback fired when the Next button is clicked.' },
        { name: 'onBack', type: '() => void', required: false, description: 'Callback fired when the Back button is clicked.' },
        { name: 'onFinish', type: '() => void', required: false, description: 'Callback fired when the Finish button is clicked.' },
        { name: 'loading', type: 'boolean', required: false, description: 'Shows loading state on the Finish button.', defaultValue: 'false' },
        { name: 'error', type: 'string | null', required: false, description: 'Error message to display at the top of the wizard.' },
        { name: 'onErrorDismiss', type: '() => void', required: false, description: 'Callback fired when the error alert is dismissed.' },
        { name: 'children', type: 'ReactNode', required: true, description: 'Step content to render.' },
        { name: 'className', type: 'string', required: false, description: 'Additional CSS classes.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate within step content and buttons' },
            { key: 'Enter', action: 'Activate focused button' },
            { key: 'Escape', action: 'Dismiss error alert if visible' },
        ],
        aria: [
            { attribute: 'aria-current="step"', usage: 'Identifies current step in progress' },
            { attribute: 'aria-describedby', usage: 'Links step to description' },
            { attribute: 'role="progressbar"', usage: 'Progress indicator semantics' },
            { attribute: 'aria-live="polite"', usage: 'Announces step changes' },
        ],
        screenReader: 'Announces: "Step [N] of [total]: [step title]". Error alerts announced immediately.',
        focusIndicator: 'Focus ring on navigation buttons and form elements.',
    },

    relatedComponents: [
        { name: 'Form', description: 'Single-step forms', path: 'patterns/form/form' },
        { name: 'Tabs', description: 'Non-linear navigation', path: 'components/navigation/tabs' },
        { name: 'Stepper', description: 'Progress indicator only', path: 'components/navigation/stepper' },
    ],
};

export default WizardDoc;

