import { Tabs, TabPanel, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Tabs orientation="vertical">
    <TabPanel label="Account">
        <Text>Account settings and preferences.</Text>
    </TabPanel>
    <TabPanel label="Password">
        <Text>Change your password and security settings.</Text>
    </TabPanel>
    <TabPanel label="Notifications">
        <Text>Manage email and push notifications.</Text>
    </TabPanel>
</Tabs>`;

const TabsVerticalDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Vertical Tabs" description="Tabs stacked vertically">
        <Tabs orientation="vertical" showBorder={false} className="h-48 border border-neutral-200 rounded-lg p-4">
            <TabPanel label="Account">
                <Text>Account settings and preferences.</Text>
            </TabPanel>
            <TabPanel label="Password">
                <Text>Change your password and security settings.</Text>
            </TabPanel>
            <TabPanel label="Notifications">
                <Text>Manage email and push notifications.</Text>
            </TabPanel>
        </Tabs>
    </DemoCard>
);

export default TabsVerticalDemo;
