import { ComponentDoc } from '@pulwave/features-style-guide';
import { ScrollAreaBasicDemo } from '../demos';

export const ScrollAreaDoc: ComponentDoc = {
    name: 'ScrollArea',
    subtitle: 'Container with custom scrollbar styling.',
    description: 'ScrollArea wraps content in a scrollable container with customizable orientation, dimensions, and scrollbar visibility for a consistent cross-browser experience.',
    sourcePath: 'packages/ui/components/ScrollArea/ScrollArea.tsx',
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
        'Long lists in constrained containers',
        'Modal content exceeding available height',
        'Sidebars with many navigation items',
        'Code blocks or log viewers',
        'Custom scrollbar styling requirements',
    ],

    whenNotToUse: [
        { text: 'Page-level scrolling', alternative: 'Native body scroll' },
        { text: 'Infinite scroll lists', alternative: 'InfiniteScroll component' },
        { text: 'Horizontal carousels', alternative: 'Carousel component' },
        { text: 'Virtual scroll for huge lists', alternative: 'Virtualized list library' },
    ],

    overview: {
        description: 'ScrollArea provides custom scrollbar styling for overflowing content.',
        variants: ['vertical', 'horizontal', 'both'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Container with overflow content and custom scrollbars.',
                component: ScrollAreaBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Viewport', description: 'Scrollable content area' },
                { name: '2. Scrollbar Track', description: 'Background track for scrollbar' },
                { name: '3. Scrollbar Thumb', description: 'Draggable scroll indicator' },
            ]
        },
        emphasis: 'Scrollbar appears on hover or scroll. Thumb indicates scroll position.',
        alignment: 'Vertical scrollbar on right, horizontal on bottom.',
    },

    content: {
        mainElements: 'Viewport container with custom-styled scrollbars.',
        overflowContent: 'Content scrolls within defined dimensions. Scrollbar indicates more content.',
        internationalization: 'Scrollbar positions follow RTL layout. Content direction independent.',
    },

    designRecommendations: [
        'Use for long lists or content that exceeds the available space.',
        'Define explicit `height` or `maxHeight` constraints.',
        'Use `orientation = "both"` for tables or large diagrams.',
    ],

    developmentConsiderations: [
        'Ensure the parent container has a defined size if using percentage-based height.',
        'Use `hideScrollbar` for a cleaner look when scrolling is indicated by other means (e.g., carousel arrows).',
    ],

    props: [
        { name: 'children', type: 'ReactNode', required: false, description: 'Content to be displayed in the scrollable area.' },
        { name: 'maxHeight', type: 'string | number', required: false, description: 'Maximum height constraint for the scroll area.' },
        { name: 'height', type: 'string | number', required: false, description: 'Fixed height of the scroll area.' },
        { name: 'orientation', type: '"vertical" | "horizontal" | "both"', required: false, description: 'Direction of scrolling.', defaultValue: '"vertical"' },
        { name: 'hideScrollbar', type: 'boolean', required: false, description: 'Visually hide the scrollbar while keeping functionality.', defaultValue: 'false' },
        { name: 'className', type: 'string', required: false, description: 'Additional CSS classes.' },
        { name: 'style', type: 'CSSProperties', required: false, description: 'Additional inline styles.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Arrow Keys', action: 'Scroll content when focused' },
            { key: 'Page Up/Down', action: 'Scroll by page' },
            { key: 'Home/End', action: 'Scroll to start/end' },
        ],
        aria: [
            { attribute: 'role="region"', usage: 'When scroll area has label' },
            { attribute: 'aria-label', usage: 'Describes the scrollable content' },
            { attribute: 'tabindex="0"', usage: 'Makes scroll area focusable' },
        ],
        screenReader: 'Content reads naturally. Scrollbar interaction announced.',
        focusIndicator: 'Focus ring on container when keyboard navigating',
    },

    relatedComponents: [
        { name: 'InfiniteScroll', description: 'For pagination on scroll', path: 'components/data-display/infinite-scroll' },
        { name: 'DataTable', description: 'For scrollable tables', path: 'components/data-display/data-table' },
        { name: 'Modal', description: 'Scrollable modal content', path: 'components/feedback/modal' },
    ],
};

export default ScrollAreaDoc;

