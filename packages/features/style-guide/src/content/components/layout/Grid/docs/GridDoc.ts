/**
 * GridDoc - Documentation for Grid component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import { GridBasicDemo } from '../demos';

const GridDoc: ComponentDoc = {
    name: 'Grid',
    subtitle: 'Layout primitive for 2D grid arrangements.',
    description: 'Grid is a layout primitive based on CSS Grid Layout for creating complex two-dimensional layouts with rows, columns, and responsive behavior.',
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
        'Dashboard layouts with multiple widgets',
        'Card grids and gallery displays',
        'Complex page structures with sidebars',
        'Responsive multi-column layouts',
        'Form layouts requiring alignment',
    ],

    whenNotToUse: [
        { text: 'Single direction layout', alternative: 'Stack or Inline component' },
        { text: 'Simple centering', alternative: 'Box with flexbox' },
        { text: 'Sequential lists', alternative: 'Stack component' },
        { text: 'Inline elements', alternative: 'Inline component' },
    ],

    overview: {
        description: 'Grid system based on CSS Grid Layout.',
        variants: ['default', 'responsive'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Grid layout with columns and gap.',
                component: GridBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Container', description: 'Grid container with display: grid' },
                { name: '2. Columns', description: 'Column template definition' },
                { name: '3. Rows', description: 'Row template definition' },
                { name: '4. Gap', description: 'Spacing between grid items' },
                { name: '5. Items', description: 'Children placed in grid cells' },
            ]
        },
        emphasis: 'Grid provides precise two-dimensional layout control.',
        alignment: 'Items align based on justify-items and align-items props.',
    },

    content: {
        mainElements: 'Any React children placed in grid cells.',
        overflowContent: 'Items can span multiple columns/rows using span props.',
        internationalization: 'Grid direction responds to RTL context.',
    },

    designRecommendations: [
        'Use consistent gap values from the spacing scale.',
        'Consider responsive column counts for different viewports.',
        'Use auto-fit/auto-fill for dynamic column counts.',
        'Maintain visual hierarchy with proper item placement.',
    ],

    developmentConsiderations: [
        'Grid uses CSS Grid Layout under the hood.',
        'Columns can be number (equal), array, or CSS string.',
        'Use GridItem for explicit cell positioning.',
        'Consider browser support for advanced grid features.',
    ],

    props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Grid items to render.' },
        { name: 'columns', type: 'number | string | string[]', required: false, description: 'Column template definition.', defaultValue: '1' },
        { name: 'rows', type: 'string', required: false, description: 'Row template definition.' },
        { name: 'gap', type: 'number | string', required: false, description: 'Gap between grid items.', defaultValue: '0' },
        { name: 'rowGap', type: 'number | string', required: false, description: 'Gap between rows.' },
        { name: 'columnGap', type: 'number | string', required: false, description: 'Gap between columns.' },
        { name: 'alignItems', type: '"start" | "center" | "end" | "stretch"', required: false, description: 'Vertical alignment of items.' },
        { name: 'justifyItems', type: '"start" | "center" | "end" | "stretch"', required: false, description: 'Horizontal alignment of items.' },
    ],

    accessibility: {
        keyboard: [],
        aria: [],
        screenReader: 'Grid is a layout-only component with no semantic meaning.',
        focusIndicator: 'Not applicable (layout component).',
    },

    relatedComponents: [
        { name: 'Stack', description: 'Single-direction layout', path: 'components/layout/stack' },
        { name: 'Inline', description: 'Horizontal wrapping layout', path: 'components/layout/inline' },
        { name: 'Box', description: 'Base layout primitive', path: 'components/layout/box' },
    ],
};

export default GridDoc;
