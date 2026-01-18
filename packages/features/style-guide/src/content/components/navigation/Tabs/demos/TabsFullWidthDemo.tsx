import { Tabs, TabPanel, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Tabs fullWidth>
    <TabPanel label="Tab 1">
        <Text>Content for Tab 1</Text>
    </TabPanel>
    <TabPanel label="Tab 2">
        <Text>Content for Tab 2</Text>
    </TabPanel>
    <TabPanel label="Tab 3">
        <Text>Content for Tab 3</Text>
    </TabPanel>
</Tabs>`;

const TabsFullWidthDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Full Width Tabs" description="Tabs that fill the container width">
        <Tabs fullWidth showBorder={false}>
            <TabPanel label="Tab 1">
                <Text>Content for Tab 1</Text>
            </TabPanel>
            <TabPanel label="Tab 2">
                <Text>Content for Tab 2</Text>
            </TabPanel>
            <TabPanel label="Tab 3">
                <Text>Content for Tab 3</Text>
            </TabPanel>
        </Tabs>
    </DemoCard>
);

export default TabsFullWidthDemo;
