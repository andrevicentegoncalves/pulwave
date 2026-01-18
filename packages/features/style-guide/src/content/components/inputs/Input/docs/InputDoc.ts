
import {
    InputFullWidthDemo,
    InputHelperTextDemo,
    InputRequiredDemo,
    InputSizesDemo,
    InputStatesDemo,
    InputTypesDemo,
    InputWithIconsDemo
} from '../demos';
const InputDoc = {
    name: 'Input',
    description: 'Text inputs allow users to enter and edit text in forms.',
    status: 'stable' as const,
    version: '1.0.0',
    lastUpdated: '2024-12-30',

    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    whenToUse: [
        'Single-line text entry (names, emails, etc.)',
        'Password input with visibility toggle',
        'Search queries',
        'Numeric input with formatting',
        'Form fields requiring validation',
    ],

    whenNotToUse: [
        { text: 'Multi-line text content', alternative: 'Textarea component' },
        { text: 'Selecting from predefined options', alternative: 'Select or RadioGroup' },
        { text: 'Date/time input', alternative: 'DatePicker component' },
        { text: 'Rich text editing', alternative: 'RichTextEditor' },
    ],

    overview: {
        description: 'The Input component provides a styled text input field with support for labels, validation states, helper text, and various input types.',
        variants: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'],
        demos: [
            {
                name: 'Sizes',
                description: 'Inputs come in three sizes: small sc(s), medium (m), and large (l).',
                component: InputSizesDemo,
            },
            {
                name: 'States',
                description: 'Visual feedback for enabled, hover, focused, disabled, and error interaction states.',
                component: InputStatesDemo,
            },
            {
                name: 'Input Types',
                description: 'Support for various HTML input types including text, password, number, and more.',
                component: InputTypesDemo,
            },
            {
                name: 'With Icons',
                description: 'Inputs with leading and trailing icons to provide context or actions.',
                component: InputWithIconsDemo,
            },
            {
                name: 'Helper Text & Error',
                description: 'Support for helper text and validation error messages.',
                component: InputHelperTextDemo,
            },
            {
                name: 'Required Fields',
                description: 'Visual indicator for required input fields.',
                component: InputRequiredDemo,
            },
            {
                name: 'Full Width',
                description: 'Inputs can extend to fill the width of their container.',
                component: InputFullWidthDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Label', description: 'Descriptive text above the input' },
                { name: '2. Required Indicator', description: 'Asterisk for required fields' },
                { name: '3. Input Field', description: 'Text entry area' },
                { name: '4. Leading Icon', description: 'Optional icon before text' },
                { name: '5. Trailing Icon', description: 'Optional icon/action after text' },
                { name: '6. Helper Text', description: 'Guidance text below input' },
                { name: '7. Error Message', description: 'Validation error feedback' },
            ]
        },
        sizes: [
            { name: 'Small (s)', height: '32px', description: 'Compact forms, filters' },
            { name: 'Medium (m)', height: '40px', description: 'Default for most forms' },
            { name: 'Large (l)', height: '48px', description: 'Touch-friendly, primary forms' },
        ],
        emphasis: 'Use consistent sizing within a form. Labels should always be visible.',
        alignment: 'Inputs should align to a consistent grid. Full-width in narrow containers.',
    },

    content: {
        mainElements: 'Labels should be concise and descriptive. Placeholder text should not replace labels.',
        overflowContent: 'Long input text scrolls horizontally. Labels should not truncate.',
        internationalization: 'Allow for longer translated labels. Support RTL text direction.',
        furtherGuidance: 'Never use placeholder as the only label - it disappears on input.',
    },

    universalBehaviors: {
        states: 'Input has states: enabled, hover, focused, filled, disabled, error, and readonly.',
        interactions: {
            mouse: 'Click to focus. Click trailing icon for actions (clear, toggle password).',
            keyboard: 'Tab to focus. Type to enter text. Escape to clear (if enabled).',
        },
        loading: 'Show spinner in trailing position for async validation.',
    },

    variantDocs: [
        {
            name: 'Text Input',
            description: 'Standard single-line text input for general text entry.',
            bestPractices: ['Always include visible label', 'Use placeholder for examples, not labels'],
        },
        {
            name: 'Password Input',
            description: 'Masked text input with visibility toggle.',
            bestPractices: ['Include show/hide password toggle', 'Show password requirements'],
        },
        {
            name: 'Search Input',
            description: 'Input optimized for search with search icon and clear button.',
            bestPractices: ['Include search icon', 'Show clear button when filled'],
        },
    ],

    modifiers: [
        { name: 'With Leading Icon', description: 'Icon before input text for context (email, phone).' },
        { name: 'With Trailing Icon', description: 'Icon/button after input (clear, show password).' },
        { name: 'With Character Count', description: 'Shows remaining characters for limited inputs.' },
        { name: 'Required', description: 'Asterisk indicator for required fields.' },
    ],

    props: [
        { name: 'type', type: "'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'", default: "'text'", required: false, description: 'Input type' },
        { name: 'size', type: "'s' | 'm' | 'l'", default: "'m'", required: false, description: 'Size variant' },
        { name: 'label', type: 'string', default: '—', required: false, description: 'Field label' },
        { name: 'placeholder', type: 'string', default: '—', required: false, description: 'Placeholder text' },
        { name: 'helperText', type: 'string', default: '—', required: false, description: 'Helper text below input' },
        { name: 'error', type: 'string | boolean', default: 'false', required: false, description: 'Error state/message' },
        { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disabled state' },
        { name: 'required', type: 'boolean', default: 'false', required: false, description: 'Required indicator' },
        { name: 'leftIcon', type: 'ReactNode', default: '—', required: false, description: 'Icon before input' },
        { name: 'rightIcon', type: 'ReactNode', default: '—', required: false, description: 'Icon/action after input' },
        { name: 'fullWidth', type: 'boolean', default: 'false', required: false, description: 'Expand to full width' },
    ],

    styleTokens: [
        {
            variant: 'Default',
            states: [
                { state: 'Enabled', textToken: '--color-on-surface-default', backgroundToken: '--color-surface-default', borderToken: '--color-border-default' },
                { state: 'Hover', textToken: '--color-on-surface-default', backgroundToken: '--color-surface-default', borderToken: '--color-border-hover' },
                { state: 'Focused', textToken: '--color-on-surface-default', backgroundToken: '--color-surface-default', borderToken: '--color-primary' },
                { state: 'Error', textToken: '--color-on-surface-default', backgroundToken: '--color-surface-default', borderToken: '--color-feedback-error' },
                { state: 'Disabled', textToken: '--color-on-surface-disabled', backgroundToken: '--color-surface-disabled', borderToken: '--color-border-disabled' },
            ],
        },
    ],

    structure: [
        { part: 'Padding (horizontal)', token: '--spacing-3', value: '12px' },
        { part: 'Padding (vertical)', token: '--spacing-2', value: '8px' },
        { part: 'Label margin bottom', token: '--spacing-2', value: '8px' },
        { part: 'Helper margin top', token: '--spacing-1', value: '4px' },
        { part: 'Border radius', token: '--border-radius-m', value: '8px' },
    ],

    anatomy: {
        parts: [
            { name: 'Label', description: 'Field label above input' },
            { name: 'Input', description: 'Text entry field' },
            { name: 'Helper/Error', description: 'Text below input' },
        ]
    },

    inUse: {
        dos: [
            'Always include visible labels',
            'Use helpful placeholder examples',
            'Show clear error messages',
            'Indicate required fields',
            'Validate on blur, not keystroke',
        ],
        donts: [
            'Don\'t use placeholder as the only label',
            'Don\'t validate every keystroke',
            'Don\'t hide labels after input',
            'Don\'t use red borders for non-error states',
        ],
        examples: []
    },

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Move focus to/from input' },
            { key: 'Type', action: 'Enter text content' },
            { key: 'Escape', action: 'Clear input (if enabled)' },
        ],
        aria: [
            { attribute: 'aria-label / aria-labelledby', usage: 'Required for accessible name' },
            { attribute: 'aria-describedby', usage: 'Link to helper/error text' },
            { attribute: 'aria-invalid', usage: 'When in error state' },
            { attribute: 'aria-required', usage: 'When required prop is true' },
        ],
        screenReader: 'Announces: "[label], edit text, [value]". On error: "[error message]".',
        focusIndicator: '2px solid focus ring using --color-focus-ring token',
    },

    designRecommendations: [
        'Use floating labels carefully - always visible labels are more accessible',
        'Group related inputs with consistent spacing',
        'Align labels above inputs for vertical forms, inline for horizontal',
    ],

    developmentConsiderations: [
        'Associate labels with inputs via htmlFor/id',
        'Connect error messages with aria-describedby',
        'Manage focus on validation errors',
        'Use appropriate input types for mobile keyboards',
    ],

    relatedComponents: [
        { name: 'Textarea', description: 'Use for multi-line text input' },
        { name: 'Select', description: 'Use for selecting from predefined options' },
        { name: 'SearchInput', description: 'Use for search-specific functionality' },
    ],

    responsiveBehavior: [
        { breakpoint: 'Desktop (>1024px)', behavior: 'Standard sizing, can be inline or full-width' },
        { breakpoint: 'Mobile (<768px)', behavior: 'Full-width recommended, touch-friendly sizing' },
    ],
};

export default InputDoc;
