/**
 * Style Guide Section Registry
 * Central configuration for all style guide sections
 * @package @pulwave/experience/style-guide
 */
import {
    // Section icons
    BookOpen,
    Palette,
    LayoutGrid,
    Layers,
    Wrench,
    BarChart3,
    // Category icons - Foundation
    Pipette,
    Type,
    AlignVerticalSpaceAround,
    Blend,
    Zap,
    GridIcon,
    Frame,
    MonitorSmartphone,
    Binary,
    Shapes,
    Accessibility,
    // Category icons - Components
    MousePointerClick,
    Table2,
    Layout,
    Navigation2,
    FormInput,
    MessageCircle,
    PanelRight,
    // Category icons - Patterns
    Database,
    Eye,
    Workflow,
    Search,
    ClipboardCheck,
    // Category icons - Utilities
    Settings,
    // Category icons - Data Visualization
    ChartLine,
    ChartBar,
    ChartPie,
    ChartScatter,
    GitFork,
    Network,
    Sparkles,
    Map,
    // Additional category icons
    Info,
    type IconComponent
} from '@pulwave/ui';

// Component Status Types (for future status badge implementation)
export type ComponentStatus = 'stable' | 'beta' | 'deprecated' | 'experimental';

// Level 1 Sections (Top-level sidebar categories)
export const SECTIONS = {
    gettingStarted: {
        id: 'getting-started',
        label: 'Getting Started',
        description: 'Introduction and quick start guides',
        icon: BookOpen,
    },
    foundation: {
        id: 'foundation',
        label: 'Foundation',
        description: 'Core design tokens and primitives',
        icon: Palette,
    },
    components: {
        id: 'components',
        label: 'Components',
        description: 'Reusable UI building blocks',
        icon: LayoutGrid,
    },
    patterns: {
        id: 'patterns',
        label: 'Patterns',
        description: 'Composed solutions and best practices',
        icon: Layers,
    },
    utilities: {
        id: 'utilities',
        label: 'Utilities',
        description: 'Helper components and accessibility tools',
        icon: Wrench,
    },
    dataVisualization: {
        id: 'data-visualization',
        label: 'Data Visualization',
        description: 'Charts (60+ types) and data display',
        icon: BarChart3,
    },
};


