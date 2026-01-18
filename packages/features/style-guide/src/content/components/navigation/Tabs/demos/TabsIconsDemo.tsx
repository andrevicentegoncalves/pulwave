import { Tabs, TabPanel, Text, Stack } from '@ui';
import { DemoCard, DemoGrid, DemoGridCard } from '@pulwave/features-style-guide';
import { Home, Settings, User, Bell } from '@pulwave/ui';

const codeUsage = `// Variants with Icons
<Tabs variant="pills" showBorder={false}>
    <TabPanel label="Home" icon={<Home />}>Content</TabPanel>
</Tabs>`;

const TabsIconsDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Tabs Variants with Icons" description="All variants can optionally include icons." transparentPreview={true}>
        <DemoGrid>
            <DemoGridCard title="Pills with Icons">
                <Tabs variant="pills" showBorder={false}>
                    <TabPanel label="Home" icon={<Home size={18} />}><Text>Home content</Text></TabPanel>
                    <TabPanel label="Profile" icon={<User size={18} />}><Text>Profile content</Text></TabPanel>
                    <TabPanel label="Settings" icon={<Settings size={18} />}><Text>Settings content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>

            <DemoGridCard title="Slider with Icons">
                <Tabs variant="slider" showBorder={false}>
                    <TabPanel label="Home" icon={<Home size={18} />}><Text>Home content</Text></TabPanel>
                    <TabPanel label="Profile" icon={<User size={18} />}><Text>Profile content</Text></TabPanel>
                    <TabPanel label="Settings" icon={<Settings size={18} />}><Text>Settings content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>

            <DemoGridCard title="Slider Soft with Icons">
                <Tabs variant="slider-soft" showBorder={false}>
                    <TabPanel label="Home" icon={<Home size={18} />}><Text>Home content</Text></TabPanel>
                    <TabPanel label="Profile" icon={<User size={18} />}><Text>Profile content</Text></TabPanel>
                    <TabPanel label="Settings" icon={<Settings size={18} />}><Text>Settings content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>

            <DemoGridCard title="Flush with Icons">
                <Tabs variant="slider-soft-full" showBorder={false}>
                    <TabPanel label="Home" icon={<Home size={18} />}><Text>Home content</Text></TabPanel>
                    <TabPanel label="Profile" icon={<User size={18} />}><Text>Profile content</Text></TabPanel>
                    <TabPanel label="Settings" icon={<Settings size={18} />}><Text>Settings content</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
        </DemoGrid>
    </DemoCard>
);

export default TabsIconsDemo;
