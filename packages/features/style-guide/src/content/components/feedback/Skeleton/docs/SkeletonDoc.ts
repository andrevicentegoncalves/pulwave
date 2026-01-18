/**
 * SkeletonDoc - Documentation for Skeleton component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import * as SkeletonDemos from '../demos';

const SkeletonDoc: ComponentDoc = {
    name: 'Skeleton',
    subtitle: 'Placeholder loading state mimicking content layout.',
    description: 'Skeleton provides placeholder loading states that mimic the layout of content being loaded, reducing perceived loading time and preventing layout shift.',
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
        'Content loading placeholders',
        'Card and list loading states',
        'Progressive content reveal',
        'Image loading placeholders',
        'Form field loading states',
    ],

    whenNotToUse: [
        { text: 'Short loading times (<300ms)', alternative: 'Spinner or no indicator' },
        { text: 'Action in progress', alternative: 'Button loading state' },
        { text: 'Full page loading', alternative: 'PageLoader component' },
        { text: 'Unknown content structure', alternative: 'Spinner' },
    ],

    overview: {
        description: 'Skeleton supports multiple variants for versatile loading states: text, circular, rectangular, and rounded.',
        variants: ['text', 'circular', 'rectangular', 'rounded'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Simple text line skeletons.',
                component: SkeletonDemos.SkeletonVariantsDemo,
            },
            {
                name: 'Variants & Composition',
                description: 'Use different variants to build composite loading states like cards or profiles.',
                component: SkeletonDemos.SkeletonEnhancementDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Container', description: 'Shaped element matching content' },
                { name: '2. Animation', description: 'Shimmer or pulse animation' },
            ]
        },
        emphasis: 'Skeleton shape should closely match the content being loaded.',
        alignment: 'Match alignment of actual content.',
    },

    content: {
        mainElements: 'Width and height should approximate actual content dimensions.',
        overflowContent: 'Use multiple skeleton elements for complex layouts.',
        internationalization: 'Not applicable (visual placeholder).',
    },

    designRecommendations: [
        'Match skeleton dimensions to actual content closely.',
        'Use appropriate variant for content type.',
        'Compose multiple skeletons for complex layouts.',
        'Use subtle animation to indicate loading.',
    ],

    developmentConsiderations: [
        'Use CSS animations for smooth performance.',
        'Match skeleton dimensions to prevent layout shift.',
        'Consider Suspense boundaries for React 18+.',
        'Delay skeleton display for very short loads.',
    ],

    props: [
        { name: 'variant', type: '"text" | "circular" | "rectangular" | "rounded"', required: false, description: 'Shape variant.', defaultValue: '"text"' },
        { name: 'width', type: 'number | string', required: false, description: 'Width of skeleton.' },
        { name: 'height', type: 'number | string', required: false, description: 'Height of skeleton.' },
        { name: 'animation', type: '"pulse" | "wave" | "none"', required: false, description: 'Animation style.', defaultValue: '"pulse"' },
        { name: 'className', type: 'string', required: false, description: 'Additional CSS classes.' },
    ],

    accessibility: {
        keyboard: [],
        aria: [
            { attribute: 'aria-busy="true"', usage: 'Indicates content is loading' },
            { attribute: 'aria-hidden="true"', usage: 'Hides decorative skeleton from screen readers' },
        ],
        screenReader: 'Screen readers should announce loading state via parent container.',
        focusIndicator: 'Not applicable (non-interactive element).',
    },

    relatedComponents: [
        { name: 'Spinner', description: 'Indeterminate loading indicator', path: 'components/feedback/spinner' },
        { name: 'PageLoader', description: 'Full page loading', path: 'components/feedback/page-loader' },
        { name: 'Progress', description: 'Determinate progress indicator', path: 'components/data-display/progress' },
    ],
};

export default SkeletonDoc;
