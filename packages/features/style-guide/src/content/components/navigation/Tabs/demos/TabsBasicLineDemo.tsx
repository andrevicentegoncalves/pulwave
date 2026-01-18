import { Tabs, TabPanel, Text, Stack } from '@ui';
import { DemoCard, DemoGrid, DemoGridCard } from '@pulwave/features-style-guide';

const codeUsage = `// Basic Tabs (Line) - Primary
<Tabs colorScheme="primary" showBorder={false}>
    <TabPanel label="Tab 1">Content</TabPanel>
</Tabs>`;

const TabsBasicLineDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Basic Line Tabs" description="Standard line tabs without a container border." transparentPreview={true}>
        <DemoGrid>
            <DemoGridCard title="Primary">
                <Tabs colorScheme="primary" showBorder={false}>
                    <TabPanel label="Tab 1"><Text>Content 1</Text></TabPanel>
                    <TabPanel label="Tab 2"><Text>Content 2</Text></TabPanel>
                    <TabPanel label="Tab 3"><Text>Content 3</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Secondary">
                <Tabs colorScheme="secondary" showBorder={false}>
                    <TabPanel label="Tab 1"><Text>Content 1</Text></TabPanel>
                    <TabPanel label="Tab 2"><Text>Content 2</Text></TabPanel>
                    <TabPanel label="Tab 3"><Text>Content 3</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Tertiary">
                <Tabs colorScheme="tertiary" showBorder={false}>
                    <TabPanel label="Tab 1"><Text>Content 1</Text></TabPanel>
                    <TabPanel label="Tab 2"><Text>Content 2</Text></TabPanel>
                    <TabPanel label="Tab 3"><Text>Content 3</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Neutral">
                <Tabs colorScheme="neutral" showBorder={false}>
                    <TabPanel label="Tab 1"><Text>Content 1</Text></TabPanel>
                    <TabPanel label="Tab 2"><Text>Content 2</Text></TabPanel>
                    <TabPanel label="Tab 3"><Text>Content 3</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
        </DemoGrid>
    </DemoCard>
);

export default TabsBasicLineDemo;
