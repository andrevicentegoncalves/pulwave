import { Tabs, TabPanel, Text, Stack } from '@ui';
import { DemoCard, DemoGrid, DemoGridCard } from '@pulwave/features-style-guide';

const codeUsage = `// Slider Variant (Primary)
<Tabs variant="slider" colorScheme="primary" showBorder={false}>
    <TabPanel label="Tab 1">Content</TabPanel>
</Tabs>`;

const TabsSliderDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Tabs Slider" description="Tabs with a slider track background and sliding indicator." transparentPreview={true}>
        <DemoGrid>
            <DemoGridCard title="Primary">
                <Tabs variant="slider" colorScheme="primary" showBorder={false}>
                    <TabPanel label="Norway"><Text>Content for Norway</Text></TabPanel>
                    <TabPanel label="World"><Text>Content for World</Text></TabPanel>
                    <TabPanel label="Travel"><Text>Content for Travel</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Secondary">
                <Tabs variant="slider" colorScheme="secondary" showBorder={false}>
                    <TabPanel label="Norway"><Text>Content for Norway</Text></TabPanel>
                    <TabPanel label="World"><Text>Content for World</Text></TabPanel>
                    <TabPanel label="Travel"><Text>Content for Travel</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Tertiary">
                <Tabs variant="slider" colorScheme="tertiary" showBorder={false}>
                    <TabPanel label="Norway"><Text>Content for Norway</Text></TabPanel>
                    <TabPanel label="World"><Text>Content for World</Text></TabPanel>
                    <TabPanel label="Travel"><Text>Content for Travel</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Neutral">
                <Tabs variant="slider" colorScheme="neutral" showBorder={false}>
                    <TabPanel label="Norway"><Text>Content for Norway</Text></TabPanel>
                    <TabPanel label="World"><Text>Content for World</Text></TabPanel>
                    <TabPanel label="Travel"><Text>Content for Travel</Text></TabPanel>
                    <TabPanel label="Advice"><Text>Content for Advice</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
        </DemoGrid>
    </DemoCard>
);

export default TabsSliderDemo;
