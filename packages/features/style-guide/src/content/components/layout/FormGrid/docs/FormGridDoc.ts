import { ComponentDoc } from '@pulwave/features-style-guide';
import { FormGridBasicDemo } from '../demos';

export const FormGridDoc: ComponentDoc = {
    name: 'FormGrid',
    subtitle: 'Layout consistent form fields.',
    description: 'FormGrid provides a structured layout for form fields, ensuring consistent spacing and responsive column management across various screen sizes.',
    sourcePath: 'packages/ui/components/FormGrid/FormGrid.tsx',
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
        'Multi-field forms requiring consistent layout',
        'Registration or profile forms with grouped fields',
        'Settings pages with organized input sections',
        'Data entry forms with related field groups',
        'Responsive forms adapting to different screen sizes',
    ],

    whenNotToUse: [
        { text: 'Single-field forms', alternative: 'Simple Stack or inline layout' },
        { text: 'Non-form layouts', alternative: 'Grid or Stack components' },
        { text: 'Wizard-style one-field-at-a-time', alternative: 'Stepper with individual inputs' },
        { text: 'Dynamic form builders', alternative: 'Custom grid with conditional rendering' },
    ],

    overview: {
        description: 'FormGrid optimizes form layout with consistent spacing and responsive columns.',
        variants: ['default'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'FormGrid with rows and columns.',
                component: FormGridBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. FormGrid Container', description: 'Outer grid container with spacing' },
                { name: '2. FormGridRow', description: 'Row container for grouping fields' },
                { name: '3. Form Fields', description: 'Individual input components' },
            ]
        },
        emphasis: 'Group related fields in the same row. Use 1 column for full-width fields.',
        alignment: 'Labels aligned consistently. Fields fill their grid cells.',
    },

    content: {
        mainElements: 'Grid container with FormGridRow components organizing form fields.',
        overflowContent: 'Rows stack vertically. Columns collapse on smaller screens.',
        internationalization: 'Grid direction follows document direction (LTR/RTL).',
    },

    designRecommendations: [
        'Use `FormGridRow` to group related fields.',
        'Use appropriate column counts (1, 2, or 3) based on field length and relationship.',
        'Ensure labels are consistently aligned.',
    ],

    developmentConsiderations: [
        'Place `FormGridRow` components directly inside `FormGrid`.',
        'Use `columns` prop on `FormGridRow` to control layout responsiveness.',
    ],

    props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'FormGridRow components and form fields.' },
        { name: 'className', type: 'string', required: false, description: 'Additional CSS classes for the grid container.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between form fields' },
        ],
        aria: [
            { attribute: 'role="group"', usage: 'Groups related form fields (on FormGridRow)' },
        ],
        screenReader: 'Fields announced in reading order. Group labels provide context.',
        focusIndicator: 'Standard focus indicators on form fields',
    },

    relatedComponents: [
        { name: 'Grid', description: 'Generic grid layout', path: 'components/layout/grid' },
        { name: 'Stack', description: 'Vertical stacking', path: 'components/layout/stack' },
        { name: 'Input', description: 'Form input component', path: 'components/inputs/input' },
    ],
};

export default FormGridDoc;