// Level 2 Categories (Nested within sections)
export const CATEGORIES = {
    // Getting Started Categories
    introduction: { section: 'getting-started', id: 'introduction', label: 'Introduction', icon: Info, items: ['overview', 'principles', 'for-designers', 'for-developers', 'ia-audit'] },

    // Foundation Categories
    color: { section: 'foundation', id: 'color', label: 'Color', icon: Pipette, items: ['overview'] },
    typography: { section: 'foundation', id: 'typography', label: 'Typography', icon: Type, items: ['overview'] },
    spacing: { section: 'foundation', id: 'spacing', label: 'Spacing', icon: AlignVerticalSpaceAround, items: ['overview'] },
    elevation: { section: 'foundation', id: 'elevation', label: 'Elevation', icon: Blend, items: ['overview'] },
    motion: { section: 'foundation', id: 'motion', label: 'Motion', icon: Zap, items: ['overview'] },
    gridSystem: { section: 'foundation', id: 'grid-system', label: 'Grid & Layout', icon: GridIcon, items: ['overview'] },
    borders: { section: 'foundation', id: 'borders', label: 'Borders & Shape', icon: Frame, items: ['overview'] },
    breakpoints: { section: 'foundation', id: 'breakpoints', label: 'Breakpoints', icon: MonitorSmartphone, items: ['overview'] },
    zIndex: { section: 'foundation', id: 'z-index', label: 'Z-Index & Layers', icon: Binary, items: ['overview'] },
    iconography: { section: 'foundation', id: 'iconography', label: 'Iconography', icon: Shapes, items: ['overview'] },
    accessibility: { section: 'foundation', id: 'accessibility', label: 'Accessibility', icon: Accessibility, items: ['overview'] },

    // Component Categories
    actions: { section: 'components', id: 'actions', label: 'Actions', icon: MousePointerClick, items: ['button', 'link', 'floating-action-button', 'segmented-control'] },
    dataDisplay: { section: 'components', id: 'data-display', label: 'Data Display', icon: Table2, items: ['avatar', 'badge', 'chip', 'tag', 'icon', 'status-indicator', 'accordion', 'card', 'card-grid', 'carousel', 'data-table', 'data-list', 'tree-view', 'progress', 'timeline', 'rating-stars', 'column-chips', 'circle-flag', 'verification-badge', 'visual-effect', 'locale-selector'] },
    componentTypography: { section: 'components', id: 'typography', label: 'Typography', icon: Type, items: ['text'] },
    layout: { section: 'components', id: 'layout', label: 'Layout', icon: Layout, items: ['box', 'stack', 'grid', 'inline', 'form-grid', 'divider', 'scroll-area', 'section-header'] },
    navigation: { section: 'components', id: 'navigation', label: 'Navigation', icon: Navigation2, items: ['nested-sidebar', 'pagination', 'breadcrumbs', 'stepper', 'menu', 'tabs', 'burger-menu', 'mobile-header'] },
    inputs: { section: 'components', id: 'inputs', label: 'Inputs', icon: FormInput, items: ['input', 'textarea', 'label', 'select', 'search-input', 'checkbox', 'checkbox-group', 'radio', 'switch', 'slider', 'file-upload', 'date-picker', 'time-picker', 'combobox', 'color-picker', 'transfer-list', 'inline-edit'] },
    feedback: { section: 'components', id: 'feedback', label: 'Feedback', icon: MessageCircle, items: ['alert', 'toast', 'spinner', 'skeleton', 'page-loader'] },
    overlays: { section: 'components', id: 'overlays', label: 'Overlays', icon: PanelRight, items: ['modal', 'tooltip', 'confirmation-modal'] },

    // Pattern Categories
    dataPatterns: { section: 'patterns', id: 'data', label: 'Data Patterns', icon: Database, items: ['bulk-action-bar', 'export-data', 'filterable-data-table', 'import-modal', 'data-transfer-button'] },
    displayPatterns: { section: 'patterns', id: 'display', label: 'Display Patterns', icon: Eye, items: ['metric-cards', 'carousel'] },
    processPatterns: { section: 'patterns', id: 'process', label: 'Process Patterns', icon: Workflow, items: ['wizard', 'avatar-upload'] },
    searchPatterns: { section: 'patterns', id: 'search', label: 'Search Patterns', icon: Search, items: ['search-filter'] },
    layoutPatterns: { section: 'patterns', id: 'layout', label: 'Layout Patterns', icon: Layout, items: ['section-layout', 'page-layout', 'header-layout', 'sidebar-layout', 'content-layout'] },
    formPatterns: { section: 'patterns', id: 'form', label: 'Form Patterns', icon: ClipboardCheck, items: ['generic-form'] },

    // Utility Categories
    appControls: { section: 'utilities', id: 'app-controls', label: 'App Controls', icon: Settings, items: ['theme-toggle', 'sidebar-toggle'] },
    accessibilityUtilities: { section: 'utilities', id: 'accessibility', label: 'Accessibility', icon: Accessibility, items: ['focus-trap', 'visually-hidden'] },

    // Data Visualization Categories
    lineArea: { section: 'data-visualization', id: 'line-area', label: 'Line & Area', icon: ChartLine, items: ['line-chart', 'area-chart', 'accumulated-line-chart', 'sparkline', 'dual-axis-chart', 'spline-line-chart', 'step-line-chart', 'stream-graph'] },
    bar: { section: 'data-visualization', id: 'bar', label: 'Bar', icon: ChartBar, items: ['bar-chart', 'stacked-bar', 'bullet-chart', 'diverging-bar-chart', 'mekko-chart', 'population-pyramid-chart'] },
    pieRadial: { section: 'data-visualization', id: 'pie-radial', label: 'Pie & Radial', icon: ChartPie, items: ['pie-chart', 'donut-chart', 'gauge', 'radial-bar', 'nested-pie-chart', 'polar-area-chart', 'progress-rings-chart', 'rose-chart'] },
    scatterStats: { section: 'data-visualization', id: 'scatter-stats', label: 'Scatter & Stats', icon: ChartScatter, items: ['scatter-chart', 'box-plot', 'histogram', 'dot-plot-chart', 'lollipop-chart'] },
    hierarchical: { section: 'data-visualization', id: 'hierarchical', label: 'Hierarchical', icon: GitFork, items: ['treemap', 'sunburst', 'org-chart', 'bubble-pack-chart'] },
    networkFlow: { section: 'data-visualization', id: 'network-flow', label: 'Network & Flow', icon: Network, items: ['sankey', 'chord-diagram', 'network', 'flow-chart'] },
    geography: { section: 'data-visualization', id: 'geography', label: 'Geography', icon: Map, items: ['world-map', 'bubble-map', 'country-map'] },
    comparison: { section: 'data-visualization', id: 'comparison', label: 'Comparison', icon: Sparkles, items: ['funnel', 'pyramid', 'waterfall'] },
    composition: { section: 'data-visualization', id: 'composition', label: 'Composition', icon: Sparkles, items: ['parliament', 'pictogram', 'venn-diagram', 'waffle'] },
    scheduling: { section: 'data-visualization', id: 'scheduling', label: 'Scheduling', icon: Sparkles, items: ['gantt', 'timeline'] },
    specialized: { section: 'data-visualization', id: 'specialized', label: 'Specialized', icon: Sparkles, items: ['heatmap', 'radar', 'rose', 'spiral-plot', 'word-cloud'] },
};

export const getCategoriesForSection = (sectionId: string) =>
    Object.values(CATEGORIES).filter((cat) => cat.section === sectionId);

export const getNavigationTree = () =>
    Object.values(SECTIONS).map((section) => ({
        ...section,
        categories: getCategoriesForSection(section.id),
    }));
