import { ComponentDoc } from '@pulwave/features-style-guide';

export const ContentLayoutDoc: ComponentDoc = {
    name: 'ContentLayout',
    subtitle: 'Width-constrained content wrapper.',
    description: 'ContentLayout ensures content is displayed with consistent max-widths and margins across different screen sizes, providing readable line lengths and proper spacing.',
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
        'Wrapping main page content for readability',
        'Dashboard content areas',
        'Article or documentation pages',
        'Form containers with optimal field widths',
        'Settings and configuration panels',
    ],

    whenNotToUse: [
        { text: 'Full-width backgrounds', alternative: 'No wrapper or fluid variant' },
        { text: 'Sidebar content', alternative: 'Sidebar handles its own constraints' },
        { text: 'Modal content', alternative: 'Modal has built-in constraints' },
        { text: 'Table-heavy pages', alternative: 'Dashboard variant or fluid' },
    ],

    overview: {
        description: 'Width-constrained wrapper for consistent content presentation.',
        variants: ['narrow', 'wide', 'dashboard', 'fluid'],
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Container', description: 'Width-constrained wrapper element' },
                { name: '2. Content', description: 'Child elements within constraints' },
            ]
        },
        emphasis: 'Content centered with appropriate max-width for variant.',
        alignment: 'Horizontally centered with auto margins.',
    },

    content: {
        mainElements: 'Single container element with max-width and padding.',
        overflowContent: 'Content can overflow on x-axis if needed (tables, code blocks).',
        internationalization: 'Layout is direction-agnostic, works with LTR and RTL.',
    },

    designRecommendations: [
        'Use "wide" for standard content (articles, forms).',
        'Use "dashboard" for high-density information displays.',
        'Use "fluid" for edge-to-edge experiences only when necessary.',
        'Use "narrow" for focused reading experiences.',
    ],

    developmentConsiderations: [
        'Typically nested inside PageLayout.',
        'Can be used standalone for content sections.',
        'Responsive padding adjusts for mobile.',
    ],

    props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Content to wrap.' },
        { name: 'variant', type: '"narrow" | "wide" | "dashboard" | "fluid"', required: false, description: 'Width constraint variant.', defaultValue: '"wide"' },
        { name: 'className', type: 'string', required: false, description: 'Additional CSS classes.' },
    ],

    accessibility: {
        keyboard: [],
        aria: [
            { attribute: 'role="main"', usage: 'When used as main content area' },
        ],
        screenReader: 'Transparent to assistive technology. Content reads naturally.',
        focusIndicator: 'Not applicable (container element)',
    },

    relatedComponents: [
        { name: 'PageLayout', description: 'Full page structure', path: 'patterns/layout/page-layout' },
        { name: 'SectionLayout', description: 'Section with sidebar', path: 'patterns/layout/section-layout' },
        { name: 'Stack', description: 'Vertical content spacing', path: 'components/layout/stack' },
    ],
};

export default ContentLayoutDoc;
