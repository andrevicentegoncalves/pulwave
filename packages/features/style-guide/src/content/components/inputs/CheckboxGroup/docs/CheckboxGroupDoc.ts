import type { ComponentDoc } from '@pulwave/features-style-guide';
import { CheckboxGroupBasicDemo, CheckboxGroupHorizontalDemo } from '../demos';

export const CheckboxGroupDoc: ComponentDoc = {
    name: 'CheckboxGroup',
    displayName: 'Checkbox Group',
    subtitle: 'Multi-selection control for grouped options.',
    description: 'A group of checkboxes for multi-selection with consistent styling and built-in state management.',
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
        'Allow users to select multiple options from a list',
        'Group related checkbox options together',
        'Need controlled or uncontrolled multi-select behavior',
        'Form fields requiring multiple selections',
        'Filter or preference settings',
    ],
    whenNotToUse: [
        { text: 'Single selection required', alternative: 'Radio or RadioGroup' },
        { text: 'Binary on/off toggle', alternative: 'Switch component' },
        { text: 'Large option sets', alternative: 'MultiSelect dropdown' },
        { text: 'Hierarchical selection', alternative: 'TreeSelect component' },
    ],

    overview: {
        description: 'CheckboxGroup provides consistent multi-selection with label, error state, and orientation options.',
        variants: ['vertical', 'horizontal'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard vertical checkbox group.',
                component: CheckboxGroupBasicDemo,
            },
            {
                name: 'Horizontal Layout',
                description: 'Checkbox group arranged horizontally.',
                component: CheckboxGroupHorizontalDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Group Label', description: 'Describes the checkbox group' },
                { name: '2. Checkboxes', description: 'Individual checkbox items' },
                { name: '3. Helper Text', description: 'Optional guidance below the group' },
                { name: '4. Error Message', description: 'Validation feedback' },
            ]
        },
        emphasis: 'Group label should clearly describe what users are selecting.',
        alignment: 'Vertical layout for many options, horizontal for few (2-4).',
    },

    content: {
        mainElements: 'Group label and individual option labels should be concise.',
        overflowContent: 'Long option labels wrap to next line.',
        internationalization: 'Labels and helper text should be translatable.',
    },

    designRecommendations: [
        'Use vertical layout for more than 4 options.',
        'Provide clear group label describing the selection.',
        'Show helper text for additional context.',
        'Display error messages near the group.',
        'Consider "Select all" option for many checkboxes.',
    ],

    developmentConsiderations: [
        'Support both controlled and uncontrolled modes.',
        'Handle form integration with proper name attribute.',
        'Validate minimum/maximum selections if needed.',
        'Ensure all checkboxes share the same name for form submission.',
    ],

    props: [
        { name: 'name', type: 'string', required: true, description: 'Name for the checkbox group' },
        { name: 'options', type: 'CheckboxGroupOption[]', required: true, description: 'Array of checkbox options' },
        { name: 'value', type: 'string[]', description: 'Controlled selected values' },
        { name: 'defaultValue', type: 'string[]', description: 'Default selected values (uncontrolled)' },
        { name: 'onChange', type: '(value: string[]) => void', description: 'Callback when selection changes' },
        { name: 'label', type: 'string', description: 'Group label' },
        { name: 'helperText', type: 'string', description: 'Helper text below the group' },
        { name: 'error', type: 'string', description: 'Error message' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disable all checkboxes' },
        { name: 'orientation', type: '"horizontal" | "vertical"', defaultValue: '"vertical"', description: 'Layout orientation' },
        { name: 'size', type: '"s" | "m" | "l"', defaultValue: '"m"', description: 'Checkbox size' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Move focus between checkboxes' },
            { key: 'Space', action: 'Toggle checkbox state' },
        ],
        aria: [
            { attribute: 'role="group"', usage: 'Container role for the checkbox group' },
            { attribute: 'aria-labelledby', usage: 'References the group label' },
            { attribute: 'aria-describedby', usage: 'References helper or error text' },
            { attribute: 'aria-invalid', usage: 'Indicates validation error' },
        ],
        screenReader: 'Group label announced, each checkbox announces label and state.',
        focusIndicator: 'Focus ring on each checkbox when focused.',
    },

    relatedComponents: [
        { name: 'Checkbox', description: 'Single checkbox input', path: 'components/inputs/checkbox' },
        { name: 'RadioGroup', description: 'Single selection from options', path: 'components/inputs/radio-group' },
        { name: 'Switch', description: 'Toggle for binary options', path: 'components/inputs/switch' },
        { name: 'MultiSelect', description: 'Dropdown multi-selection', path: 'components/inputs/multi-select' },
    ],
};

export default CheckboxGroupDoc;
