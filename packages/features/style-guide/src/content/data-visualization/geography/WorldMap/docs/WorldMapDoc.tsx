import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const WorldMapDoc: ComponentDoc = {
    name: 'WorldMapChart',
    status: 'stable',
    version: '1.1.0',
    description: 'A global choropleth map for visualizing country-level data across the entire world. Supports multiple visualization modes including choropleth coloring, markers, bubbles, and route paths between locations.',

    whenToUse: [
        'Visualizing data across multiple countries or continents',
        'International business metrics (sales, users, revenue)',
        'Global distribution patterns and comparisons',
        'Trade flows and international relationships',
        'Multi-national market analysis',
    ],

    whenNotToUse: [
        'Single country detailed view - use CountryMapChart',
        'City-level precision needed - use BubbleMapChart',
        'Few countries (<5) - consider bar chart instead',
        'When precise geographic boundaries matter less than comparison',
    ],

    usage: `
\`\`\`tsx
import { WorldMapChart, ChartProvider } from '@pulwave/ui/data-visualization';

const internationalRevenue = [
    { country: 'USA', value: 4500000, growth: 12 },
    { country: 'GBR', value: 2800000, growth: 8 },
    { country: 'DEU', value: 2400000, growth: 15 },
    { country: 'JPN', value: 1900000, growth: 5 },
    { country: 'AUS', value: 950000, growth: 22 },
    { country: 'BRA', value: 780000, growth: 18 },
];

<ChartProvider>
  <WorldMapChart
    data={internationalRevenue}
    countryKey="country"
    valueKey="value"
    mode="choropleth"
    colorScale="sequential"
    showTooltip
    showLegend
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'WorldMapChart displays a complete world map with country boundaries. Colors or overlays represent data values. Essential elements include country polygons, color scale legend, tooltips, and optional zoom/pan controls.',
        overflowContent: 'World maps handle global data well. For >100 data points in marker/bubble mode, implement clustering. Consider regional zoom views for dense areas.',
        internationalization: 'Country names should be localized based on user locale. Support ISO 3166-1 alpha-3 country codes. Format values according to locale conventions.',
    },

    formatting: {
        emphasis: 'Use sequential color scales (light to dark) for single metrics. Use diverging scales for values with meaningful center (e.g., growth %). Ensure colorblind-safe palettes.',
        alignment: 'Default projection shows all continents. Consider mercator for navigation familiarity or equal-area for accurate size comparison. Center on data-rich regions if appropriate.',
    },

    props: [
        { name: 'data', type: "CountryData[]", required: true, description: 'Array of country-level data with ISO codes.' },
        { name: 'countryKey', type: "string", default: "'country'", description: 'Property name for ISO 3166-1 alpha-3 country codes.' },
        { name: 'valueKey', type: "string", default: "'value'", description: 'Property name for quantitative values.' },
        { name: 'mode', type: "'choropleth' | 'markers' | 'bubbles' | 'routes'", default: "'choropleth'", description: 'Visualization overlay mode.' },
        { name: 'colorScale', type: "'sequential' | 'diverging' | 'categorical'", default: "'sequential'", description: 'Color scale type for choropleth.' },
        { name: 'showTooltip', type: "boolean", default: "true", description: 'Show tooltips on hover.' },
        { name: 'showLegend', type: "boolean", default: "true", description: 'Display color scale legend.' },
        { name: 'onCountryClick', type: "(country: CountryData) => void", description: 'Callback when a country is clicked.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Map container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the visualization (e.g., "World map showing international revenue by country")' },
            { attribute: 'aria-describedby', usage: 'Links to accessible data table' },
        ],
        screenReader: 'Announce total countries with data, value range, and top/bottom performers. Provide sortable table alternative with country names and values.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between interactive countries' },
            { key: 'Enter', action: 'Select country and show details' },
            { key: 'Arrow Keys', action: 'Pan the map view' },
            { key: '+/-', action: 'Zoom in/out' },
        ],
    },
};

export default WorldMapDoc;
