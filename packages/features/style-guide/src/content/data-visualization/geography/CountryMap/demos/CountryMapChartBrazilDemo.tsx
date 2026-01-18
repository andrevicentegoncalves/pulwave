/**
 * CountryMapChart Brazil Demo
 */
import React from 'react';
import { CountryMapChart } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { CountryMapChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { region: 'São Paulo', value: 95 },
    { region: 'Rio de Janeiro', value: 82 },
    { region: 'Minas Gerais', value: 68 },
    { region: 'Bahia', value: 55 },
];

<ChartProvider>
  <CountryMapChart
    country="brazil"
    data={data}
    colorScale="green"
    title="Brazil Sales by State"
  />
</ChartProvider>`;

// Brazilian states
const data = [
    { region: 'São Paulo', value: 95 },
    { region: 'Rio de Janeiro', value: 82 },
    { region: 'Minas Gerais', value: 68 },
    { region: 'Bahia', value: 55 },
    { region: 'Paraná', value: 62 },
    { region: 'Rio Grande do Sul', value: 58 },
    { region: 'Pernambuco', value: 45 },
    { region: 'Ceará', value: 42 },
    { region: 'Goiás', value: 38 },
    { region: 'Santa Catarina', value: 52 },
    { region: 'Amazonas', value: 30 },
    { region: 'Pará', value: 28 },
    { region: 'Mato Grosso', value: 35 },
    { region: 'Distrito Federal', value: 72 },
];

const CountryMapChartBrazilDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Brazil States" description="Brazilian states with regional data.">
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <CountryMapChart
                country="brazil"
                data={data}
                colorScale="green"
                title="Brazil Sales by State"
                width={550}
                height={550}
            />
        </div>
    </DemoCard>
);

export default CountryMapChartBrazilDemo;
