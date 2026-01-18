import { ComponentDoc } from '@pulwave/features-style-guide';
import { TimePickerDemo, TimePickerSizesDemo } from '../demos';

export const TimePickerDoc: ComponentDoc = {
    name: 'TimePicker',
    subtitle: 'Time selection with format support.',
    description: 'Full-featured time picker with hour/minute/second selection, 12/24 hour formats.',
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
        'For time selection in forms',
        'When both 12h and 24h formats are needed',
        'For precise time input with minutes/seconds',
        'Scheduling and appointment booking',
        'Event time configuration',
    ],

    whenNotToUse: [
        { text: 'For date selection', alternative: 'DatePicker component' },
        { text: 'For duration input', alternative: 'Custom duration input' },
        { text: 'For date and time together', alternative: 'DateTimePicker or combine DatePicker + TimePicker' },
    ],

    overview: {
        description: 'Time selection input with dropdown for precise time picking.',
        variants: ['default'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard time picker.',
                component: TimePickerDemo,
            },
            {
                name: 'Sizes',
                description: 'Usage of different sizes.',
                component: TimePickerSizesDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Input Field', description: 'Displays selected time' },
                { name: '2. Clock Icon', description: 'Visual indicator for time picker' },
                { name: '3. Dropdown', description: 'Time selection interface' },
                { name: '4. Hour Column', description: 'Scrollable hour selector' },
                { name: '5. Minute Column', description: 'Scrollable minute selector' },
                { name: '6. AM/PM Toggle', description: 'For 12-hour format' },
            ]
        },
        emphasis: 'Current selection clearly highlighted in dropdown.',
        alignment: 'Dropdown appears below the input field.',
    },

    content: {
        mainElements: 'Time displayed in configured format.',
        overflowContent: 'Columns scroll for all time options.',
        internationalization: 'Supports both 12-hour and 24-hour formats based on locale.',
    },

    designRecommendations: [
        'Use appropriate format for the locale (12h vs 24h).',
        'Show placeholder with expected time format.',
        'Consider minute steps for appointment scheduling.',
        'Highlight current time for reference.',
        'Provide clear button for optional time fields.',
    ],

    developmentConsiderations: [
        'Handle timezone considerations if needed.',
        'Support different time formats based on locale.',
        'Implement proper focus management in dropdown.',
        'Consider validation for min/max time constraints.',
        'Handle null values for optional time fields.',
    ],

    props: [
        { name: 'value', type: 'TimeValue | null', description: 'Selected time' },
        { name: 'onChange', type: '(time: TimeValue | null) => void', description: 'Callback when time changes' },
        { name: 'format', type: '"12h" | "24h"', defaultValue: '"12h"', description: 'Time format' },
        { name: 'showSeconds', type: 'boolean', defaultValue: 'false', description: 'Show seconds selector' },
        { name: 'minuteStep', type: 'number', defaultValue: '1', description: 'Minute increment step' },
        { name: 'size', type: '"s" | "m" | "l"', defaultValue: '"m"', description: 'Size variant' },
        { name: 'clearable', type: 'boolean', defaultValue: 'true', description: 'Show clear button' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Move focus to/from time picker' },
            { key: 'Enter/Space', action: 'Open time picker dropdown' },
            { key: 'Up/Down Arrow', action: 'Increment/decrement values' },
            { key: 'Tab (in dropdown)', action: 'Navigate between hour/minute/second columns' },
            { key: 'Escape', action: 'Close dropdown' },
        ],
        aria: [
            { attribute: 'aria-label', usage: 'Describes the time picker' },
            { attribute: 'aria-expanded', usage: 'Indicates dropdown state' },
            { attribute: 'role="listbox"', usage: 'For time selection columns' },
        ],
        screenReader: 'Announces selected time and navigation within columns.',
        focusIndicator: 'Focus ring on input and selected time options.',
    },

    relatedComponents: [
        { name: 'DatePicker', description: 'Date selection input', path: 'components/inputs/date-picker' },
        { name: 'Input', description: 'Basic text input', path: 'components/inputs/input' },
        { name: 'Select', description: 'Dropdown selection', path: 'components/inputs/select' },
    ],
};

export default TimePickerDoc;

