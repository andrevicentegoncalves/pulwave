import React from 'react';
import { useRegistry } from '../../core/RegistryContext';
import { Text } from "@pulwave/ui";

export interface StyleGuideLinkProps {
    text: string;
    className?: string;
}

// Helper function outside component to avoid recreation on every render
const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * StyleGuideLink
 * 
 * Automatically detects component names in the provided text and wraps them 
 * in links to their respective documentation pages.
 */
export const StyleGuideLink = ({ text, className = 'component-doc__alternative-link hover:underline' }: StyleGuideLinkProps) => {
    const registry = useRegistry();

    if (!text) return null;

    // Get all component titles sorted by length (descending) to match longest names first
    const components = React.useMemo(() => {
        const aliases: Record<string, string> = {
            'Text Button': 'components/primitives/button',
            'TextButton': 'components/primitives/button',
            'DatePicker': 'components/data-entry/date-picker',
            'TimePicker': 'components/data-entry/time-picker',
            'AvatarUpload': 'patterns/media/avatar-upload',
            'FormGrid': 'components/layout/form-grid',

            // Patterns
            'KpiCard': 'patterns/cards/kpi-card',
            'StatCard': 'patterns/cards/stat-card',
            'EmptyState': 'patterns/states/empty-state',
            'CircleFlag': 'patterns/media/circle-flag',
            'VerificationBadge': 'patterns/media/verification-badge',
            'VisualEffect': 'patterns/media/visual-effect',
            'LocaleSelector': 'patterns/media/locale-selector',
            'InlineEdit': 'patterns/forms/inline-edit',
            'SearchFilter': 'patterns/forms/search-filter',
            'FilterableDataTable': 'patterns/table/filterable-data-table',
            'BulkActionBar': 'patterns/actions/bulk-action-bar',
            'ExportData': 'patterns/data/export-data',

            // Data Display
            'CardGrid': 'components/data-display/card-grid',
            'DataTable': 'components/data-display/data-table',
            'DataList': 'components/data-display/data-list',
            'TreeView': 'components/data-display/tree-view',
            'RatingStars': 'components/data-display/rating-stars',
            'ColumnChips': 'components/data-display/column-chips',

            // Overlays
            'ConfirmationModal': 'components/overlays/confirmation-modal',

            // Data Visualization - Bar
            'BarChart': 'data-visualization/bar/bar-chart',
            'StackedBarChart': 'data-visualization/bar/stacked-bar',
            'GroupedBarChart': 'data-visualization/bar/grouped-bar',
            'HorizontalBarChart': 'data-visualization/bar/horizontal-bar',
            'BulletChart': 'data-visualization/bar/bullet-chart',
            'DivergingBarChart': 'data-visualization/bar/diverging-bar-chart',
            'MekkoChart': 'data-visualization/bar/mekko-chart',
            'PopulationPyramidChart': 'data-visualization/bar/population-pyramid-chart',

            // Data Visualization - Hierarchical
            'Treemap': 'data-visualization/hierarchical/treemap',
            'SunburstChart': 'data-visualization/hierarchical/sunburst',
            'OrgChart': 'data-visualization/hierarchical/org-chart',
            'BubblePackChart': 'data-visualization/hierarchical/bubble-pack-chart',

            // Data Visualization - Line/Area
            'LineChart': 'data-visualization/line-area/line-chart',
            'AreaChart': 'data-visualization/line-area/area-chart',
            'AccumulatedLineChart': 'data-visualization/line-area/accumulated-line-chart',
            'StackedAreaChart': 'data-visualization/line-area/stacked-area',
            'Sparkline': 'data-visualization/line-area/sparkline',
            'CircularLineChart': 'data-visualization/line-area/circular-line-chart',
            'DualAxisChart': 'data-visualization/line-area/dual-axis-chart',
            'SplineLineChart': 'data-visualization/line-area/spline-line-chart',
            'StepLineChart': 'data-visualization/line-area/step-line-chart',
            'StreamGraph': 'data-visualization/line-area/stream-graph',

            // Data Visualization - Pie/Radial
            'PieChart': 'data-visualization/pie-radial/pie-chart',
            'DonutChart': 'data-visualization/pie-radial/donut-chart',
            'GaugeChart': 'data-visualization/pie-radial/gauge',
            'RadialBarChart': 'data-visualization/pie-radial/radial-bar',
            'NestedPieChart': 'data-visualization/pie-radial/nested-pie-chart',
            'PolarAreaChart': 'data-visualization/pie-radial/polar-area-chart',
            'ProgressRingsChart': 'data-visualization/pie-radial/progress-rings-chart',
            'RoseChart': 'data-visualization/pie-radial/rose-chart',

            // Data Visualization - Network
            'SankeyDiagram': 'data-visualization/network-flow/sankey',
            'ChordDiagram': 'data-visualization/network-flow/chord-diagram',
            'Network': 'data-visualization/network-flow/network',
            'FlowChart': 'data-visualization/network-flow/flow-chart',

            // Data Visualization - Scatter
            'ScatterChart': 'data-visualization/scatter-stats/scatter-chart',
            'BoxPlotChart': 'data-visualization/scatter-stats/box-plot',
            'Histogram': 'data-visualization/scatter-stats/histogram',
            'DotPlotChart': 'data-visualization/scatter-stats/dot-plot-chart',
            'LollipopChart': 'data-visualization/scatter-stats/lollipop-chart',

            // Data Visualization - Geography
            'WorldMap': 'data-visualization/geography/world-map',
            'BubbleMap': 'data-visualization/geography/bubble-map',
            'BubbleMapChart': 'data-visualization/geography/bubble-map',
            'CountryMap': 'data-visualization/geography/country-map',
            'CountryMapChart': 'data-visualization/geography/country-map',

            // Data Visualization - Comparison
            'FunnelChart': 'data-visualization/comparison/funnel',
            'PyramidChart': 'data-visualization/comparison/pyramid',
            'WaterfallChart': 'data-visualization/comparison/waterfall',

            // Data Visualization - Composition
            'ParliamentChart': 'data-visualization/composition/parliament',
            'PictogramChart': 'data-visualization/composition/pictogram',
            'VennDiagram': 'data-visualization/composition/venn-diagram',
            'WaffleChart': 'data-visualization/composition/waffle',

            // Data Visualization - Scheduling
            'GanttChart': 'data-visualization/scheduling/gantt',
            'Timeline': 'data-visualization/scheduling/timeline',

            // Data Visualization - Specialized
            'Heatmap': 'data-visualization/specialized/heatmap',
            'RadarChart': 'data-visualization/specialized/radar',
            'Rose': 'data-visualization/specialized/rose',
            'SpiralPlot': 'data-visualization/specialized/spiral-plot',
            'WordCloud': 'data-visualization/specialized/word-cloud',
        };

        const standardComponents = Object.entries(registry)
            .map(([path, reg]) => ({ title: reg.title, path }))
            .filter(c => c.title);

        const aliasComponents = Object.entries(aliases)
            .map(([title, path]) => ({ title, path }));

        return [...standardComponents, ...aliasComponents]
            .sort((a, b) => b.title.length - a.title.length);
    }, [registry]);

    if (components.length === 0) return <>{text}</>;

    const pattern = React.useMemo(() =>
        new RegExp(`(${components.map(c => escapeRegExp(c.title)).join('|')})`, 'g'),
        [components]);

    const parts = text.split(pattern);

    return (
        <>
            {parts.map((part, i) => {
                const comp = components.find(c => c.title === part);
                if (comp) {
                    return (
                        <a
                            key={i}
                            href={`#${comp.path}`}
                            className={className}
                            onClick={(e) => {
                                e.preventDefault();
                                window.dispatchEvent(new CustomEvent('style-guide-navigate', {
                                    detail: { path: comp.path }
                                }));
                            }}
                        >
                            {part}
                        </a>
                    );
                }
                return <Text as="span" key={i}>{part}</Text>;
            })}
        </>
    );
};
