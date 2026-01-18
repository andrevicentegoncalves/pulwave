/**
 * BoxDoc - Documentation for Box component
 */
import { ComponentDoc } from '@pulwave/features-style-guide';
import { BoxBasicDemo, BoxVariantsDemo } from '../demos';

const BoxDoc: ComponentDoc = {
    name: 'Box',
    subtitle: 'Low-level layout primitive for spacing and styling.',
    description: 'Box is the foundational layout primitive providing utility props for spacing, colors, borders, and polymorphic rendering as any HTML element.',
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
        'Custom spacing or margins on elements',
        'Applying background colors and borders',
        'Atomic layout adjustments and wrappers',
        'Polymorphic rendering as different HTML elements',
        'Building custom component compositions',
    ],

    whenNotToUse: [
        { text: 'Flexbox layouts', alternative: 'Stack or Inline components' },
        { text: 'Grid layouts', alternative: 'Grid component' },
        { text: 'Semantic content sections', alternative: 'Use appropriate HTML elements' },
        { text: 'Complex responsive layouts', alternative: 'Layout patterns' },
    ],

    overview: {
        description: 'Box allows applying utility styles via props for complete layout control.',
        variants: ['default', 'card', 'glass', 'outlined'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Box with custom styling and spacing.',
                component: BoxBasicDemo,
            },
            {
                name: 'Premium Variants',
                description: 'Showcasing Card, Glass, and Outlined variants.',
                component: BoxVariantsDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Container', description: 'Rendered element (polymorphic)' },
                { name: '2. Padding', description: 'Inner spacing area' },
                { name: '3. Content', description: 'Children rendered inside' },
                { name: '4. Border', description: 'Optional border styling' },
            ]
        },
        emphasis: 'Box is a utility component - style through props, not classes.',
        alignment: 'Default block display. Use display prop for other modes.',
    },

    content: {
        mainElements: 'Any React children. Box provides the container styling.',
        overflowContent: 'Overflow behavior controlled via overflow prop.',
        internationalization: 'Logical properties used for RTL support.',
    },

    designRecommendations: [
        'Use spacing scale values for consistent padding/margin.',
        'Prefer higher-level components (Stack, Grid) for layouts.',
        'Use semantic as prop for appropriate HTML structure.',
        'Avoid inline styles - use Box props instead.',
    ],

    developmentConsiderations: [
        'Box is polymorphic - renders as any element via as prop.',
        'All spacing props accept scale values (0-32) or CSS values.',
        'Combine with other layout primitives for complex layouts.',
        'Use for one-off styling needs not covered by other components.',
    ],

    props: [
        { name: 'children', type: 'ReactNode', required: false, description: 'Content to render inside the box.' },
        { name: 'as', type: 'ElementType', required: false, description: 'HTML element or component to render as.', defaultValue: '"div"' },
        { name: 'padding', type: 'number | string', required: false, description: 'All-sides padding.' },
        { name: 'paddingX', type: 'number | string', required: false, description: 'Horizontal padding.' },
        { name: 'paddingY', type: 'number | string', required: false, description: 'Vertical padding.' },
        { name: 'margin', type: 'number | string', required: false, description: 'All-sides margin.' },
        { name: 'background', type: 'string', required: false, description: 'Background color token.' },
        { name: 'borderRadius', type: 'string', required: false, description: 'Border radius token.' },
        { name: 'display', type: 'string', required: false, description: 'CSS display value.' },
    ],

    accessibility: {
        keyboard: [],
        aria: [],
        screenReader: 'Box is a layout-only component. Use semantic as prop for meaning.',
        focusIndicator: 'Not applicable (layout component).',
    },

    relatedComponents: [
        { name: 'Stack', description: 'Vertical/horizontal stacking', path: 'components/layout/stack' },
        { name: 'Inline', description: 'Horizontal inline layout', path: 'components/layout/inline' },
        { name: 'Grid', description: 'Two-dimensional grid layout', path: 'components/layout/grid' },
    ],
};

export default BoxDoc;
