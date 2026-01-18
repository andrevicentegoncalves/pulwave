/**
 * StackDoc - Documentation for Stack component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import { StackBasicDemo } from '../demos';

const StackDoc: ComponentDoc = {
    name: 'Stack',
    subtitle: 'Layout primitive for vertical or horizontal stacking.',
    description: 'Stack is a layout primitive that arranges children vertically or horizontally with consistent spacing, providing a foundation for building consistent layouts.',
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
        'Vertical lists of items with consistent spacing',
        'Form fields layout (label, input, helper)',
        'Component composition and grouping',
        'Card content organization',
        'Button groups and action bars',
    ],

    whenNotToUse: [
        { text: 'Complex 2D grid layouts', alternative: 'Grid component' },
        { text: 'Wrapping inline items', alternative: 'Inline component' },
        { text: 'Fixed positioning layouts', alternative: 'Box with absolute positioning' },
        { text: 'Responsive multi-column', alternative: 'Grid with breakpoints' },
    ],

    overview: {
        description: 'Stack arranges children with consistent spacing in one direction.',
        variants: ['vertical', 'horizontal'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Vertical and horizontal stacks.',
                component: StackBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Container', description: 'Flex container with direction' },
                { name: '2. Gap', description: 'Consistent spacing between children' },
                { name: '3. Children', description: 'Stacked content elements' },
            ]
        },
        emphasis: 'Primary layout direction with configurable alignment and spacing.',
        alignment: 'Cross-axis alignment defaults to stretch. Main-axis defaults to start.',
    },

    content: {
        mainElements: 'Any React children can be stacked. Use gap prop for spacing.',
        overflowContent: 'Content can overflow container. Use wrap prop for wrapping behavior.',
        internationalization: 'Direction responds to RTL context automatically.',
    },

    designRecommendations: [
        'Use consistent gap values from the spacing scale.',
        'Prefer Stack over manual margin for child spacing.',
        'Nest Stacks for complex layouts.',
        'Use semantic as prop for appropriate HTML structure.',
    ],

    developmentConsiderations: [
        'Stack uses CSS flexbox under the hood.',
        'Gap uses CSS gap property (no margin on children).',
        'Use fullWidth/fullHeight for filling parent containers.',
        'as prop allows rendering as different HTML elements.',
    ],

    props: [
        { name: 'direction', type: '"row" | "column" | "row-reverse" | "column-reverse"', required: false, description: 'Stack direction.', defaultValue: '"column"' },
        { name: 'gap', type: 'number | string', required: false, description: 'Space between children (0-32 scale or CSS value).', defaultValue: '0' },
        { name: 'align', type: '"start" | "center" | "end" | "stretch" | "baseline"', required: false, description: 'Cross-axis alignment.', defaultValue: '"stretch"' },
        { name: 'justify', type: '"start" | "center" | "end" | "between" | "around"', required: false, description: 'Main-axis alignment.', defaultValue: '"start"' },
        { name: 'wrap', type: 'boolean | "reverse"', required: false, description: 'Whether items wrap to next line.', defaultValue: 'false' },
        { name: 'as', type: 'ElementType', required: false, description: 'HTML element or component to render.', defaultValue: '"div"' },
        { name: 'fullWidth', type: 'boolean', required: false, description: 'Whether stack takes full width.', defaultValue: 'false' },
        { name: 'fullHeight', type: 'boolean', required: false, description: 'Whether stack takes full height.', defaultValue: 'false' },
        { name: 'padding', type: 'number | string', required: false, description: 'Inner padding.' },
        { name: 'reverse', type: 'boolean', required: false, description: 'Reverse direction.', defaultValue: 'false' },
    ],

    accessibility: {
        keyboard: [],
        aria: [],
        screenReader: 'Stack is a layout-only component with no semantic meaning.',
        focusIndicator: 'Not applicable (layout component).',
    },

    relatedComponents: [
        { name: 'Inline', description: 'Horizontal inline layout with wrapping', path: 'components/layout/inline' },
        { name: 'Grid', description: 'Two-dimensional grid layout', path: 'components/layout/grid' },
        { name: 'Box', description: 'Base layout primitive', path: 'components/layout/box' },
    ],
};

export default StackDoc;
