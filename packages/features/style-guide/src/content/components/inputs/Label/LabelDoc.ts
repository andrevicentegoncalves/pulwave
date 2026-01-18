import type { ComponentDocProps } from '@pulwave/features-style-guide';

export const labelDoc: ComponentDocProps['docs'] = {
    name: 'Label',
    description: 'Form field labels with support for required/optional indicators and description text.',
    status: 'stable',
    version: '1.0.0',

    whenToUse: [
        'To label form inputs, selects, and textareas',
        'To indicate required or optional fields',
        'To provide additional helper text for form fields',
    ],

    whenNotToUse: [
        { text: 'For non-form context labeling', alternative: 'Badge' },
        { text: 'For section headings', alternative: 'use heading elements' },
    ],

    props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Label text content' },
        { name: 'htmlFor', type: 'string', description: 'ID of the associated form element' },
        { name: 'size', type: "'s' | 'm' | 'l'", default: "'m'", description: 'Size variant' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Show required indicator (*)' },
        { name: 'optional', type: 'boolean', default: 'false', description: 'Show "(optional)" text' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
        { name: 'description', type: 'string', description: 'Helper text below the label' },
    ],

    accessibility: {
        screenReader: 'Labels are properly associated with form controls via htmlFor.',
    },
};

export default labelDoc;

