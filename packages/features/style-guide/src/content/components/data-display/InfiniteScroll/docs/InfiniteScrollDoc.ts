import { ComponentDoc } from '@pulwave/features-style-guide';
import InfiniteScrollBasicDemo from '../demos/InfiniteScrollBasicDemo';

export const InfiniteScrollDoc: ComponentDoc = {
    name: 'InfiniteScroll',
    description: 'A component for loading content continuously as the user scrolls, eliminating pagination clicks and providing seamless content exploration.',
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
        'Social media feeds and timelines',
        'Search results with many items',
        'Product listings in e-commerce',
        'News or article feeds',
        'Image galleries with many items',
    ],

    whenNotToUse: [
        { text: 'Small datasets (<50 items)', alternative: 'Pagination or load all' },
        { text: 'When users need to reach footer', alternative: 'Pagination component' },
        { text: 'Data requiring specific page access', alternative: 'Pagination with page numbers' },
        { text: 'Tables with sortable columns', alternative: 'DataTable with pagination' },
    ],

    overview: {
        description: 'Infinite Scroll automatically loads more content when the user reaches the bottom of the list. It uses the `useIntersectionObserver` hook internally.',
        variants: ['default'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Scroll down to load more items.',
                component: InfiniteScrollBasicDemo,
            },
        ],
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Content Container', description: 'Scrollable area with loaded items' },
                { name: '2. Sentinel Element', description: 'Invisible trigger for loading more' },
                { name: '3. Loader', description: 'Loading indicator while fetching' },
                { name: '4. End Message', description: 'Shown when all items are loaded' },
            ]
        },
        emphasis: 'Loading indicator should be clearly visible. End message confirms all content is loaded.',
        alignment: 'Loader centered below content. End message centered or left-aligned.',
    },

    content: {
        mainElements: 'Scrollable content area with automatic loading trigger at the bottom.',
        overflowContent: 'Content grows as more items load. Consider virtualization for very large lists.',
        internationalization: 'Loading and end messages should be translatable.',
    },

    props: [
        { name: 'onLoadMore', type: '() => void', required: true, description: 'Callback fired when the user scrolls to the bottom threshold.' },
        { name: 'hasMore', type: 'boolean', required: true, description: 'Whether there are more items to load.' },
        { name: 'loading', type: 'boolean', required: true, description: 'Whether items are currently loading (prevents multiple calls).' },
        { name: 'loader', type: 'ReactNode', description: 'Custom loader element to show while loading more items.' },
        { name: 'endMessage', type: 'ReactNode', description: 'Message to show when all items have been loaded.' },
        { name: 'root', type: 'Element', description: 'Optional root element for IntersectionObserver (defaults to viewport).' },
        { name: 'threshold', type: 'number', defaultValue: '0.1', description: 'IntersectionObserver threshold for triggering load.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate through loaded items' },
            { key: 'Page Down', action: 'Scroll to trigger more loading' },
        ],
        aria: [
            { attribute: 'aria-busy', usage: 'True while loading more items' },
            { attribute: 'aria-live="polite"', usage: 'Announces new items loaded' },
            { attribute: 'role="feed"', usage: 'Semantic feed container' },
        ],
        screenReader: 'Announces "Loading more items" and "N new items loaded". End message announces completion.',
        focusIndicator: 'Focus remains on current item during loading. New items are accessible via Tab.',
    },

    relatedComponents: [
        { name: 'Pagination', description: 'For paginated navigation', path: 'components/navigation/pagination' },
        { name: 'DataTable', description: 'For tabular data', path: 'components/data-display/data-table' },
        { name: 'Spinner', description: 'Loading indicator', path: 'components/feedback/spinner' },
    ],
};

export default InfiniteScrollDoc;
