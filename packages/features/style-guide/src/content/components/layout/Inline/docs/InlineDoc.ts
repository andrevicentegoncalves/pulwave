/**
 * InlineDoc - Documentation for Inline component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import { InlineBasicDemo } from '../demos';

const InlineDoc: ComponentDoc = {
    name: 'Inline',
    subtitle: 'Layout primitive for horizontal wrapping lists.',
    description: 'Inline is a layout primitive that arranges children horizontally with automatic wrapping support, perfect for tag lists, button groups, and metadata displays.',
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
        'Tag and badge lists that may wrap',
        'Button groups with flexible width',
        'Metadata items (author, date, category)',
        'Filter chips and toggles',
        'Social links or icon sets',
    ],

    whenNotToUse: [
        { text: 'Single row without wrap', alternative: 'Stack with horizontal direction' },
        { text: 'Vertical stacking', alternative: 'Stack component' },
        { text: 'Complex grid layouts', alternative: 'Grid component' },
        { text: 'Fixed-width columns', alternative: 'Grid or flex with explicit widths' },
    ],

    overview: {
        description: 'Inline arranges children horizontally with wrapping support.',
        variants: ['default'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Inline items with wrapping.',
                component: InlineBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Container', description: 'Flex container with wrap' },
                { name: '2. Gap', description: 'Horizontal and vertical spacing' },
                { name: '3. Children', description: 'Inline content elements' },
            ]
        },
        emphasis: 'Items flow horizontally and wrap to new lines as needed.',
        alignment: 'Items align to start by default. Cross-axis alignment configurable.',
    },

    content: {
        mainElements: 'Any React children arranged inline with consistent gaps.',
        overflowContent: 'Items wrap to new line when container width is exceeded.',
        internationalization: 'Flow direction responds to RTL context.',
    },

    designRecommendations: [
        'Use for variable-width content that may need to wrap.',
        'Maintain consistent gap sizes from spacing scale.',
        'Consider alignment for multi-line wrapped content.',
        'Pair with responsive design for optimal wrapping behavior.',
    ],

    developmentConsiderations: [
        'Inline uses CSS flexbox with flex-wrap: wrap.',
        'Gap applies both horizontally and vertically.',
        'Use align prop for cross-axis alignment control.',
        'Consider Stack for single-line horizontal layouts.',
    ],

    props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Content to arrange inline.' },
        { name: 'gap', type: 'number | string', required: false, description: 'Space between items.', defaultValue: '0' },
        { name: 'align', type: '"start" | "center" | "end" | "baseline"', required: false, description: 'Vertical alignment.', defaultValue: '"start"' },
        { name: 'justify', type: '"start" | "center" | "end" | "between"', required: false, description: 'Horizontal distribution.', defaultValue: '"start"' },
        { name: 'as', type: 'ElementType', required: false, description: 'HTML element to render.', defaultValue: '"div"' },
    ],

    accessibility: {
        keyboard: [],
        aria: [],
        screenReader: 'Inline is a layout-only component with no semantic meaning.',
        focusIndicator: 'Not applicable (layout component).',
    },

    relatedComponents: [
        { name: 'Stack', description: 'Vertical or horizontal stacking', path: 'components/layout/stack' },
        { name: 'Grid', description: 'Two-dimensional grid layout', path: 'components/layout/grid' },
        { name: 'Box', description: 'Base layout primitive', path: 'components/layout/box' },
    ],
};

export default InlineDoc;
