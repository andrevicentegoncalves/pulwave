import { Tabs, TabPanel, Text, Stack } from '@ui';
import { DemoCard, DemoGrid, DemoGridCard } from '@pulwave/features-style-guide';
import { Plane, Briefcase, Map, Bookmark } from '@pulwave/ui';

const codeUsage = `// Basic Tabs (Stacked) - Primary
<Tabs variant="icon" colorScheme="primary" showBorder={false}>
    <TabPanel label="Flights" icon={<Plane />}>Content</TabPanel>
</Tabs>`;

const TabsBasicStackedDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Basic Stacked Tabs" description="Tabs with stacked icon and label, without a container border." transparentPreview={true}>
        <DemoGrid>
            <DemoGridCard title="Primary">
                <Tabs variant="icon" colorScheme="primary" showBorder={false}>
                    <TabPanel label="Flights" icon={<Plane size={24} />}><Text>Content</Text></TabPanel>
                    <TabPanel label="Trips" icon={<Briefcase size={24} />}><Text>Content</Text></TabPanel>
                    <TabPanel label="Explore" icon={<Map size={24} />}><Text>Content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Secondary">
                <Tabs variant="icon" colorScheme="secondary" showBorder={false}>
                    <TabPanel label="Flights" icon={<Plane size={24} />}><Text>Content</Text></TabPanel>
                    <TabPanel label="Trips" icon={<Briefcase size={24} />}><Text>Content</Text></TabPanel>
                    <TabPanel label="Explore" icon={<Map size={24} />}><Text>Content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Tertiary">
                <Tabs variant="icon" colorScheme="tertiary" showBorder={false}>
                    <TabPanel label="Flights" icon={<Plane size={24} />}><Text>Content</Text></TabPanel>
                    <TabPanel label="Trips" icon={<Briefcase size={24} />}><Text>Content</Text></TabPanel>
                    <TabPanel label="Explore" icon={<Map size={24} />}><Text>Content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Neutral">
                <Tabs variant="icon" colorScheme="neutral" showBorder={false}>
                    <TabPanel label="Flights" icon={<Plane size={24} />}><Text>Content</Text></TabPanel>
                    <TabPanel label="Trips" icon={<Briefcase size={24} />}><Text>Content</Text></TabPanel>
                    <TabPanel label="Explore" icon={<Map size={24} />}><Text>Content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
        </DemoGrid>
    </DemoCard>
);

export default TabsBasicStackedDemo;
