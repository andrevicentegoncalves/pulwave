import React, { useState } from 'react';
import { CountryMapChart, Tabs, TabPanel, SearchInput } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';
import { Globe } from '@ui';

const PORTUGAL_DATA = [
    { region: 'Lisboa', value: 95 }, { region: 'Porto', value: 82 }, { region: 'Braga', value: 68 },
    { region: 'Faro', value: 75 }, { region: 'Setúbal', value: 72 }, { region: 'Aveiro', value: 55 },
    { region: 'Leiria', value: 48 }, { region: 'Coimbra', value: 52 }, { region: 'Viseu', value: 40 },
    { region: 'Santarém', value: 38 }, { region: 'Évora', value: 35 }, { region: 'Castelo Branco', value: 28 },
    { region: 'Guarda', value: 22 }, { region: 'Viana do Castelo', value: 45 }, { region: 'Vila Real', value: 32 },
    { region: 'Bragança', value: 25 }, { region: 'Beja', value: 20 }, { region: 'Portalegre', value: 18 },
    { region: 'Madeira', value: 60 }, { region: 'Açores', value: 45 }
];

const GERMANY_DATA = [
    { region: 'Bayern', value: 95 }, { region: 'Baden-Württemberg', value: 88 }, { region: 'Nordrhein-Westfalen', value: 85 },
    { region: 'Hessen', value: 72 }, { region: 'Niedersachsen', value: 65 }, { region: 'Berlin', value: 80 },
    { region: 'Hamburg', value: 75 }, { region: 'Sachsen', value: 55 }, { region: 'Rheinland-Pfalz', value: 45 },
    { region: 'Schleswig-Holstein', value: 42 }, { region: 'Brandenburg', value: 38 }, { region: 'Thüringen', value: 35 },
    { region: 'Sachsen-Anhalt', value: 30 }, { region: 'Mecklenburg-Vorpommern', value: 28 }, { region: 'Bremen', value: 50 },
    { region: 'Saarland', value: 25 },
];

const USA_DATA = [
    { region: 'California', value: 98 }, { region: 'Texas', value: 92 }, { region: 'New York', value: 88 },
    { region: 'Florida', value: 85 }, { region: 'Illinois', value: 78 }, { region: 'Pennsylvania', value: 75 },
    { region: 'Ohio', value: 70 }, { region: 'Georgia', value: 68 }, { region: 'North Carolina', value: 65 },
    { region: 'Michigan', value: 62 }, { region: 'New Jersey', value: 58 }, { region: 'Virginia', value: 55 },
    { region: 'Washington', value: 52 }, { region: 'Arizona', value: 50 }, { region: 'Massachusetts', value: 48 },
];

type Region = 'Europe' | 'North America' | 'South America' | 'Asia';

interface MapDemoConfig {
    id: string;
    mapType: string;
    title: string;
    region: Region;
    data: any[];
    colorScheme: any;
}

const MAP_DEMOS: MapDemoConfig[] = [
    { id: 'portugal', mapType: 'portugal', title: 'Portugal', region: 'Europe', data: PORTUGAL_DATA, colorScheme: 'orange' },
    { id: 'germany', mapType: 'germany', title: 'Germany', region: 'Europe', data: GERMANY_DATA, colorScheme: 'blue' },
    { id: 'usa', mapType: 'usa', title: 'United States', region: 'North America', data: USA_DATA, colorScheme: 'green' },
];

const REGIONS: Region[] = ['Europe', 'North America', 'South America', 'Asia'];

const CountryMapChartGalleryDemo = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: 300 }}>
                    <SearchInput
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Find country…"
                        fullWidth
                    />
                </div>
            </div>

            <Tabs>
                {REGIONS.map((region) => {
                    const filteredMaps = MAP_DEMOS.filter(demo =>
                        demo.region === region &&
                        demo.title.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    return (
                        <TabPanel key={region} label={region}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                                gap: '1.5rem',
                                marginTop: '1.5rem'
                            }}>
                                {filteredMaps.length > 0 ? (
                                    filteredMaps.map(demo => (
                                        <DemoCard
                                            key={demo.id}
                                            title={demo.title}
                                            description={`Interactive map of ${demo.title}`}
                                            sourceCode={`<CountryMapChart\n  country="${demo.mapType}"\n  data={data}\n  colorScale="${demo.colorScheme}"\n/>`}
                                            showSourceToggle={false}
                                        >
                                            <div style={{
                                                width: '100%',
                                                height: 400,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                overflow: 'hidden'
                                            }}>
                                                <CountryMapChart
                                                    country={demo.mapType}
                                                    data={demo.data}
                                                    colorScale={demo.colorScheme}
                                                    title={demo.title}
                                                    width="100%"
                                                    height="100%"
                                                />
                                            </div>
                                        </DemoCard>
                                    ))
                                ) : (
                                    <div style={{
                                        gridColumn: '1 / -1',
                                        textAlign: 'center',
                                        padding: '3rem',
                                        color: 'var(--color-neutral-text-weak)',
                                        background: 'var(--color-neutral-subtle)',
                                        borderRadius: 'var(--border-radius-m)'
                                    }}>
                                        <Globe size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                        <p>No maps found for "{searchQuery}" in {region}</p>
                                    </div>
                                )}
                            </div>
                        </TabPanel>
                    );
                })}
            </Tabs>
        </div>
    );
};

export default CountryMapChartGalleryDemo;
