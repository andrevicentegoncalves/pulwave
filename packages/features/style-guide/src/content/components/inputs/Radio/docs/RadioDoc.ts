import { ComponentDoc } from '@pulwave/features-style-guide';
import { RadioDemo } from '../demos';

export const RadioDoc: ComponentDoc = {
    name: 'Radio',
    subtitle: 'Single-selection input for mutually exclusive options.',
    description: 'Radio buttons for single-selection from a list of options. Use RadioGroup for managing multiple options.',
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
        'When users need to select exactly one option from a list',
        'For form fields with mutually exclusive choices',
        'When you need to show all available options at once',
        'Settings or preferences with limited options',
        'Survey or questionnaire answers',
    ],

    whenNotToUse: [
        { text: 'For multiple selections', alternative: 'Checkbox or CheckboxGroup' },
        { text: 'For a large list of options', alternative: 'Select component' },
        { text: 'For toggling a single option on/off', alternative: 'Switch component' },
        { text: 'For yes/no questions', alternative: 'Switch or Checkbox' },
    ],

    overview: {
        description: 'Radio buttons allow users to select a single option from a set.',
        variants: ['default', 'card'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard radio button group.',
                component: RadioDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Radio Circle', description: 'Visual indicator showing selection state' },
                { name: '2. Label', description: 'Text describing the option' },
                { name: '3. Description', description: 'Optional additional context' },
            ]
        },
        emphasis: 'Selected state clearly indicated with filled circle.',
        alignment: 'Vertically stacked for readability, horizontal for 2-3 options.',
    },

    content: {
        mainElements: 'Label should clearly describe the option.',
        overflowContent: 'Long labels wrap to multiple lines.',
        internationalization: 'Labels and descriptions should be translatable.',
    },

    designRecommendations: [
        'Always use within a RadioGroup for proper behavior.',
        'Provide a default selection when appropriate.',
        'Keep option labels concise and distinct.',
        'Use description for additional context when needed.',
        'Group related radio buttons visually.',
    ],

    developmentConsiderations: [
        'Use RadioGroup to manage selection state.',
        'Ensure proper name attribute for form submission.',
        'Handle keyboard navigation within the group.',
        'Consider controlled vs uncontrolled patterns.',
    ],

    props: [
        { name: 'label', type: 'ReactNode', description: 'Radio button label' },
        { name: 'value', type: 'string', required: true, description: 'Value for the radio option' },
        { name: 'size', type: '"s" | "m" | "l"', defaultValue: '"m"', description: 'Size variant' },
        { name: 'description', type: 'string', description: 'Additional description text' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disabled state' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Space', action: 'Selects the focused radio button' },
            { key: 'Arrow Up/Down', action: 'Moves focus between radio options' },
            { key: 'Arrow Left/Right', action: 'Moves focus between radio options' },
        ],
        aria: [
            { attribute: 'role="radio"', usage: 'Identifies as radio button' },
            { attribute: 'aria-checked', usage: 'Indicates selection state' },
            { attribute: 'aria-describedby', usage: 'References description text' },
        ],
        screenReader: 'Radio buttons announce their label and checked state.',
        focusIndicator: 'Focus ring around the radio circle.',
    },

    relatedComponents: [
        { name: 'RadioGroup', description: 'Container for radio buttons', path: 'components/inputs/radio-group' },
        { name: 'Checkbox', description: 'Multi-selection input', path: 'components/inputs/checkbox' },
        { name: 'Select', description: 'Dropdown selection', path: 'components/inputs/select' },
        { name: 'Switch', description: 'Toggle for binary options', path: 'components/inputs/switch' },
    ],
};

export default RadioDoc;

