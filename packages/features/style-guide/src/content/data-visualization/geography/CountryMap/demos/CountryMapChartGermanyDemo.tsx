/**
 * CountryMapChart Germany Demo
 */
import React from 'react';
import { CountryMapChart } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { CountryMapChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { region: 'Bayern', value: 95 },
    { region: 'Berlin', value: 88 },
    { region: 'Hamburg', value: 72 },
    { region: 'Nordrhein-Westfalen', value: 85 },
];

<ChartProvider>
  <CountryMapChart
    country="germany"
    data={data}
    colorScale="blue"
    title="Germany Sales by State"
  />
</ChartProvider>`;

// German federal states (Bundesländer)
const data = [
    { region: 'Bayern', value: 95 },
    { region: 'Baden-Württemberg', value: 88 },
    { region: 'Nordrhein-Westfalen', value: 85 },
    { region: 'Hessen', value: 72 },
    { region: 'Niedersachsen', value: 65 },
    { region: 'Berlin', value: 80 },
    { region: 'Hamburg', value: 75 },
    { region: 'Sachsen', value: 55 },
    { region: 'Rheinland-Pfalz', value: 45 },
    { region: 'Schleswig-Holstein', value: 42 },
    { region: 'Brandenburg', value: 38 },
    { region: 'Thüringen', value: 35 },
    { region: 'Sachsen-Anhalt', value: 30 },
    { region: 'Mecklenburg-Vorpommern', value: 28 },
    { region: 'Bremen', value: 50 },
    { region: 'Saarland', value: 25 },
];

const CountryMapChartGermanyDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Germany States" description="German federal states (Bundesländer) with regional data.">
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <CountryMapChart
                country="germany"
                data={data}
                colorScale="blue"
                title="Germany Sales by State"
                width={450}
                height={500}
            />
        </div>
    </DemoCard>
);

export default CountryMapChartGermanyDemo;
