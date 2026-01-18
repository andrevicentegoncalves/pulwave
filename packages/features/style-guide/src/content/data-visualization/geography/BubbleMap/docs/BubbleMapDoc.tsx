import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const BubbleMapDoc: ComponentDoc = {
    name: 'BubbleMapChart',
    status: 'stable',
    version: '1.1.0',
    description: 'Geographic map with bubbles positioned at locations, sized by value. Ideal for showing magnitude at specific places without the area-based distortion of choropleth maps. Perfect for city-level or point-based data.',

    whenToUse: [
        'City or point-based geographic data',
        'When data isn\'t tied to political boundaries',
        'Comparing magnitudes across locations',
        'Event or incident density visualization',
        'When avoiding choropleth area distortion is important',
    ],

    whenNotToUse: [
        'Data naturally maps to regions - use choropleth',
        'Dense overlapping locations - bubbles obscure each other',
        'When geographic coverage/density matters more than magnitude',
        'Very many locations (>100) - becomes cluttered',
        'When precise positioning isn\'t needed',
    ],

    usage: `
\`\`\`tsx
import { BubbleMapChart, ChartProvider } from '@pulwave/ui/data-visualization';

const globalOffices = [
    { city: 'New York', lat: 40.7128, lng: -74.0060, employees: 450 },
    { city: 'London', lat: 51.5074, lng: -0.1278, employees: 320 },
    { city: 'Tokyo', lat: 35.6762, lng: 139.6503, employees: 180 },
    { city: 'Singapore', lat: 1.3521, lng: 103.8198, employees: 95 },
    { city: 'Sydney', lat: -33.8688, lng: 151.2093, employees: 65 },
];

<ChartProvider>
  <BubbleMapChart
    data={globalOffices}
    latKey="lat"
    lngKey="lng"
    valueKey="employees"
    labelKey="city"
    minBubbleSize={10}
    maxBubbleSize={50}
    showLabels
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A bubble map displays a geographic basemap with circles positioned at coordinates. Circle size represents value magnitude. Essential elements include the map, bubbles, and optional labels.',
        overflowContent: 'Overlapping bubbles are a challenge. Consider clustering nearby points, reducing bubble opacity, or using zoom. Limit to ~50-100 visible bubbles.',
        internationalization: 'Location names should be translatable or localized. Format values according to locale. Map tiles may need localized labels.',
    },

    formatting: {
        emphasis: 'Use consistent bubble color or color-code by category. Size scaling should be perceptually accurate (area, not radius). Ensure bubbles don\'t obscure map features.',
        alignment: 'Center map to show all data points. Provide zoom/pan controls. Consider clustering at zoom-out levels.',
    },

    props: [
        { name: 'data', type: "Array<{lat, lng, value}>", required: true, description: 'Array of location objects with coordinates and values.' },
        { name: 'latKey', type: "string", default: "'lat'", description: 'Property name for latitude.' },
        { name: 'lngKey', type: "string", default: "'lng'", description: 'Property name for longitude.' },
        { name: 'valueKey', type: "string", default: "'value'", description: 'Property name for bubble size values.' },
        { name: 'labelKey', type: "string", description: 'Property name for location labels.' },
        { name: 'minBubbleSize', type: "number", default: "8", description: 'Minimum bubble radius in pixels.' },
        { name: 'maxBubbleSize', type: "number", default: "40", description: 'Maximum bubble radius in pixels.' },
        { name: 'showLabels', type: "boolean", default: "false", description: 'Display location labels.' },
        { name: 'onBubbleClick', type: "(location: Location) => void", description: 'Callback when a bubble is clicked.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Map container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the geographic data (e.g., "Bubble map showing employee counts at 5 global offices")' },
            { attribute: 'aria-describedby', usage: 'Links to location data table' },
        ],
        screenReader: 'Screen readers announce each location with name, coordinates, and value. Provide a sortable table alternative.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between bubbles' },
            { key: 'Enter', action: 'Show location details' },
            { key: 'Arrow Keys', action: 'Pan the map' },
            { key: '+/-', action: 'Zoom in/out' },
        ],
    },
};

export default BubbleMapDoc;
