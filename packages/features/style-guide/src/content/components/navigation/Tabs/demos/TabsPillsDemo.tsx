import { Tabs, TabPanel, Text, Stack } from '@ui';
import { DemoCard, DemoGrid, DemoGridCard } from '@pulwave/features-style-guide';

const codeUsage = `// Pills Variant (Primary)
<Tabs variant="pills" colorScheme="primary" showBorder={false}>
    <TabPanel label="Tab 1">Content</TabPanel>
</Tabs>

// Pills Variant (Neutral)
<Tabs variant="pills" colorScheme="neutral" showBorder={false}>
    <TabPanel label="Tab 1">Content</TabPanel>
</Tabs>`;

const TabsPillsDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Tabs Pills" description="Tabs styled as individual pill buttons." transparentPreview={true}>
        <DemoGrid>
            <DemoGridCard title="Primary">
                <Tabs variant="pills" colorScheme="primary" showBorder={false}>
                    <TabPanel label="All"><Text>All content</Text></TabPanel>
                    <TabPanel label="Active"><Text>Active content</Text></TabPanel>
                    <TabPanel label="Pending"><Text>Pending content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Secondary">
                <Tabs variant="pills" colorScheme="secondary" showBorder={false}>
                    <TabPanel label="All"><Text>All content</Text></TabPanel>
                    <TabPanel label="Active"><Text>Active content</Text></TabPanel>
                    <TabPanel label="Pending"><Text>Pending content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Tertiary">
                <Tabs variant="pills" colorScheme="tertiary" showBorder={false}>
                    <TabPanel label="All"><Text>All content</Text></TabPanel>
                    <TabPanel label="Active"><Text>Active content</Text></TabPanel>
                    <TabPanel label="Pending"><Text>Pending content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Neutral">
                <Tabs variant="pills" colorScheme="neutral" showBorder={false}>
                    <TabPanel label="All"><Text>All content</Text></TabPanel>
                    <TabPanel label="Active"><Text>Active content</Text></TabPanel>
                    <TabPanel label="Pending"><Text>Pending content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
        </DemoGrid>
    </DemoCard>
);

export default TabsPillsDemo;
