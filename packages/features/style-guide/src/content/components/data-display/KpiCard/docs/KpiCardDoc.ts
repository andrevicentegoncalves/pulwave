import { ComponentDoc } from '@pulwave/features-style-guide';
import * as KpiCardDemos from '../demos';

const KpiCardDoc: ComponentDoc = {
    name: 'KpiCard',
    subtitle: 'A card for displaying Key Performance Indicators.',
    description: 'The KpiCard component highlights critical data points with optional trends, charts, or comparisons, ideal for dashboards and executive summaries.',
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
        'Dashboard overview sections with key metrics',
        'Executive summaries requiring quick data scanning',
        'Real-time monitoring displays',
        'Sales, revenue, or performance tracking',
        'Comparing current vs previous period metrics',
    ],

    whenNotToUse: [
        { text: 'Detailed data analysis', alternative: 'DataTable or charts' },
        { text: 'Single numeric display without context', alternative: 'StatCard or Text' },
        { text: 'Complex multi-dimensional data', alternative: 'Charts with proper axes' },
        { text: 'Historical trends over time', alternative: 'LineChart or AreaChart' },
    ],

    overview: {
        description: 'The KpiCard component highlights critical data points with optional trends, charts, or comparisons, ideal for dashboards.',
        variants: ['default', 'compact', 'expanded'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Simple KPI card with value and label.',
                component: KpiCardDemos.KpiCardBasicDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Card Container', description: 'Elevated surface containing the KPI' },
                { name: '2. Title/Label', description: 'Describes what the metric represents' },
                { name: '3. Value', description: 'The primary numeric or text value' },
                { name: '4. Trend Indicator', description: 'Shows direction and magnitude of change' },
                { name: '5. Icon', description: 'Optional visual identifier for the metric type' },
            ]
        },
        emphasis: 'The value should be the most prominent element. Use color coding for trend direction (green=up, red=down for positive metrics).',
        alignment: 'Left-align labels, right-align or center values. Group related KPIs in consistent grid layouts.',
    },

    content: {
        mainElements: 'Title describes the metric, value shows current state, trend shows change over time.',
        overflowContent: 'Values should not truncate. Format large numbers with abbreviations (1.2M, 45K).',
        internationalization: 'Format numbers according to locale. Trend percentages use locale decimal separators. Labels should be translatable.',
    },

    props: [
        {
            name: 'title',
            type: 'string',
            required: true,
            description: 'The label describing the KPI metric.',
        },
        {
            name: 'value',
            type: 'string | number',
            required: true,
            description: 'The main value to display prominently.',
        },
        {
            name: 'trend',
            type: '{ value: number; label?: string; direction: "up" | "down" | "neutral" }',
            required: false,
            description: 'Trend information showing change direction and magnitude.',
        },
        {
            name: 'icon',
            type: 'ReactNode',
            required: false,
            description: 'Optional icon to provide visual context for the metric type.',
        },
        {
            name: 'variant',
            type: "'default' | 'compact' | 'expanded'",
            required: false,
            defaultValue: "'default'",
            description: 'Visual variant controlling the card size and detail level.',
        },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Focus the card if interactive' },
            { key: 'Enter', action: 'Activate card action if clickable' },
        ],
        aria: [
            { attribute: 'role="article"', usage: 'Semantic container for the metric' },
            { attribute: 'aria-label', usage: 'Full description: "[title]: [value], [trend]"' },
            { attribute: 'aria-live="polite"', usage: 'For real-time updating values' },
        ],
        screenReader: 'Announces: "[title], [value], [trend direction] [trend value]". Updates announce new values.',
        focusIndicator: 'Focus ring around card when interactive',
    },

    relatedComponents: [
        { name: 'StatCard', description: 'Simpler stat display', path: 'components/data-display/stat-card' },
        { name: 'Card', description: 'Generic card container', path: 'components/data-display/card' },
        { name: 'Progress', description: 'For goal-based metrics', path: 'components/data-display/progress' },
    ],
};

export default KpiCardDoc;

