/**
 * FormDoc - Documentation for Form pattern component
 * 
 * Form is a pattern component providing form structure and layout.
 * 
 * @version 1.0.0
 */
import * as FormDemos from '../demos';

const FormDoc = {
    name: 'Form',
    description: 'Form wrapper component with layout variants and sub-components for structured form building.',
    status: 'stable' as const,
    version: '1.0.0',
    lastUpdated: '2026-01-01',

    // Accessibility Testing Status
    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    // When to Use
    whenToUse: [
        'Creating data entry forms of any complexity',
        'Need consistent form layout across the application',
        'Require form submission handling',
        'Need to group related form fields',
    ],

    whenNotToUse: [
        { text: 'Single input field', alternative: 'Input component directly' },
        { text: 'Read-only data display', alternative: 'Data display components' },
        { text: 'Complex multi-step flows', alternative: 'Wizard component' },
    ],

    // Overview
    overview: {
        description: 'Form is a compound pattern component that provides consistent structure for forms. It includes Form (wrapper), FormGroup (field grouping), FormRow (horizontal layouts), and FormActions (button containers).',
        variants: ['vertical', 'horizontal', 'inline'],
        demos: [
            {
                name: 'Basic Form',
                description: 'Simple vertical form with field grouping.',
                component: FormDemos.FormBasicDemo,
            },
            {
                name: 'Form with Rows',
                description: 'Side-by-side fields using FormRow.',
                component: FormDemos.FormWithRowsDemo,
            },
            {
                name: 'Horizontal Layout',
                description: 'Labels aligned to the left of inputs.',
                component: FormDemos.FormHorizontalDemo,
            },
            {
                name: 'Actions Alignment',
                description: 'FormActions supports left, center, right, and space-between alignment.',
                component: FormDemos.FormActionsDemo,
            }
        ]
    },

    // Formatting
    formatting: {
        anatomy: {
            parts: [
                { name: 'Form', description: 'Root form element with layout class' },
                { name: 'FormGroup', description: 'Logical grouping of related fields' },
                { name: 'FormRow', description: 'Horizontal layout for side-by-side fields' },
                { name: 'FormActions', description: 'Container for submit/cancel buttons' },
            ]
        },
        layouts: [
            { name: 'vertical', description: 'Labels above inputs, full-width fields (default)' },
            { name: 'horizontal', description: 'Labels inline with inputs, fixed label width' },
            { name: 'inline', description: 'All fields in a single row, compact' },
        ],
    },

    // Props
    props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Form content' },
        { name: 'onSubmit', type: '(e: FormEvent) => void', description: 'Submit handler (preventDefault called automatically)' },
        { name: 'layout', type: "'vertical' | 'horizontal' | 'inline'", default: "'vertical'", description: 'Form layout variant' },
        { name: 'className', type: 'string', description: 'Additional CSS class' },
    ],

    // Sub-components
    subComponents: [
        {
            name: 'FormGroup',
            description: 'Groups related form fields with visual separation',
            props: [
                { name: 'children', type: 'ReactNode', required: true, description: 'Group content' },
                { name: 'className', type: 'string', description: 'Additional CSS class' },
            ]
        },
        {
            name: 'FormRow',
            description: 'Horizontal layout for placing fields side-by-side',
            props: [
                { name: 'children', type: 'ReactNode', required: true, description: 'Row content' },
                { name: 'gap', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Gap between items' },
                { name: 'className', type: 'string', description: 'Additional CSS class' },
            ]
        },
        {
            name: 'FormActions',
            description: 'Container for form action buttons',
            props: [
                { name: 'children', type: 'ReactNode', required: true, description: 'Buttons' },
                { name: 'align', type: "'left' | 'center' | 'right' | 'space-between'", default: "'right'", description: 'Button alignment' },
                { name: 'className', type: 'string', description: 'Additional CSS class' },
            ]
        },
    ],

    // Accessibility
    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between form fields' },
            { key: 'Enter', action: 'Submit form (when focus on button or input)' },
            { key: 'Escape', action: 'Cancel/close form if in modal' },
        ],
        aria: [
            { attribute: 'aria-labelledby', usage: 'Link form to its heading' },
            { attribute: 'aria-describedby', usage: 'Link fields to help text' },
            { attribute: 'aria-required', usage: 'Mark required fields' },
            { attribute: 'aria-invalid', usage: 'Mark fields with errors' },
        ],
    },

    // In Use (Do/Don't)
    inUse: {
        dos: [
            'Use FormGroup to organize related fields (personal info, address, etc.)',
            'Use FormRow for fields that logically belong side-by-side (first/last name, city/state)',
            'Always place primary action on the right in FormActions',
            'Use vertical layout for most forms',
        ],
        donts: [
            'Don\'t nest Form components',
            'Don\'t use horizontal layout for mobile-first designs',
            'Don\'t forget to add labels to all form fields',
            'Don\'t use inline layout for more than 3 fields',
        ],
    },

    // Related Components
    relatedComponents: [
        { name: 'FormGrid', description: 'CSS Grid-based form layout' },
        { name: 'Input', description: 'Text input fields' },
        { name: 'Select', description: 'Dropdown selections' },
        { name: 'Wizard', description: 'Multi-step form flows' },
    ],
};

export default FormDoc;
