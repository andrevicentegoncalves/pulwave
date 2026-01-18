import { ComponentDoc } from '@pulwave/features-style-guide';
import { DensityDemo } from '../demos';

export const DensityDoc: ComponentDoc = {
    name: 'Density Control',
    subtitle: 'Interface spacing modes.',
    description: 'Manage interface density (compact, comfortable, spacious) via PulwaveProvider, allowing users or contexts to control information density throughout the application.',
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
        'Applications with varying information density needs',
        'Data-heavy dashboards where users want more data visible',
        'User preference settings for UI density',
        'Different contexts (mobile vs desktop views)',
        'Accessibility accommodations (larger touch targets)',
    ],

    whenNotToUse: [
        { text: 'Fixed layout requirements', alternative: 'Standard spacing tokens' },
        { text: 'Single-use components', alternative: 'Direct spacing props' },
        { text: 'Marketing pages', alternative: 'Consistent branding layout' },
        { text: 'Printable content', alternative: 'Print-specific styles' },
    ],

    overview: {
        description: 'Context-based density control for adjusting UI spacing globally.',
        variants: ['compact', 'comfortable', 'spacious'],
        demos: [
            {
                name: 'Density Toggle',
                description: 'Change density to see how it affects spacing context.',
                component: DensityDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. PulwaveProvider', description: 'Context provider with density state' },
                { name: '2. useDensity Hook', description: 'Access current density value' },
                { name: '3. CSS Variables', description: 'Density-aware spacing tokens' },
            ]
        },
        emphasis: 'Density affects all spacing tokens within the provider.',
        alignment: 'Components automatically adjust to density context.',
    },

    content: {
        mainElements: 'Provider, hook, and CSS variable system for density control.',
        overflowContent: 'Components adjust their internal spacing based on density.',
        internationalization: 'Density is visual; no text impact.',
    },

    designRecommendations: [
        'Default to "comfortable" for most applications.',
        'Offer "compact" for power users and data-heavy views.',
        'Use "spacious" for accessibility or touch-focused interfaces.',
        'Persist user preference in local storage or profile.',
    ],

    developmentConsiderations: [
        'Wrap application in PulwaveProvider to enable density.',
        'Use useDensity hook to read current density.',
        'Components automatically respond via CSS custom properties.',
        'Test all three density modes during development.',
    ],

    props: [
        { name: 'density', type: '"compact" | "comfortable" | "spacious"', required: false, description: 'Current density mode.', defaultValue: '"comfortable"' },
        { name: 'setDensity', type: '(density: Density) => void', required: false, description: 'Function to update density.' },
    ],

    accessibility: {
        keyboard: [],
        aria: [],
        screenReader: 'Density changes do not require announcements.',
        focusIndicator: 'Focus indicators scale with density for consistent visibility.',
    },

    relatedComponents: [
        { name: 'PulwaveProvider', description: 'Main context provider', path: 'foundation/provider' },
        { name: 'Spacing', description: 'Spacing token system', path: 'foundation/spacing' },
        { name: 'Grid', description: 'Layout grid system', path: 'foundation/grid' },
    ],
};

export default DensityDoc;
