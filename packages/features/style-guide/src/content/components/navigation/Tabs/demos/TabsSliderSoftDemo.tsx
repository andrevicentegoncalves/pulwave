import { Tabs, TabPanel, Text, Stack } from '@ui';
import { DemoCard, DemoGrid, DemoGridCard } from '@pulwave/features-style-guide';

const codeUsage = `// Slider Soft Variant (Primary)
<Tabs variant="slider-soft" colorScheme="primary" showBorder={false}>
    <TabPanel label="Tab 1">Content</TabPanel>
</Tabs>`;

const TabsSliderSoftDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Tabs Slider Soft" description="Soft slider style (formerly Contained) with subtle active state." transparentPreview={true}>
        <DemoGrid>
            <DemoGridCard title="Primary">
                <Tabs variant="slider-soft" colorScheme="primary" showBorder={false}>
                    <TabPanel label="Overview"><Text>Overview content</Text></TabPanel>
                    <TabPanel label="Profile"><Text>Profile content</Text></TabPanel>
                    <TabPanel label="Settings"><Text>Settings content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Secondary">
                <Tabs variant="slider-soft" colorScheme="secondary" showBorder={false}>
                    <TabPanel label="Overview"><Text>Overview content</Text></TabPanel>
                    <TabPanel label="Profile"><Text>Profile content</Text></TabPanel>
                    <TabPanel label="Settings"><Text>Settings content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Tertiary">
                <Tabs variant="slider-soft" colorScheme="tertiary" showBorder={false}>
                    <TabPanel label="Overview"><Text>Overview content</Text></TabPanel>
                    <TabPanel label="Profile"><Text>Profile content</Text></TabPanel>
                    <TabPanel label="Settings"><Text>Settings content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Neutral">
                <Tabs variant="slider-soft" colorScheme="neutral" showBorder={false}>
                    <TabPanel label="Overview"><Text>Overview content</Text></TabPanel>
                    <TabPanel label="Profile"><Text>Profile content</Text></TabPanel>
                    <TabPanel label="Settings"><Text>Settings content</Text></TabPanel>
                    <TabPanel label="Activity"><Text>Activity content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
        </DemoGrid>
    </DemoCard>
);

export default TabsSliderSoftDemo;
