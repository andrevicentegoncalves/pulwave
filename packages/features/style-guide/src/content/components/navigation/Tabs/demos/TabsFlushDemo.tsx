import { Tabs, TabPanel, Text, Stack } from '@ui';
import { DemoCard, DemoGrid, DemoGridCard } from '@pulwave/features-style-guide';

const codeUsage = `// Flush Variant (Full Width Soft Slider)
<Tabs variant="slider-soft-full" colorScheme="primary" showBorder={false}>
    <TabPanel label="Tab 1">Content</TabPanel>
</Tabs>`;

const TabsFlushDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Tabs Flush" description="Full-width soft slider variation." transparentPreview={true}>
        <DemoGrid>
            <DemoGridCard title="Primary">
                <Tabs variant="slider-soft-full" colorScheme="primary" showBorder={false}>
                    <TabPanel label="Overview"><Text>Overview content</Text></TabPanel>
                    <TabPanel label="Profile"><Text>Profile content</Text></TabPanel>
                    <TabPanel label="Settings"><Text>Settings content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Secondary">
                <Tabs variant="slider-soft-full" colorScheme="secondary" showBorder={false}>
                    <TabPanel label="Overview"><Text>Overview content</Text></TabPanel>
                    <TabPanel label="Profile"><Text>Profile content</Text></TabPanel>
                    <TabPanel label="Settings"><Text>Settings content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Tertiary">
                <Tabs variant="slider-soft-full" colorScheme="tertiary" showBorder={false}>
                    <TabPanel label="Overview"><Text>Overview content</Text></TabPanel>
                    <TabPanel label="Profile"><Text>Profile content</Text></TabPanel>
                    <TabPanel label="Settings"><Text>Settings content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Neutral">
                <Tabs variant="slider-soft-full" colorScheme="neutral" showBorder={false}>
                    <TabPanel label="Overview"><Text>Overview content</Text></TabPanel>
                    <TabPanel label="Profile"><Text>Profile content</Text></TabPanel>
                    <TabPanel label="Settings"><Text>Settings content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
        </DemoGrid>
    </DemoCard>
);

export default TabsFlushDemo;
