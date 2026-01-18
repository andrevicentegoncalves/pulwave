import { ComponentDoc } from '@pulwave/features-style-guide';
import { DatePickerDemo, DatePickerSizesDemo } from '../demos';

export const DatePickerDoc: ComponentDoc = {
    name: 'DatePicker',
    subtitle: 'Calendar-based date selection input.',
    description: 'Full-featured date picker with calendar grid, month/year navigation, and keyboard accessibility.',
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
        'For date selection in forms',
        'When showing a calendar is helpful',
        'For date range restrictions',
        'Booking and scheduling interfaces',
        'Event creation forms',
    ],

    whenNotToUse: [
        { text: 'For time selection', alternative: 'TimePicker component' },
        { text: 'For date and time together', alternative: 'DateTimePicker or combine DatePicker + TimePicker' },
        { text: 'For quick relative dates', alternative: 'Select with preset options' },
    ],

    overview: {
        description: 'Date picker input with calendar popup for intuitive date selection.',
        variants: ['default', 'range'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Standard date picker.',
                component: DatePickerDemo,
            },
            {
                name: 'Sizes',
                description: 'Usage of different sizes.',
                component: DatePickerSizesDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Input Field', description: 'Displays selected date and triggers calendar' },
                { name: '2. Calendar Icon', description: 'Visual indicator for date picker' },
                { name: '3. Calendar Popup', description: 'Calendar grid container' },
                { name: '4. Month/Year Header', description: 'Navigation and current month display' },
                { name: '5. Day Grid', description: 'Selectable day cells' },
                { name: '6. Today Button', description: 'Quick selection for current date' },
            ]
        },
        emphasis: 'Current date and selected date should be clearly distinguishable.',
        alignment: 'Calendar popup typically appears below the input.',
    },

    content: {
        mainElements: 'Date displayed in localized format.',
        overflowContent: 'Date format adapts to locale settings.',
        internationalization: 'Supports different locales, first day of week, and date formats.',
    },

    designRecommendations: [
        'Show placeholder with expected date format.',
        'Highlight today and selected date distinctly.',
        'Disable dates outside valid range clearly.',
        'Provide quick navigation for month/year.',
        'Consider showing week numbers if relevant.',
    ],

    developmentConsiderations: [
        'Handle timezone considerations carefully.',
        'Support locale-specific date formatting.',
        'Implement proper focus management in calendar.',
        'Consider date validation on manual input.',
        'Handle null/undefined values gracefully.',
    ],

    props: [
        { name: 'value', type: 'Date | null', description: 'Selected date' },
        { name: 'onChange', type: '(date: Date | null) => void', description: 'Callback when date changes' },
        { name: 'minDate', type: 'Date', description: 'Minimum selectable date' },
        { name: 'maxDate', type: 'Date', description: 'Maximum selectable date' },
        { name: 'disabledDates', type: 'Date[]', description: 'Specific dates to disable' },
        { name: 'size', type: '"s" | "m" | "l"', defaultValue: '"m"', description: 'Size variant' },
        { name: 'clearable', type: 'boolean', defaultValue: 'true', description: 'Show clear button' },
        { name: 'showToday', type: 'boolean', defaultValue: 'true', description: 'Show today button' },
        { name: 'firstDayOfWeek', type: '0 | 1', defaultValue: '0', description: 'First day of week (0=Sunday)' },
        { name: 'locale', type: 'string', defaultValue: '"en-US"', description: 'Locale for formatting' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Move focus to/from date picker' },
            { key: 'Enter/Space', action: 'Open calendar or select date' },
            { key: 'Arrow Keys', action: 'Navigate between days in calendar' },
            { key: 'Page Up/Down', action: 'Navigate between months' },
            { key: 'Home/End', action: 'Go to first/last day of month' },
            { key: 'Escape', action: 'Close calendar popup' },
        ],
        aria: [
            { attribute: 'role="dialog"', usage: 'Calendar popup is announced as a dialog' },
            { attribute: 'aria-label', usage: 'Describes the date picker' },
            { attribute: 'aria-selected', usage: 'Indicates selected date' },
            { attribute: 'aria-disabled', usage: 'Indicates disabled dates' },
        ],
        screenReader: 'Announces selected date, navigation actions, and calendar grid.',
        focusIndicator: 'Focus ring on input and calendar day cells.',
    },

    relatedComponents: [
        { name: 'TimePicker', description: 'Time selection input', path: 'components/inputs/time-picker' },
        { name: 'Input', description: 'Basic text input', path: 'components/inputs/input' },
        { name: 'Popover', description: 'Floating content container', path: 'components/overlays/popover' },
    ],
};

export default DatePickerDoc;

