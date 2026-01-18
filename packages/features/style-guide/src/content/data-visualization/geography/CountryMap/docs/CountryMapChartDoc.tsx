import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const CountryMapChartDoc: ComponentDoc = {
    name: 'CountryMapChart',
    status: 'stable',
    version: '1.1.0',
    description: 'A specialized choropleth map for visualizing data across administrative regions within a single country. Supports states, provinces, districts, and municipalities with pre-loaded SVG geographic boundaries for optimal performance.',

    whenToUse: [
        'National-level data broken down by region/state',
        'Comparing performance across domestic markets',
        'Election results or demographic data by region',
        'Regional sales or business metrics',
        'When detailed sub-national boundaries matter',
    ],

    whenNotToUse: [
        'Multi-country comparison - use WorldMapChart',
        'City-level point data - use BubbleMapChart',
        'Country not supported in available maps',
        'Very few regions (<4) - consider bar chart',
        'When regional boundaries obscure the insight',
    ],

    usage: `
\`\`\`tsx
import { CountryMapChart, ChartProvider } from '@pulwave/ui/data-visualization';

const portugalRegionSales = [
    { region: 'Lisboa', value: 2850000, growth: 15 },
    { region: 'Porto', value: 1920000, growth: 12 },
    { region: 'Faro', value: 680000, growth: 25 },
    { region: 'Braga', value: 520000, growth: 8 },
    { region: 'Coimbra', value: 480000, growth: 10 },
    { region: 'Setúbal', value: 390000, growth: 18 },
];

<ChartProvider>
  <CountryMapChart
    country="portugal"
    data={portugalRegionSales}
    regionKey="region"
    valueKey="value"
    colorScheme="blue"
    showLabels
    showLegend
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'CountryMapChart renders a single country with its internal administrative divisions (states, provinces, regions). Each region is colored based on data values. Elements include region polygons, color legend, labels, and tooltips.',
        overflowContent: 'Maps work well for standard administrative divisions. For custom regions or very detailed municipality-level data, consider performance implications. Label collision handling is automatic.',
        internationalization: 'Region names should match local conventions and be translatable. Support locale-specific number formatting. Consider local naming variants (e.g., "Lisboa" vs "Lisbon").',
    },

    formatting: {
        emphasis: 'Use sequential color scales for single metrics. Highlight selected region on interaction. Consider outline/border styles to distinguish adjacent regions with similar values.',
        alignment: 'Country is auto-centered and scaled to fit. All regions should be visible. Provide hover states and tooltips for region details.',
    },

    props: [
        { name: 'country', type: "'portugal' | 'usa' | 'brazil' | 'spain' | 'france'", required: true, description: 'Country identifier for loading geographic data.' },
        { name: 'data', type: "RegionData[]", required: true, description: 'Array of regional data objects.' },
        { name: 'regionKey', type: "string", default: "'region'", description: 'Property name for region identifier.' },
        { name: 'valueKey', type: "string", required: true, description: 'Property name for quantitative values.' },
        { name: 'colorScheme', type: "'blue' | 'green' | 'red' | 'purple' | 'orange'", default: "'blue'", description: 'Predefined color scheme for the choropleth.' },
        { name: 'showLabels', type: "boolean", default: "false", description: 'Display region name labels on the map.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Display the color scale legend.' },
        { name: 'onRegionClick', type: "(region: RegionData) => void", description: 'Callback when a region is clicked.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Map container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the visualization (e.g., "Map of Portugal showing sales by region")' },
            { attribute: 'aria-describedby', usage: 'Links to regional data table' },
        ],
        screenReader: 'Announce country name, number of regions with data, and value range. Each region announces name and value when focused.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between regions' },
            { key: 'Enter', action: 'Select region and show details' },
            { key: 'Escape', action: 'Clear selection' },
        ],
    },
};

export default CountryMapChartDoc;
