/**
 * Data Visualization Registry
 * Charts and graphing components
 */
import type { ComponentRegistry } from '../types';
import * as DataVizContent from '../../content/data-visualization';

export const dataVisualizationRegistry: ComponentRegistry = {
    // ============================================================================
    // LINE & AREA
    // ============================================================================
    'data-visualization/line-area/line-chart': {
        doc: DataVizContent.LineAreaContent.LineChartDoc,
        demos: DataVizContent.LineAreaContent.LineChartDemos,
        title: 'Line Chart',
    },
    'data-visualization/line-area/area-chart': {
        doc: DataVizContent.LineAreaContent.AreaChartDoc,
        demos: DataVizContent.LineAreaContent.AreaChartDemos,
        title: 'Area Chart',
    },
    'data-visualization/line-area/accumulated-line-chart': {
        doc: DataVizContent.LineAreaContent.AccumulatedLineChartDoc,
        demos: DataVizContent.LineAreaContent.AccumulatedLineChartDemos,
        title: 'Accumulated Line',
    },
    'data-visualization/line-area/sparkline': {
        doc: DataVizContent.LineAreaContent.SparklineDoc,
        demos: DataVizContent.LineAreaContent.SparklineDemos,
        title: 'Sparkline',
    },
    'data-visualization/line-area/dual-axis-chart': {
        doc: DataVizContent.LineAreaContent.DualAxisChartDoc,
        demos: DataVizContent.LineAreaContent.DualAxisChartDemos,
        title: 'Dual Axis',
    },
    'data-visualization/line-area/spline-line-chart': {
        doc: DataVizContent.LineAreaContent.SplineLineChartDoc,
        demos: DataVizContent.LineAreaContent.SplineLineChartDemos,
        title: 'Spline Line',
    },
    'data-visualization/line-area/step-line-chart': {
        doc: DataVizContent.LineAreaContent.StepLineChartDoc,
        demos: DataVizContent.LineAreaContent.StepLineChartDemos,
        title: 'Step Line',
    },
    'data-visualization/line-area/stream-graph': {
        doc: DataVizContent.LineAreaContent.StreamGraphDoc,
        demos: DataVizContent.LineAreaContent.StreamGraphDemos,
        title: 'Stream Graph',
    },
    'data-visualization/line-area/step-area-chart': {
        doc: DataVizContent.LineAreaContent.StepAreaChartDoc,
        demos: DataVizContent.LineAreaContent.StepAreaChartDemos,
        title: 'Step Area',
    },
    'data-visualization/line-area/threshold-area-chart': {
        doc: DataVizContent.LineAreaContent.ThresholdAreaChartDoc,
        demos: DataVizContent.LineAreaContent.ThresholdAreaChartDemos,
        title: 'Threshold Area',
    },

    // ============================================================================
    // BAR
    // ============================================================================
    'data-visualization/bar/bar-chart': {
        doc: DataVizContent.BarContent.BarChartDoc,
        demos: DataVizContent.BarContent.BarChartDemos,
        title: 'Bar Chart',
    },
    'data-visualization/bar/bullet-chart': {
        doc: DataVizContent.BarContent.BulletChartDoc,
        demos: DataVizContent.BarContent.BulletChartDemos,
        title: 'Bullet Chart',
    },
    'data-visualization/bar/diverging-bar-chart': {
        doc: DataVizContent.BarContent.DivergingBarChartDoc,
        demos: DataVizContent.BarContent.DivergingBarChartDemos,
        title: 'Diverging Bar',
    },
    'data-visualization/bar/mekko-chart': {
        doc: DataVizContent.BarContent.MekkoChartDoc,
        demos: DataVizContent.BarContent.MekkoChartDemos,
        title: 'Mekko Chart',
    },
    'data-visualization/bar/stacked-bar': {
        doc: DataVizContent.BarContent.StackedBarChartDoc,
        demos: DataVizContent.BarContent.StackedBarChartDemos,
        title: 'Stacked Bar',
    },
    'data-visualization/bar/population-pyramid': {
        doc: DataVizContent.BarContent.PopulationPyramidChartDoc,
        demos: DataVizContent.BarContent.PopulationPyramidChartDemos,
        title: 'Population Pyramid',
    },

    // ============================================================================
    // PIE & RADIAL
    // ============================================================================
    'data-visualization/pie-radial/pie-chart': {
        doc: DataVizContent.PieRadialContent.PieChartDoc,
        demos: DataVizContent.PieRadialContent.PieChartDemos,
        title: 'Pie Chart',
    },
    'data-visualization/pie-radial/donut-chart': {
        doc: DataVizContent.PieRadialContent.DonutChartDoc,
        demos: DataVizContent.PieRadialContent.DonutChartDemos,
        title: 'Donut Chart',
    },
    'data-visualization/pie-radial/gauge': {
        doc: DataVizContent.PieRadialContent.GaugeChartDoc,
        demos: DataVizContent.PieRadialContent.GaugeChartDemos,
        title: 'Gauge',
    },
    'data-visualization/pie-radial/radial-bar': {
        doc: DataVizContent.PieRadialContent.RadialBarChartDoc,
        demos: DataVizContent.PieRadialContent.RadialBarChartDemos,
        title: 'Radial Bar',
    },
    'data-visualization/pie-radial/nested-pie-chart': {
        doc: DataVizContent.PieRadialContent.NestedPieChartDoc,
        demos: DataVizContent.PieRadialContent.NestedPieChartDemos,
        title: 'Nested Pie',
    },
    'data-visualization/pie-radial/polar-area-chart': {
        doc: DataVizContent.PieRadialContent.PolarAreaChartDoc,
        demos: DataVizContent.PieRadialContent.PolarAreaChartDemos,
        title: 'Polar Area',
    },
    'data-visualization/pie-radial/circular-line-chart': {
        doc: DataVizContent.PieRadialContent.CircularLineChartDoc,
        demos: DataVizContent.PieRadialContent.CircularLineChartDemos,
        title: 'Circular Line',
    },
    'data-visualization/pie-radial/progress-rings': {
        doc: DataVizContent.PieRadialContent.ProgressRingsChartDoc,
        demos: DataVizContent.PieRadialContent.ProgressRingsChartDemos,
        title: 'Progress Rings',
    },
    'data-visualization/pie-radial/rose-chart': {
        doc: DataVizContent.PieRadialContent.RoseChartDoc,
        demos: DataVizContent.PieRadialContent.RoseChartDemos,
        title: 'Rose Chart',
    },

    // ============================================================================
    // SCATTER & STATS
    // ============================================================================
    'data-visualization/scatter-stats/scatter-chart': {
        doc: DataVizContent.ScatterStatsContent.ScatterChartDoc,
        demos: DataVizContent.ScatterStatsContent.ScatterChartDemos,
        title: 'Scatter Chart',
    },
    'data-visualization/scatter-stats/box-plot': {
        doc: DataVizContent.ScatterStatsContent.BoxPlotChartDoc,
        demos: DataVizContent.ScatterStatsContent.BoxPlotChartDemos,
        title: 'Box Plot',
    },
    'data-visualization/scatter-stats/histogram': {
        doc: DataVizContent.ScatterStatsContent.HistogramDoc,
        demos: DataVizContent.ScatterStatsContent.HistogramDemos,
        title: 'Histogram',
    },
    'data-visualization/scatter-stats/dot-plot-chart': {
        doc: DataVizContent.ScatterStatsContent.DotPlotChartDoc,
        demos: DataVizContent.ScatterStatsContent.DotPlotChartDemos,
        title: 'Dot Plot',
    },
    'data-visualization/scatter-stats/violin-plot': {
        doc: DataVizContent.ScatterStatsContent.ViolinPlotDoc,
        demos: DataVizContent.ScatterStatsContent.ViolinPlotDemos,
        title: 'Violin Plot',
    },
    'data-visualization/scatter-stats/parallel-coordinates': {
        doc: DataVizContent.ScatterStatsContent.ParallelCoordinatesPlotDoc,
        demos: DataVizContent.ScatterStatsContent.ParallelCoordinatesPlotDemos,
        title: 'Parallel Coordinates',
    },
    'data-visualization/scatter-stats/lollipop-chart': {
        doc: DataVizContent.ScatterStatsContent.LollipopChartDoc,
        demos: DataVizContent.ScatterStatsContent.LollipopChartDemos,
        title: 'Lollipop Chart',
    },

    // ============================================================================
    // HIERARCHICAL
    // ============================================================================
    'data-visualization/hierarchical/treemap': {
        doc: DataVizContent.HierarchicalContent.TreemapDoc,
        demos: DataVizContent.HierarchicalContent.TreemapDemos,
        title: 'Treemap',
    },
    'data-visualization/hierarchical/sunburst': {
        doc: DataVizContent.HierarchicalContent.SunburstChartDoc,
        demos: DataVizContent.HierarchicalContent.SunburstChartDemos,
        title: 'Sunburst',
    },
    'data-visualization/hierarchical/org-chart': {
        doc: DataVizContent.HierarchicalContent.OrgChartDoc,
        demos: DataVizContent.HierarchicalContent.OrgChartDemos,
        title: 'Org Chart',
    },
    'data-visualization/hierarchical/bubble-pack': {
        doc: DataVizContent.HierarchicalContent.BubblePackChartDoc,
        demos: DataVizContent.HierarchicalContent.BubblePackChartDemos,
        title: 'Bubble Pack',
    },

    // ============================================================================
    // NETWORK & FLOW
    // ============================================================================
    'data-visualization/network-flow/sankey': {
        doc: DataVizContent.NetworkFlowContent.SankeyDoc,
        demos: DataVizContent.NetworkFlowContent.SankeyDemos,
        title: 'Sankey',
    },
    'data-visualization/network-flow/chord-diagram': {
        doc: DataVizContent.NetworkFlowContent.ChordDiagramDoc,
        demos: DataVizContent.NetworkFlowContent.ChordDiagramDemos,
        title: 'Chord Diagram',
    },
    'data-visualization/network-flow/network': {
        doc: DataVizContent.NetworkFlowContent.NetworkDoc,
        demos: DataVizContent.NetworkFlowContent.NetworkDemos,
        title: 'Network',
    },
    'data-visualization/network-flow/flow-chart': {
        doc: DataVizContent.NetworkFlowContent.FlowChartDoc,
        demos: DataVizContent.NetworkFlowContent.FlowChartDemos,
        title: 'Flow Chart',
    },

    // ============================================================================
    // GEOGRAPHY
    // ============================================================================
    'data-visualization/geography/world-map': {
        doc: DataVizContent.GeographyContent.WorldMapDoc,
        demos: DataVizContent.GeographyContent.WorldMapDemos,
        title: 'World Map',
    },
    'data-visualization/geography/bubble-map': {
        doc: DataVizContent.GeographyContent.BubbleMapDoc,
        demos: DataVizContent.GeographyContent.BubbleMapDemos,
        title: 'Bubble Map',
    },
    'data-visualization/geography/country-map': {
        doc: DataVizContent.GeographyContent.CountryMapDoc,
        demos: DataVizContent.GeographyContent.CountryMapDemos,
        title: 'Country Map',
    },

    // ============================================================================
    // FINANCIAL
    // ============================================================================
    'data-visualization/financial/candlestick': {
        doc: DataVizContent.FinancialContent.CandlestickDoc,
        demos: DataVizContent.FinancialContent.CandlestickDemos,
        title: 'Candlestick',
    },

    // ============================================================================
    // PROGRESS
    // ============================================================================
    'data-visualization/progress/performance-gauge': {
        doc: DataVizContent.ProgressContent.PerformanceGaugeDoc,
        demos: DataVizContent.ProgressContent.PerformanceGaugeDemos,
        title: 'Performance Gauge',
    },
    'data-visualization/progress/progress-rings': {
        doc: DataVizContent.ProgressContent.ProgressRingsDoc,
        demos: DataVizContent.ProgressContent.ProgressRingsDemos,
        title: 'Progress Rings',
    },

    // ============================================================================
    // COMPARISON
    // ============================================================================
    'data-visualization/comparison/funnel': {
        doc: DataVizContent.ComparisonContent.FunnelChartDoc,
        demos: DataVizContent.ComparisonContent.FunnelChartDemos,
        title: 'Funnel',
    },
    'data-visualization/comparison/pyramid': {
        doc: DataVizContent.ComparisonContent.PyramidChartDoc,
        demos: DataVizContent.ComparisonContent.PyramidChartDemos,
        title: 'Pyramid',
    },
    'data-visualization/comparison/waterfall': {
        doc: DataVizContent.ComparisonContent.WaterfallChartDoc,
        demos: DataVizContent.ComparisonContent.WaterfallChartDemos,
        title: 'Waterfall',
    },

    // ============================================================================
    // COMPOSITION
    // ============================================================================
    'data-visualization/composition/parliament': {
        doc: DataVizContent.CompositionContent.ParliamentChartDoc,
        demos: DataVizContent.CompositionContent.ParliamentChartDemos,
        title: 'Parliament',
    },
    'data-visualization/composition/pictogram': {
        doc: DataVizContent.CompositionContent.PictogramChartDoc,
        demos: DataVizContent.CompositionContent.PictogramChartDemos,
        title: 'Pictogram',
    },
    'data-visualization/composition/venn-diagram': {
        doc: DataVizContent.CompositionContent.VennDiagramDoc,
        demos: DataVizContent.CompositionContent.VennDiagramDemos,
        title: 'Venn Diagram',
    },
    'data-visualization/composition/waffle': {
        doc: DataVizContent.CompositionContent.WaffleChartDoc,
        demos: DataVizContent.CompositionContent.WaffleChartDemos,
        title: 'Waffle',
    },

    // ============================================================================
    // SCHEDULING
    // ============================================================================
    'data-visualization/scheduling/gantt': {
        doc: DataVizContent.SchedulingContent.GanttChartDoc,
        demos: DataVizContent.SchedulingContent.GanttChartDemos,
        title: 'Gantt',
    },
    'data-visualization/scheduling/timeline': {
        doc: DataVizContent.SchedulingContent.TimelineDoc,
        demos: DataVizContent.SchedulingContent.TimelineDemos,
        title: 'Timeline',
    },

    // ============================================================================
    // SPECIALIZED
    // ============================================================================
    'data-visualization/specialized/heatmap': {
        doc: DataVizContent.SpecializedContent.HeatmapDoc,
        demos: DataVizContent.SpecializedContent.HeatmapDemos,
        title: 'Heatmap',
    },
    'data-visualization/specialized/radar': {
        doc: DataVizContent.SpecializedContent.RadarChartDoc,
        demos: DataVizContent.SpecializedContent.RadarChartDemos,
        title: 'Radar',
    },
    'data-visualization/specialized/rose': {
        doc: DataVizContent.SpecializedContent.RoseDoc,
        demos: DataVizContent.SpecializedContent.RoseDemos,
        title: 'Rose',
    },
    'data-visualization/specialized/spiral-plot': {
        doc: DataVizContent.SpecializedContent.SpiralPlotDoc,
        demos: DataVizContent.SpecializedContent.SpiralPlotDemos,
        title: 'Spiral Plot',
    },
    'data-visualization/specialized/word-cloud': {
        doc: DataVizContent.SpecializedContent.WordCloudDoc,
        demos: DataVizContent.SpecializedContent.WordCloudDemos,
        title: 'Word Cloud',
    },

    // ============================================================================
    // DUPLICATES - keeping for backwards compatibility during migration
    // ============================================================================
    'data-visualization/bar/population-pyramid-chart': {
        doc: DataVizContent.BarContent.PopulationPyramidChartDoc,
        demos: DataVizContent.BarContent.PopulationPyramidChartDemos,
        title: 'Population Pyramid Chart',
    },
    'data-visualization/hierarchical/bubble-pack-chart': {
        doc: DataVizContent.HierarchicalContent.BubblePackChartDoc,
        demos: DataVizContent.HierarchicalContent.BubblePackChartDemos,
        title: 'Bubble Pack Chart',
    },
    'data-visualization/pie-radial/progress-rings-chart': {
        doc: DataVizContent.PieRadialContent.ProgressRingsChartDoc,
        demos: DataVizContent.PieRadialContent.ProgressRingsChartDemos,
        title: 'Progress Rings Chart',
    },
};
