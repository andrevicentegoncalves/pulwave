import { ComponentDoc } from '@pulwave/features-style-guide';

export const CarouselDoc: ComponentDoc = {
    name: 'Carousel',
    subtitle: 'A slideshow component for cycling through elements.',
    description: 'The Carousel component allows users to cycle through a series of content, such as images or text cards, using navigation controls and optional auto-play functionality.',
    sourcePath: 'packages/ui/components/Carousel/Carousel.tsx',
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
        'Image galleries and portfolios',
        'Product showcases with multiple images',
        'Testimonial or quote rotations',
        'Feature highlights on landing pages',
        'News or article teasers',
    ],

    whenNotToUse: [
        { text: 'Critical content', alternative: 'Static layout (users miss auto-rotating content)' },
        { text: 'Single image display', alternative: 'Image component' },
        { text: 'Many items to browse', alternative: 'Grid or list with pagination' },
        { text: 'Mobile-first designs', alternative: 'Swipeable cards or scroll snap' },
    ],

    overview: {
        description: 'Slideshow component for cycling through content with navigation controls.',
        variants: ['default', 'autoPlay', 'multiSlide'],
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Slides Container', description: 'Viewport showing current slide(s)' },
                { name: '2. Previous Arrow', description: 'Navigate to previous slide' },
                { name: '3. Next Arrow', description: 'Navigate to next slide' },
                { name: '4. Indicators', description: 'Dots showing slide position' },
            ]
        },
        emphasis: 'Current slide is prominent. Arrows appear on hover. Indicators show position.',
        alignment: 'Slides centered. Arrows on sides. Indicators centered below.',
    },

    content: {
        mainElements: 'Slide viewport with navigation arrows and position indicators.',
        overflowContent: 'Slides transition horizontally. Content within slides can scroll if needed.',
        internationalization: 'Navigation direction follows document direction (LTR/RTL).',
    },

    designRecommendations: [
        'Limit to 5-7 slides maximum for best engagement.',
        'Use consistent aspect ratios for all slides.',
        'Pause auto-play on hover and focus.',
        'Ensure navigation controls are always visible.',
    ],

    developmentConsiderations: [
        'Auto-play pauses when component loses focus.',
        'Touch/swipe gestures supported on mobile.',
        'Slides are lazy-loaded for performance.',
    ],

    props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Slide content elements.' },
        { name: 'autoPlay', type: 'boolean', required: false, defaultValue: 'false', description: 'Whether to automatically cycle through slides.' },
        { name: 'interval', type: 'number', required: false, defaultValue: '3000', description: 'Time in milliseconds between auto-transitions.' },
        { name: 'showArrows', type: 'boolean', required: false, defaultValue: 'true', description: 'Show navigation arrows.' },
        { name: 'showIndicators', type: 'boolean', required: false, defaultValue: 'true', description: 'Show position indicators.' },
        { name: 'className', type: 'string', required: false, description: 'Additional CSS classes to apply.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Arrow Left', action: 'Go to previous slide' },
            { key: 'Arrow Right', action: 'Go to next slide' },
            { key: 'Tab', action: 'Navigate to arrows and indicators' },
            { key: 'Enter/Space', action: 'Activate focused control' },
        ],
        aria: [
            { attribute: 'role="region"', usage: 'Carousel is a landmark region' },
            { attribute: 'aria-roledescription="carousel"', usage: 'Describes the component type' },
            { attribute: 'aria-label', usage: 'Describes the carousel content' },
            { attribute: 'aria-live="polite"', usage: 'Announces slide changes (when not auto-playing)' },
        ],
        screenReader: 'Announces: "Slide [N] of [total]". Auto-play pauses on focus.',
        focusIndicator: 'Focus ring on arrows and indicators.',
    },

    relatedComponents: [
        { name: 'ScrollArea', description: 'For horizontal scrolling', path: 'components/layout/scroll-area' },
        { name: 'CardGrid', description: 'For grid layouts', path: 'components/data-display/card-grid' },
        { name: 'Tabs', description: 'For tabbed content', path: 'components/navigation/tabs' },
    ],
};

export default CarouselDoc;

