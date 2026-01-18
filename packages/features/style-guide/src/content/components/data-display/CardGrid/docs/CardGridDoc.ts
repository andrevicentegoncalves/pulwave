import { ComponentDoc } from '@pulwave/features-style-guide';
import { CardGridBasicDemo, CardGridContentDemo, CardFlexGridDemo } from '../demos';

export const CardGridDoc: ComponentDoc = {
    name: 'CardGrid',
    description: 'The CardGrid component efficiently organizes multiple cards into a responsive grid, handling various screen sizes and spacing automatically.',
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
        'Displaying collections of similar content (products, articles, users)',
        'Dashboard layouts with multiple cards',
        'Gallery or portfolio displays',
        'Feature showcases or comparison grids',
        'Responsive layouts that adapt to screen size',
    ],

    whenNotToUse: [
        { text: 'Single card display', alternative: 'Card component alone' },
        { text: 'Tabular data with rows/columns', alternative: 'DataTable component' },
        { text: 'Linear list of items', alternative: 'DataList or Stack' },
        { text: 'Masonry/Pinterest-style layouts', alternative: 'Custom masonry grid' },
    ],

    overview: {
        description: 'Responsive grid for card layouts with automatic column adjustment based on breakpoints.',
        variants: ['grid', 'flex'],
        demos: [
            {
                name: 'Card Grid',
                description: 'Displaying a collection of property cards.',
                component: CardGridBasicDemo,
            },
            {
                name: 'Card Grid Content Sizing',
                description: 'Validates that cards expand naturally with content using CSS Grid.',
                component: CardGridContentDemo,
            },
            {
                name: 'Card Flex Grid',
                description: 'Using `CardFlexGrid` allows cards to have independent widths (e.g. one small, one large) using Flexbox wrapping.',
                component: CardFlexGridDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Grid Container', description: 'CSS Grid or Flexbox container' },
                { name: '2. Grid Items', description: 'Card children with equal sizing' },
                { name: '3. Gap Spacing', description: 'Consistent spacing between items' },
            ]
        },
        emphasis: 'Use equal-sized cards for visual consistency. Consider highlighting featured items with span variations.',
        alignment: 'Cards align to grid tracks. Last row may have fewer items, aligned left by default.',
    },

    content: {
        mainElements: 'Container holding Card components. Each card should have consistent structure for visual harmony.',
        overflowContent: 'Grid wraps to new rows automatically. Consider pagination or infinite scroll for large datasets.',
        internationalization: 'Grid direction follows document direction (LTR/RTL). Content within cards should be translatable.',
    },

    props: [
        {
            name: 'children',
            type: 'ReactNode',
            required: true,
            description: 'Card components to display within the grid.',
        },
        {
            name: 'columns',
            type: 'number | { sm?: number; md?: number; lg?: number; xl?: number }',
            required: false,
            defaultValue: '3',
            description: 'Number of columns to display, or an object defining columns per breakpoint.',
        },
        {
            name: 'gap',
            type: 'string',
            required: false,
            defaultValue: 'var(--spacing-4)',
            description: 'Gap between grid items using CSS gap property.',
        },
        {
            name: 'className',
            type: 'string',
            required: false,
            description: 'Additional CSS classes to apply to the grid container.',
        },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between interactive cards' },
            { key: 'Arrow Keys', action: 'Navigate grid (with roving tabindex)' },
        ],
        aria: [
            { attribute: 'role="list"', usage: 'When cards represent a list of items' },
            { attribute: 'role="grid"', usage: 'When cards are navigable as a grid' },
            { attribute: 'aria-label', usage: 'Describes the collection (e.g., "Product listings")' },
        ],
        screenReader: 'Announces the grid/list role and item count. Each card announces its content.',
        focusIndicator: 'Focus visible on interactive cards within the grid',
    },

    relatedComponents: [
        { name: 'Card', description: 'Individual card component', path: 'components/data-display/card' },
        { name: 'Grid', description: 'Generic grid layout', path: 'components/layout/grid' },
        { name: 'DataList', description: 'For list-style layouts', path: 'components/data-display/data-list' },
    ],
};

export default CardGridDoc;

