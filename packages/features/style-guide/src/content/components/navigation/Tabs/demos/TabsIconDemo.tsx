import { Tabs, TabPanel, Text, Icon } from '@ui';
import { User, Settings, Lock } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Tabs>
    <TabPanel label="Profile" icon={<Icon icon={User} size="s" />}>
        <Text>Profile Settings</Text>
    </TabPanel>
    <TabPanel label="Security" icon={<Icon icon={Lock} size="s" />}>
        <Text>Security Settings</Text>
    </TabPanel>
    <TabPanel label="Preferences" icon={<Icon icon={Settings} size="s" />}>
        <Text>App Preferences</Text>
    </TabPanel>
</Tabs>`;

const TabsIconDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Tabs with Icons" description="Tabs can include icons">
        <Tabs>
            <TabPanel label="Profile" icon={<Icon icon={User} size="s" />}>
                <Text>Profile Settings</Text>
            </TabPanel>
            <TabPanel label="Security" icon={<Icon icon={Lock} size="s" />}>
                <Text>Security Settings</Text>
            </TabPanel>
            <TabPanel label="Preferences" icon={<Icon icon={Settings} size="s" />}>
                <Text>App Preferences</Text>
            </TabPanel>
        </Tabs>
    </DemoCard>
);

export default TabsIconDemo;
