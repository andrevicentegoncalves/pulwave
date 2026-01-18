import { ComponentDoc } from '@pulwave/features-style-guide';
import { TextAreaBasicDemo, TextAreaStatesDemo } from '../demos';

const TextAreaDoc: ComponentDoc = {
    name: 'TextArea',
    subtitle: 'Multi-line text input field.',
    description: 'TextArea is a multi-line text input field for longer text entries like comments, descriptions, or addresses, with support for resizing, character count, and validation states.',
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
        'Long text entries (comments, descriptions, bio)',
        'Multi-line addresses or notes',
        'Text-heavy content input without formatting',
        'Form fields requiring paragraph text',
        'Feedback or message forms',
    ],

    whenNotToUse: [
        { text: 'Single line text', alternative: 'Input component' },
        { text: 'Rich text editing', alternative: 'RichTextEditor component' },
        { text: 'Code or monospace content', alternative: 'Code editor component' },
        { text: 'Auto-expanding single line', alternative: 'Input with auto-resize' },
    ],

    overview: {
        description: 'TextArea with resizable height, label, and error state support.',
        variants: ['default', 'resizable', 'auto-resize'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard text area with character count and label.',
                component: TextAreaBasicDemo,
            },
            {
                name: 'States',
                description: 'Various states including error, disabled, and readonly.',
                component: TextAreaStatesDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Label', description: 'Text identifying the field purpose' },
                { name: '2. Input Area', description: 'Multi-line text entry region' },
                { name: '3. Placeholder', description: 'Hint text when empty' },
                { name: '4. Character Count', description: 'Optional count showing remaining characters' },
                { name: '5. Helper/Error Text', description: 'Guidance or validation message' },
            ]
        },
        emphasis: 'Label is required for accessibility. Helper text provides context.',
        alignment: 'Full-width by default. Character count aligns to bottom-right.',
    },

    content: {
        mainElements: 'Label should describe expected content. Placeholder shows example format.',
        overflowContent: 'Content scrolls vertically within bounds. Optional auto-resize expands height.',
        internationalization: 'Labels and placeholders must be translatable. RTL support included.',
    },

    designRecommendations: [
        'Provide clear placeholder text showing expected format.',
        'Use character count for fields with length limits.',
        'Set appropriate minimum height based on expected content.',
        'Consider auto-resize for better UX in forms.',
    ],

    developmentConsiderations: [
        'Use controlled mode for form validation.',
        'Set rows prop to control initial visible lines.',
        'Use maxLength to enforce character limits.',
        'Handle resize events if layout is affected.',
    ],

    props: [
        { name: 'value', type: 'string', required: false, description: 'Controlled value of the textarea.' },
        { name: 'defaultValue', type: 'string', required: false, description: 'Initial value for uncontrolled mode.' },
        { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text when empty.' },
        { name: 'label', type: 'string', required: false, description: 'Label text for the field.' },
        { name: 'rows', type: 'number', required: false, description: 'Number of visible text rows.', defaultValue: '3' },
        { name: 'maxLength', type: 'number', required: false, description: 'Maximum character count.' },
        { name: 'showCharacterCount', type: 'boolean', required: false, description: 'Show remaining character count.' },
        { name: 'resize', type: '"none" | "vertical" | "horizontal" | "both"', required: false, description: 'Resize behavior.', defaultValue: '"vertical"' },
        { name: 'error', type: 'string', required: false, description: 'Error message to display.' },
        { name: 'disabled', type: 'boolean', required: false, description: 'Whether the textarea is disabled.' },
        { name: 'onChange', type: '(value: string) => void', required: false, description: 'Callback when value changes.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Focus/unfocus the textarea' },
            { key: 'Enter', action: 'Insert new line' },
            { key: 'Ctrl/Cmd + A', action: 'Select all text' },
        ],
        aria: [
            { attribute: 'aria-label', usage: 'When no visible label is present' },
            { attribute: 'aria-describedby', usage: 'Links to helper/error text' },
            { attribute: 'aria-invalid', usage: 'When field has validation error' },
            { attribute: 'aria-required', usage: 'When field is required' },
        ],
        screenReader: 'Announces: "[Label], text area, [value if present], [error if present]".',
        focusIndicator: 'Visible focus ring around textarea border.',
    },

    relatedComponents: [
        { name: 'Input', description: 'Single-line text input', path: 'components/inputs/input' },
        { name: 'RichTextEditor', description: 'WYSIWYG text editing', path: 'components/inputs/rich-text-editor' },
        { name: 'Form', description: 'Form wrapper component', path: 'patterns/form/form' },
    ],
};

export default TextAreaDoc;
