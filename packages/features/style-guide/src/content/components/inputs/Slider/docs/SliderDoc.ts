import { ComponentDoc } from '@pulwave/features-style-guide';
import { SliderBasicDemo } from '../demos';

const SliderDoc: ComponentDoc = {
    name: 'Slider',
    subtitle: 'Range input for selecting numeric values.',
    description: 'Slider is a range input for selecting numeric values within a defined range, supporting single values or range selection with optional marks and value display.',
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
        'Volume or brightness controls',
        'Price range filters',
        'Configuring numeric settings',
        'Opacity or percentage controls',
        'Time or duration selection',
    ],

    whenNotToUse: [
        { text: 'Precise value entry needed', alternative: 'Number input' },
        { text: 'Very large value ranges', alternative: 'Input with validation' },
        { text: 'Discrete few options', alternative: 'Radio buttons or SegmentedControl' },
        { text: 'Date/time selection', alternative: 'DatePicker or TimePicker' },
    ],

    overview: {
        description: 'Slider with optional marks, range mode, and value display.',
        variants: ['single', 'range'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard slider with label and value tooltip.',
                component: SliderBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Track', description: 'Background line showing full range' },
                { name: '2. Fill', description: 'Colored portion showing selected range' },
                { name: '3. Thumb(s)', description: 'Draggable handle(s)' },
                { name: '4. Marks', description: 'Optional tick marks and labels' },
                { name: '5. Value Display', description: 'Optional current value tooltip' },
            ]
        },
        emphasis: 'Thumb position clearly indicates current value.',
        alignment: 'Full-width by default. Value labels above or beside track.',
    },

    content: {
        mainElements: 'Track shows range, thumb shows position, optional labels show values.',
        overflowContent: 'Mark labels truncate if too long.',
        internationalization: 'Value formatting respects locale (number format).',
    },

    designRecommendations: [
        'Show current value for precise feedback.',
        'Use marks for discrete step options.',
        'Provide min/max labels for context.',
        'Consider touch-friendly thumb size on mobile.',
    ],

    developmentConsiderations: [
        'Use controlled mode with value and onChange.',
        'Set step for discrete increments.',
        'Handle min/max bounds validation.',
        'Consider debouncing onChange for performance.',
    ],

    props: [
        { name: 'value', type: 'number | [number, number]', required: false, description: 'Current value or range.' },
        { name: 'min', type: 'number', required: false, description: 'Minimum value.', defaultValue: '0' },
        { name: 'max', type: 'number', required: false, description: 'Maximum value.', defaultValue: '100' },
        { name: 'step', type: 'number', required: false, description: 'Value increment.', defaultValue: '1' },
        { name: 'onChange', type: '(value: number | [number, number]) => void', required: false, description: 'Callback when value changes.' },
        { name: 'marks', type: 'Array<{ value: number; label?: string }>', required: false, description: 'Tick marks to display.' },
        { name: 'showValue', type: 'boolean', required: false, description: 'Show value tooltip.', defaultValue: 'false' },
        { name: 'disabled', type: 'boolean', required: false, description: 'Whether slider is disabled.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Arrow Left/Down', action: 'Decrease value by step' },
            { key: 'Arrow Right/Up', action: 'Increase value by step' },
            { key: 'Home', action: 'Set to minimum value' },
            { key: 'End', action: 'Set to maximum value' },
            { key: 'Page Up/Down', action: 'Large step increase/decrease' },
        ],
        aria: [
            { attribute: 'role="slider"', usage: 'Identifies as slider control' },
            { attribute: 'aria-valuenow', usage: 'Current value' },
            { attribute: 'aria-valuemin', usage: 'Minimum value' },
            { attribute: 'aria-valuemax', usage: 'Maximum value' },
            { attribute: 'aria-valuetext', usage: 'Human-readable value description' },
        ],
        screenReader: 'Announces: "[Label], slider, [value] of [max]".',
        focusIndicator: 'Focus ring on thumb element.',
    },

    relatedComponents: [
        { name: 'Input', description: 'For precise numeric entry', path: 'components/inputs/input' },
        { name: 'Progress', description: 'For display-only progress', path: 'components/data-display/progress' },
        { name: 'SegmentedControl', description: 'For discrete options', path: 'components/actions/segmented-control' },
    ],
};

export default SliderDoc;
