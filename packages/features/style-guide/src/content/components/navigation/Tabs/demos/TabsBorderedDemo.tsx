/**
 * Tabs Bordered Demo
 */
import { Tabs, TabPanel, Text } from '@ui';
import { DemoCard, DemoGrid, DemoGridCard } from '@pulwave/features-style-guide';
import { Plane, Briefcase, Map, Bookmark } from '@pulwave/ui';

const codeUsage = `// Basic Tabs (Line) - Bordered
<Tabs showBorder={true} colorScheme="primary">
    <TabPanel label="Tab 1">Content</TabPanel>
</Tabs>

// Stacked (Icon) - Bordered
<Tabs variant="icon" showBorder={true} colorScheme="neutral">
    <TabPanel label="Flights" icon={<Plane />}>Content</TabPanel>
</Tabs>`;

const TabsBorderedDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Basic Tabs with Border" description="Tabs with a visible bottom border line for hierarchy." transparentPreview={true}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            <div>
                <Text variant="small" className="mb-4 font-bold">Line (Default)</Text>
                <DemoGrid>
                    <DemoGridCard title="Primary">
                        <Tabs showBorder={true} colorScheme="primary">
                            <TabPanel label="Tab 1"><Text>Content 1</Text></TabPanel>
                            <TabPanel label="Tab 2"><Text>Content 2</Text></TabPanel>
                            <TabPanel label="Tab 3"><Text>Content 3</Text></TabPanel>
                        </Tabs>
                    </DemoGridCard>
                    <DemoGridCard title="Secondary">
                        <Tabs showBorder={true} colorScheme="secondary">
                            <TabPanel label="Tab 1"><Text>Content 1</Text></TabPanel>
                            <TabPanel label="Tab 2"><Text>Content 2</Text></TabPanel>
                            <TabPanel label="Tab 3"><Text>Content 3</Text></TabPanel>
                        </Tabs>
                    </DemoGridCard>
                    <DemoGridCard title="Tertiary">
                        <Tabs showBorder={true} colorScheme="tertiary">
                            <TabPanel label="Tab 1"><Text>Content 1</Text></TabPanel>
                            <TabPanel label="Tab 2"><Text>Content 2</Text></TabPanel>
                            <TabPanel label="Tab 3"><Text>Content 3</Text></TabPanel>
                        </Tabs>
                    </DemoGridCard>
                    <DemoGridCard title="Neutral">
                        <Tabs showBorder={true} colorScheme="neutral">
                            <TabPanel label="Tab 1"><Text>Content 1</Text></TabPanel>
                            <TabPanel label="Tab 2"><Text>Content 2</Text></TabPanel>
                            <TabPanel label="Tab 3"><Text>Content 3</Text></TabPanel>
                        </Tabs>
                    </DemoGridCard>
                </DemoGrid>
            </div>

            <div>
                <Text variant="small" className="mb-4 font-bold">Stacked (Icon)</Text>
                <DemoGrid>
                    <DemoGridCard title="Primary">
                        <Tabs variant="icon" showBorder={true} colorScheme="primary">
                            <TabPanel label="Flights" icon={<Plane size={24} />}><Text>Content</Text></TabPanel>
                            <TabPanel label="Trips" icon={<Briefcase size={24} />}><Text>Content</Text></TabPanel>
                            <TabPanel label="Explore" icon={<Map size={24} />}><Text>Content</Text></TabPanel>
                        </Tabs>
                    </DemoGridCard>
                    <DemoGridCard title="Secondary">
                        <Tabs variant="icon" showBorder={true} colorScheme="secondary">
                            <TabPanel label="Flights" icon={<Plane size={24} />}><Text>Content</Text></TabPanel>
                            <TabPanel label="Trips" icon={<Briefcase size={24} />}><Text>Content</Text></TabPanel>
                            <TabPanel label="Explore" icon={<Map size={24} />}><Text>Content</Text></TabPanel>
                        </Tabs>
                    </DemoGridCard>
                    <DemoGridCard title="Tertiary">
                        <Tabs variant="icon" showBorder={true} colorScheme="tertiary">
                            <TabPanel label="Flights" icon={<Plane size={24} />}><Text>Content</Text></TabPanel>
                            <TabPanel label="Trips" icon={<Briefcase size={24} />}><Text>Content</Text></TabPanel>
                            <TabPanel label="Explore" icon={<Map size={24} />}><Text>Content</Text></TabPanel>
                        </Tabs>
                    </DemoGridCard>
                    <DemoGridCard title="Neutral">
                        <Tabs variant="icon" showBorder={true} colorScheme="neutral">
                            <TabPanel label="Flights" icon={<Plane size={24} />}><Text>Content</Text></TabPanel>
                            <TabPanel label="Trips" icon={<Briefcase size={24} />}><Text>Content</Text></TabPanel>
                        </Tabs>
                    </DemoGridCard>
                </DemoGrid>
            </div>
        </div>
    </DemoCard>
);

export default TabsBorderedDemo;
