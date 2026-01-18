import { ComponentDoc } from '@pulwave/features-style-guide';
import { CheckboxStatesDemo } from '../demos';

const CheckboxDoc: ComponentDoc = {
    name: 'Checkbox',
    subtitle: 'Binary selection control for options.',
    description: 'Checkbox is a binary selection control for toggling options on or off, supporting checked, unchecked, and indeterminate states with full accessibility.',
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
        'Multiple selection from a list of options',
        'Terms and conditions acceptance',
        'Feature toggles in settings',
        'Bulk selection in data tables',
        'Form fields requiring yes/no answers',
    ],

    whenNotToUse: [
        { text: 'Single exclusive option from list', alternative: 'Radio buttons' },
        { text: 'Immediate toggle action', alternative: 'Switch component' },
        { text: 'Selecting from many options', alternative: 'Select or MultiSelect' },
        { text: 'Complex hierarchical selection', alternative: 'TreeSelect' },
    ],

    overview: {
        description: 'Checkbox with label, indeterminate state support, and accessible markup.',
        variants: ['default', 'primary'],
        demos: [
            {
                name: 'Checkbox States',
                description: 'Various states of the single checkbox component.',
                component: CheckboxStatesDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Checkbox Box', description: 'Visual indicator showing checked state' },
                { name: '2. Check Mark', description: 'Icon showing selection (tick or dash)' },
                { name: '3. Label', description: 'Text describing the option' },
                { name: '4. Helper Text', description: 'Optional description below label' },
            ]
        },
        emphasis: 'Label should clearly describe what happens when checked.',
        alignment: 'Checkbox aligns to start of label text baseline.',
    },

    content: {
        mainElements: 'Label text should be concise and describe the option positively.',
        overflowContent: 'Long labels wrap to multiple lines, checkbox stays aligned to first line.',
        internationalization: 'Labels must be translatable. Allow extra width for translations.',
    },

    designRecommendations: [
        'Use positive phrasing for labels (what will happen when checked).',
        'Group related checkboxes using CheckboxGroup.',
        'Provide visual feedback for all states (hover, focus, disabled).',
        'Use indeterminate state only for parent checkboxes in hierarchies.',
    ],

    developmentConsiderations: [
        'Use controlled or uncontrolled mode based on form requirements.',
        'Indeterminate state must be set via JavaScript (not HTML attribute).',
        'Associate label with checkbox using htmlFor and id.',
        'Handle onChange callback for state updates.',
    ],

    props: [
        { name: 'checked', type: 'boolean', required: false, description: 'Whether the checkbox is checked.' },
        { name: 'indeterminate', type: 'boolean', required: false, description: 'Whether the checkbox shows indeterminate state.' },
        { name: 'disabled', type: 'boolean', required: false, description: 'Whether the checkbox is disabled.' },
        { name: 'label', type: 'string', required: false, description: 'Label text for the checkbox.' },
        { name: 'onChange', type: '(checked: boolean) => void', required: false, description: 'Callback when checkbox state changes.' },
        { name: 'name', type: 'string', required: false, description: 'Form field name.' },
        { name: 'value', type: 'string', required: false, description: 'Value submitted with form.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Space', action: 'Toggle checkbox checked state' },
            { key: 'Tab', action: 'Move focus to next focusable element' },
        ],
        aria: [
            { attribute: 'role="checkbox"', usage: 'Implicit for input type=checkbox' },
            { attribute: 'aria-checked', usage: 'true, false, or mixed (indeterminate)' },
            { attribute: 'aria-disabled', usage: 'When checkbox is disabled' },
            { attribute: 'aria-describedby', usage: 'Links to helper text if present' },
        ],
        screenReader: 'Announces: "[Label], checkbox, [checked/not checked/mixed]".',
        focusIndicator: 'Visible focus ring around checkbox box.',
    },

    relatedComponents: [
        { name: 'CheckboxGroup', description: 'Group of related checkboxes', path: 'components/inputs/checkbox-group' },
        { name: 'Switch', description: 'Toggle for immediate actions', path: 'components/inputs/switch' },
        { name: 'Radio', description: 'Single selection from options', path: 'components/inputs/radio' },
    ],
};

export default CheckboxDoc;
