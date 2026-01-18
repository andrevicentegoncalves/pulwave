import { ComponentDoc } from '@pulwave/features-style-guide';
import * as TabsDemos from '../demos';

const TabsDoc: ComponentDoc = {
    name: 'Tabs',
    subtitle: 'Organize content into switchable tabbed views.',
    description: 'Organize content into switchable tabbed views with multiple visual variants.',
    status: 'stable',
    version: '1.0.0',
    lastUpdated: '2026-01-17',

    accessibilityStatus: {
        keyboard: 'pass' as const,
        screenReader: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
    },

    whenToUse: [
        'Organizing related content into sections',
        'Settings or configuration panels',
        'Product information tabs',
        'Dashboard view switching',
        'Form with multiple sections',
    ],

    whenNotToUse: [
        { text: 'Sequential steps', alternative: 'Wizard component' },
        { text: 'Accordion-style expand/collapse', alternative: 'Accordion component' },
        { text: 'Primary application navigation', alternative: 'Menu or NestedSidebar' },
    ],

    overview: {
        description: 'Organize content into switchable tabbed views with various visual styles.',
        variants: ['default', 'pills', 'slider', 'slider-soft', 'flush', 'vertical'],
        demos: [
            {
                name: 'Basic Tabs with Border',
                description: 'Standard tabs with a visible bottom border line.',
                component: TabsDemos.TabsBorderedDemo,
            },
            {
                name: 'Basic Tabs (Line)',
                description: 'Standard borderless tabs with line indicator.',
                component: TabsDemos.TabsBasicLineDemo,
            },
            {
                name: 'Basic Tabs (Stacked)',
                description: 'Borderless tabs with stacked icon and label.',
                component: TabsDemos.TabsBasicStackedDemo,
            },
            {
                name: 'Pills Variant',
                description: 'Individual buttons that float independently.',
                component: TabsDemos.TabsPillsDemo,
            },
            {
                name: 'Slider Variant',
                description: 'Tabs with a shared track and sliding indicator.',
                component: TabsDemos.TabsSliderDemo,
            },
            {
                name: 'Slider Soft Variant',
                description: 'Soft container style with subtle active state.',
                component: TabsDemos.TabsSliderSoftDemo,
            },
            {
                name: 'Flush Variant',
                description: 'Full-width soft slider style.',
                component: TabsDemos.TabsFlushDemo,
            },
            {
                name: 'Variants with Icons',
                description: 'All variants support icons.',
                component: TabsDemos.TabsIconsDemo,
            },
            {
                name: 'Vertical Tabs',
                description: 'Tabs stacked vertically for settings or side navigation.',
                component: TabsDemos.TabsVerticalDemo,
            },
            {
                name: 'Tabs Sizes',
                description: 'Available sizes: s, m (default), l.',
                component: TabsDemos.TabsSizeDemo,
            },
            {
                name: 'Full Width Tabs',
                description: 'Tabs that expand to fill the container width.',
                component: TabsDemos.TabsFullWidthDemo,
            },
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Tab List', description: 'Container for tab triggers' },
                { name: '2. Tab Trigger', description: 'Individual tab button' },
                { name: '3. Active Indicator', description: 'Visual indicator for active tab' },
                { name: '4. Tab Icon', description: 'Optional icon in tab trigger' },
                { name: '5. Tab Label', description: 'Text label for the tab' },
                { name: '6. Tab Panel', description: 'Content area for active tab' },
            ]
        },
        emphasis: 'Active tab clearly distinguished from inactive tabs.',
        alignment: 'Horizontal by default, vertical for side navigation.',
    },

    content: {
        mainElements: 'Tab labels should be short and descriptive.',
        overflowContent: 'Many tabs may scroll or wrap based on variant.',
        internationalization: 'Tab labels should be translatable.',
    },

    designRecommendations: [
        'Keep tab labels concise (1-2 words).',
        'Limit number of tabs (5-7 maximum).',
        'Use icons to reinforce meaning.',
        'Choose variant appropriate to context.',
        'Ensure consistent content height when possible.',
    ],

    developmentConsiderations: [
        'Support both controlled and uncontrolled modes.',
        'Handle dynamic tab content loading.',
        'Implement proper focus management.',
        'Consider lazy loading tab content.',
        'Support deep linking to specific tabs.',
    ],

    props: [
        { name: 'value', type: 'string', description: 'Current active tab value (controlled)' },
        { name: 'defaultValue', type: 'string', description: 'Default active tab (uncontrolled)' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Callback when tab changes' },
        { name: 'orientation', type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', description: 'Layout orientation' },
        { name: 'variant', type: '"line" | "pills" | "slider" | "slider-soft" | "flush"', defaultValue: '"line"', description: 'Visual style variant' },
        { name: 'size', type: '"s" | "m" | "l"', defaultValue: '"m"', description: 'Size variant' },
        { name: 'fullWidth', type: 'boolean', defaultValue: 'false', description: 'Tabs fill container width' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Move focus to/from tab list' },
            { key: 'Arrow Left/Right', action: 'Navigate between tabs (horizontal)' },
            { key: 'Arrow Up/Down', action: 'Navigate between tabs (vertical)' },
            { key: 'Enter/Space', action: 'Activate focused tab' },
            { key: 'Home/End', action: 'Move to first/last tab' },
        ],
        aria: [
            { attribute: 'role="tablist"', usage: 'Container for tabs' },
            { attribute: 'role="tab"', usage: 'Individual tab triggers' },
            { attribute: 'role="tabpanel"', usage: 'Content panels' },
            { attribute: 'aria-selected', usage: 'Indicates active tab' },
            { attribute: 'aria-controls', usage: 'Links tab to its panel' },
        ],
        screenReader: 'Tab label and selection state announced.',
        focusIndicator: 'Focus ring on tab triggers.',
    },

    relatedComponents: [
        { name: 'Accordion', description: 'Expandable content sections', path: 'components/data-display/accordion' },
        { name: 'Menu', description: 'Sidebar navigation', path: 'components/navigation/menu' },
        { name: 'SegmentedControl', description: 'Mutually exclusive options', path: 'components/inputs/segmented-control' },
    ],
};

export default TabsDoc;

