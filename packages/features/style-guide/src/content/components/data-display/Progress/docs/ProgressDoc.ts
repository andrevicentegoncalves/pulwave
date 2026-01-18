import { ComponentDoc } from '@pulwave/features-style-guide';
import {
    ProgressBasicDemo,
    ProgressCircularDemo,
    ProgressColorDemo,
    ProgressIndeterminateDemo,
    ProgressSizeDemo,
    ProgressStepsDemo,
    ProgressValuesDemo
} from '../demos';

export const ProgressDoc: ComponentDoc = {
    name: 'Progress',
    subtitle: 'Visual indicator for task completion status.',
    description: 'Progress displays the completion status of a task or process with determinate or indeterminate states, supporting linear and circular variants.',
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
        'Show determinate progress for file uploads, form completion',
        'Display percentage completion in data dashboards',
        'Visualize progress within cards or data tables',
        'Step-based completion indicators',
        'Circular progress for compact spaces',
    ],

    whenNotToUse: [
        { text: 'Indeterminate loading without progress', alternative: 'Spinner component' },
        { text: 'Content placeholders', alternative: 'Skeleton component' },
        { text: 'Full page loading', alternative: 'PageLoader component' },
    ],

    overview: {
        description: 'Visual indicator for task progress.',
        variants: ['linear', 'circular', 'steps'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Simple progress bar.',
                component: ProgressBasicDemo,
            },
            {
                name: 'Values & Labels',
                description: 'Progress bar with explicitly shown values.',
                component: ProgressValuesDemo,
            },
            {
                name: 'Circular',
                description: 'Circular progress variant.',
                component: ProgressCircularDemo,
            },
            {
                name: 'Sizes',
                description: 'Available sizes (s, m, l).',
                component: ProgressSizeDemo,
            },
            {
                name: 'Colors',
                description: 'Semantic color variants.',
                component: ProgressColorDemo,
            },
            {
                name: 'Steps',
                description: 'Step-based progress indicator.',
                component: ProgressStepsDemo,
            },
            {
                name: 'Indeterminate',
                description: 'Animated state for unknown duration.',
                component: ProgressIndeterminateDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Track', description: 'Background showing total range' },
                { name: '2. Fill', description: 'Colored portion showing progress' },
                { name: '3. Label', description: 'Optional text description' },
                { name: '4. Value', description: 'Optional percentage display' },
            ]
        },
        emphasis: 'Fill color indicates progress state (success, warning, etc.).',
        alignment: 'Full-width by default. Circular variant is centered.',
    },

    content: {
        mainElements: 'Value represents percentage (0-100). Label describes the task.',
        overflowContent: 'Labels truncate if too long.',
        internationalization: 'Labels translatable. Number format respects locale.',
    },

    designRecommendations: [
        'Use semantic colors to indicate progress state.',
        'Show percentage for precise feedback.',
        'Use circular variant for compact spaces.',
        'Add label for context in standalone usage.',
    ],

    developmentConsiderations: [
        'Use CSS animations for smooth fill transitions.',
        'Handle edge cases (0%, 100%, > 100%).',
        'Consider debouncing rapid value updates.',
        'Support both controlled and uncontrolled modes.',
    ],

    props: [
        { name: 'value', type: 'number', required: true, description: 'Current progress value (0-100).' },
        { name: 'label', type: 'string', required: false, description: 'Optional label displayed above the bar.' },
        { name: 'showValue', type: 'boolean', required: false, description: 'Whether to display the numerical percentage.', defaultValue: 'false' },
        { name: 'color', type: '"primary" | "success" | "warning" | "danger" | "neutral"', required: false, description: 'Color variant of the progress bar.', defaultValue: '"primary"' },
        { name: 'size', type: '"s" | "m" | "l"', required: false, description: 'Size variant.', defaultValue: '"m"' },
        { name: 'variant', type: '"linear" | "circular"', required: false, description: 'Visual variant.', defaultValue: '"linear"' },
    ],

    accessibility: {
        keyboard: [],
        aria: [
            { attribute: 'role="progressbar"', usage: 'Identifies as progress indicator' },
            { attribute: 'aria-valuenow', usage: 'Current progress value' },
            { attribute: 'aria-valuemin', usage: 'Minimum value (0)' },
            { attribute: 'aria-valuemax', usage: 'Maximum value (100)' },
            { attribute: 'aria-label', usage: 'Describes the progress purpose' },
        ],
        screenReader: 'Announces progress value and label. Updates announced on change.',
        focusIndicator: 'Not applicable (non-interactive element).',
    },

    relatedComponents: [
        { name: 'Spinner', description: 'Indeterminate loading', path: 'components/feedback/spinner' },
        { name: 'Skeleton', description: 'Content placeholder', path: 'components/feedback/skeleton' },
        { name: 'Stepper', description: 'Step-based navigation', path: 'components/navigation/stepper' },
    ],
};

export default ProgressDoc;

