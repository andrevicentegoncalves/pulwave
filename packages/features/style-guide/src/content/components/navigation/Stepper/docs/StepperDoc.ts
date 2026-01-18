/**
 * StepperDoc - Documentation for Stepper component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import StepperDemo from '../demos/StepperDemo';

const StepperDoc: ComponentDoc = {
    name: 'Stepper',
    subtitle: 'Step progress indicator for multi-step processes.',
    description: 'Stepper displays progress through a sequence of steps, commonly used in wizards, multi-step forms, or checkout flows to show users where they are in a process.',
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
        'Multi-step forms or wizards',
        'Checkout and payment flows',
        'Onboarding sequences',
        'Sequential data entry processes',
        'Configuration wizards',
    ],

    whenNotToUse: [
        { text: 'Navigation between unrelated pages', alternative: 'Tabs component' },
        { text: 'Showing page hierarchy', alternative: 'Breadcrumbs component' },
        { text: 'Non-sequential task lists', alternative: 'Checklist or TaskList' },
        { text: 'Simple progress indication', alternative: 'Progress component' },
    ],

    overview: {
        description: 'Stepper displays progress through a sequence of steps with visual indicators.',
        variants: ['horizontal', 'vertical'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Usage example of the Stepper component.',
                component: StepperDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Step Indicator', description: 'Number or icon showing step position' },
                { name: '2. Step Label', description: 'Title text for the step' },
                { name: '3. Step Description', description: 'Optional subtitle or description' },
                { name: '4. Connector Line', description: 'Visual line connecting steps' },
            ]
        },
        emphasis: 'Active step is highlighted with primary color. Completed steps show check mark.',
        alignment: 'Horizontal layout for desktop, vertical for mobile or complex steps.',
    },

    content: {
        mainElements: 'Step labels should be short and action-oriented (e.g., "Review", "Payment").',
        overflowContent: 'Long labels truncate with ellipsis. Use descriptions for additional detail.',
        internationalization: 'Labels and descriptions should be translatable.',
    },

    designRecommendations: [
        'Keep step count between 3-7 for optimal usability.',
        'Use descriptive but concise step labels.',
        'Provide visual feedback for completed, active, and upcoming steps.',
        'Consider vertical layout for mobile or when steps have descriptions.',
    ],

    developmentConsiderations: [
        'activeStep is 0-indexed (first step is 0).',
        'Use clickable=true to allow navigation to completed steps.',
        'Steps array should include label and optional description.',
        'Handle onStepClick callback for clickable steps.',
    ],

    props: [
        { name: 'steps', type: 'StepperStep[]', required: true, description: 'Array of step definitions with label and optional description.' },
        { name: 'activeStep', type: 'number', required: true, description: 'Current active step (0-indexed).' },
        { name: 'orientation', type: '"horizontal" | "vertical"', required: false, description: 'Layout orientation.', defaultValue: '"horizontal"' },
        { name: 'size', type: '"s" | "m" | "l"', required: false, description: 'Size variant.', defaultValue: '"m"' },
        { name: 'clickable', type: 'boolean', required: false, description: 'Allow clicking on completed steps.', defaultValue: 'false' },
        { name: 'onStepClick', type: '(stepIndex: number) => void', required: false, description: 'Callback when a clickable step is clicked.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between clickable steps' },
            { key: 'Enter/Space', action: 'Activate clickable step' },
            { key: 'Arrow Keys', action: 'Navigate between steps (horizontal/vertical)' },
        ],
        aria: [
            { attribute: 'role="progressbar"', usage: 'Indicates progress tracking' },
            { attribute: 'aria-valuenow', usage: 'Current step number' },
            { attribute: 'aria-valuemin', usage: 'First step (1)' },
            { attribute: 'aria-valuemax', usage: 'Total number of steps' },
            { attribute: 'aria-current="step"', usage: 'Marks active step' },
        ],
        screenReader: 'Announces: "Step [N] of [Total]: [Label], [status]".',
        focusIndicator: 'Visible focus ring on clickable steps.',
    },

    relatedComponents: [
        { name: 'Wizard', description: 'Full wizard pattern with stepper', path: 'patterns/process/wizard' },
        { name: 'Tabs', description: 'Non-sequential navigation', path: 'components/navigation/tabs' },
        { name: 'Breadcrumbs', description: 'Hierarchical navigation', path: 'components/navigation/breadcrumbs' },
        { name: 'Progress', description: 'Simple progress indicator', path: 'components/data-display/progress' },
    ],
};

export default StepperDoc;
