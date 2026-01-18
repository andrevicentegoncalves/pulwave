/**
 * CountryMapChart Basic Demo - Portugal
 */
import React from 'react';
import { CountryMapChart } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { CountryMapChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { region: 'Lisboa', value: 95 },
    { region: 'Porto', value: 82 },
    { region: 'Braga', value: 68 },
    { region: 'Faro', value: 75 },
];

<ChartProvider>
  <CountryMapChart
    country="portugal"
    data={data}
    colorScale="orange"
    title="Portugal Sales by District"
    width={400}
    height={500}
  />
</ChartProvider>`;

// Portugal mainland districts (using region names, not codes)
const data = [
    { region: 'Lisboa', value: 95 },
    { region: 'Porto', value: 82 },
    { region: 'Braga', value: 68 },
    { region: 'Faro', value: 75 },
    { region: 'Setúbal', value: 72 },
    { region: 'Aveiro', value: 55 },
    { region: 'Leiria', value: 48 },
    { region: 'Coimbra', value: 52 },
    { region: 'Viseu', value: 40 },
    { region: 'Santarém', value: 38 },
    { region: 'Évora', value: 35 },
    { region: 'Castelo Branco', value: 28 },
    { region: 'Guarda', value: 22 },
    { region: 'Viana do Castelo', value: 45 },
    { region: 'Vila Real', value: 32 },
    { region: 'Bragança', value: 25 },
    { region: 'Beja', value: 20 },
    { region: 'Portalegre', value: 18 },
];

const CountryMapChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Portugal Districts" description="Portuguese districts with regional data.">
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <CountryMapChart
                country="portugal"
                data={data}
                colorScale="orange"
                title="Portugal Sales by District"
                width={400}
                height={500}
            />
        </div>
    </DemoCard>
);

export default CountryMapChartBasicDemo;
