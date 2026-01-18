import { ComponentDoc } from '@pulwave/features-style-guide';
import InlineEditBasicDemo from '../demos/InlineEditBasicDemo';

export const InlineEditDoc: ComponentDoc = {
    name: 'InlineEdit',
    description: 'A component that allows users to switch between reading and editing text in context, providing a seamless editing experience without navigation.',
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
        'Quick edits to titles, names, or labels',
        'Editable table cells',
        'Profile field editing without form navigation',
        'List item renaming',
        'Settings values that rarely change',
    ],

    whenNotToUse: [
        { text: 'Complex multi-field forms', alternative: 'Form with Input components' },
        { text: 'Required validation before save', alternative: 'Modal with form' },
        { text: 'New content creation', alternative: 'Dedicated form or page' },
        { text: 'Rich text editing', alternative: 'RichTextEditor component' },
    ],

    overview: {
        description: 'A component that allows users to switch between reading and editing text in context with keyboard support.',
        variants: ['input', 'textarea'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Inline edit for text input.',
                component: InlineEditBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Read View', description: 'Text display when not editing' },
                { name: '2. Edit View', description: 'Input field when editing' },
                { name: '3. Edit Indicator', description: 'Visual cue that content is editable' },
            ]
        },
        emphasis: 'Read view should match surrounding text style. Edit view provides clear visual distinction.',
        alignment: 'Maintains same position and width between read and edit states to prevent layout shift.',
    },

    content: {
        mainElements: 'Text display that transforms into an input on interaction.',
        overflowContent: 'Long text truncates in read mode. Textarea variant supports multiline content.',
        internationalization: 'Placeholder and label should be translatable. RTL layouts supported.',
    },

    props: [
        { name: 'value', type: 'string', description: 'The controlled value for the input.' },
        { name: 'defaultValue', type: 'string', description: 'The default value for uncontrolled usage.' },
        { name: 'onSave', type: '(value: string) => void', required: true, description: 'Callback fired when the user commits the change (Enter or Blur).' },
        { name: 'onCancel', type: '() => void', description: 'Callback fired when the user cancels editing (Escape).' },
        { name: 'onChange', type: '(value: string) => void', description: 'Callback fired on input value change.' },
        { name: 'as', type: '"input" | "textarea"', defaultValue: '"input"', description: 'The type of input to render in edit mode.' },
        { name: 'label', type: 'string', description: 'Accessible label for the input (required for accessibility).' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables editing interaction.' },
        { name: 'placeholder', type: 'string', description: 'Placeholder text shown when value is empty.' }
    ],

    accessibility: {
        keyboard: [
            { key: 'Enter', action: 'Save changes (for single-line input)' },
            { key: 'Escape', action: 'Cancel editing and revert' },
            { key: 'Tab', action: 'Move focus (may trigger save on blur)' },
            { key: 'Click/Focus', action: 'Enter edit mode' },
        ],
        aria: [
            { attribute: 'role="button"', usage: 'Read view is interactive' },
            { attribute: 'aria-label', usage: 'Describes the editable field' },
            { attribute: 'aria-expanded', usage: 'Indicates edit mode state' },
        ],
        screenReader: 'Announces: "[label], editable, [value]". Edit mode announces "[label], editing".',
        focusIndicator: 'Focus ring on read view. Standard input focus in edit mode.',
    },

    relatedComponents: [
        { name: 'Input', description: 'Standard form input', path: 'components/inputs/input' },
        { name: 'TextArea', description: 'Multiline text input', path: 'components/inputs/text-area' },
        { name: 'DataTable', description: 'For editable table cells', path: 'components/data-display/data-table' },
    ],
};

export default InlineEditDoc;
