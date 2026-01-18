/**
 * SegmentedControlDoc - Documentation for SegmentedControl component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import SegmentedControlBasicDemo from '../demos/SegmentedControlBasicDemo';

const SegmentedControlDoc: ComponentDoc = {
    name: 'Segmented Control',
    subtitle: 'Mutually exclusive button group for view switching.',
    description: 'Segmented Control is a linear set of two or more segments, each functioning as a mutually exclusive button for switching views, filtering content, or toggling states.',
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
        'Switching between different views of the same data',
        'Filtering content by mutually exclusive categories',
        'Toggling between two or more states',
        'Display mode toggles (list/grid view)',
        'Quick filter controls',
    ],

    whenNotToUse: [
        { text: 'Navigation requiring routing', alternative: 'Tabs component' },
        { text: 'Selecting multiple options', alternative: 'Checkbox Group' },
        { text: 'More than 5-6 options', alternative: 'Select dropdown' },
        { text: 'Primary form input', alternative: 'Radio buttons' },
    ],

    overview: {
        description: 'Segmented Control allows users to select one option from a set. It is often used for view switching or filtering.',
        variants: ['default', 'primary', 'secondary'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard segmented control.',
                component: SegmentedControlBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Container', description: 'Background track holding segments' },
                { name: '2. Segment', description: 'Individual clickable option' },
                { name: '3. Selection Indicator', description: 'Visual highlight on selected segment' },
                { name: '4. Icon (optional)', description: 'Icon alongside or instead of label' },
            ]
        },
        emphasis: 'Selected segment should be clearly distinguishable.',
        alignment: 'Segments are evenly distributed within container.',
    },

    content: {
        mainElements: 'Keep segment labels short (1-2 words). Icons can replace text in tight spaces.',
        overflowContent: 'Labels truncate if too long. Consider icon-only for narrow spaces.',
        internationalization: 'Labels should be translatable. Container width adjusts.',
    },

    designRecommendations: [
        'Keep segment count between 2-5 options.',
        'Use consistent label length across segments.',
        'Ensure clear visual feedback on selection.',
        'Consider icon-only variants for mobile.',
    ],

    developmentConsiderations: [
        'Use controlled component pattern.',
        'Ensure smooth selection animation.',
        'Handle disabled state for individual segments.',
        'Support keyboard navigation between segments.',
    ],

    props: [
        { name: 'options', type: '{ label: string; value: string; icon?: ReactNode }[]', required: true, description: 'Array of options.' },
        { name: 'value', type: 'string', required: true, description: 'Current selected value.' },
        { name: 'onChange', type: '(value: string) => void', required: true, description: 'Callback when selection changes.' },
        { name: 'name', type: 'string', required: false, description: 'Input name attribute.' },
        { name: 'size', type: '"s" | "m" | "l"', required: false, description: 'Size of the control.', defaultValue: '"m"' },
        { name: 'disabled', type: 'boolean', required: false, description: 'Disable all segments.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Focus the segmented control' },
            { key: 'Arrow Left/Right', action: 'Move between segments' },
            { key: 'Enter/Space', action: 'Select focused segment' },
        ],
        aria: [
            { attribute: 'role="radiogroup"', usage: 'Container role' },
            { attribute: 'role="radio"', usage: 'Individual segment role' },
            { attribute: 'aria-checked', usage: 'Selected state of segment' },
        ],
        screenReader: 'Announces as radio group with current selection.',
        focusIndicator: 'Focus ring around the control or selected segment.',
    },

    relatedComponents: [
        { name: 'Tabs', description: 'For content panel switching', path: 'components/navigation/tabs' },
        { name: 'Radio', description: 'Form-oriented single selection', path: 'components/inputs/radio' },
        { name: 'Button', description: 'Individual actions', path: 'components/actions/button' },
    ],
};

export default SegmentedControlDoc;
