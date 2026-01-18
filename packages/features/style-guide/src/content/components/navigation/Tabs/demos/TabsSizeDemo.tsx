import { Tabs, TabPanel, Text } from '@ui';
import { DemoCard, DemoGrid, DemoGridCard } from '@pulwave/features-style-guide';
import { Plane, Briefcase, Map, Bookmark } from '@pulwave/ui';

const codeUsage = `// Sizes
<Tabs size="s" variant="icon">
    <TabPanel label="Small" icon={<Plane size={16} />}>Content</TabPanel>
</Tabs>
<Tabs size="m" variant="icon">
    <TabPanel label="Medium" icon={<Plane />}>Content</TabPanel>
</Tabs>
<Tabs size="l" variant="icon">
    <TabPanel label="Large" icon={<Plane />}>Content</TabPanel>
</Tabs>`;


const TabsSizeDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Tabs Sizes" description="Available sizes: s, m (default), l. Shown with Stacked (Icon) variant." transparentPreview={true}>
        <DemoGrid>
            <DemoGridCard title="Small (s)">
                <Tabs size="s" variant="icon" showBorder={false}>
                    <TabPanel label="Tab 1" icon={<Plane size={16} />}><Text>Content 1</Text></TabPanel>
                    <TabPanel label="Tab 2" icon={<Briefcase size={16} />}><Text>Content 2</Text></TabPanel>
                    <TabPanel label="Tab 3" icon={<Map size={16} />}><Text>Content 3</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Medium (m)">
                <Tabs size="m" variant="icon" showBorder={false}>
                    <TabPanel label="Tab 1" icon={<Plane size={24} />}><Text>Content 1</Text></TabPanel>
                    <TabPanel label="Tab 2" icon={<Briefcase size={24} />}><Text>Content 2</Text></TabPanel>
                    <TabPanel label="Tab 3" icon={<Map size={24} />}><Text>Content 3</Text></TabPanel>
                    <TabPanel label="Tab 4" icon={<Bookmark size={24} />}><Text>Content 4</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
            <DemoGridCard title="Large (l)">
                <Tabs size="l" variant="icon" showBorder={false}>
                    <TabPanel label="Tab 1" icon={<Plane size={24} />}><Text>Content 1</Text></TabPanel>
                    <TabPanel label="Tab 2" icon={<Briefcase size={24} />}><Text>Content 2</Text></TabPanel>
                    <TabPanel label="Tab 3" icon={<Map size={24} />}><Text>Content 3</Text></TabPanel>
                </Tabs>
            </DemoGridCard>
        </DemoGrid>
    </DemoCard>
);

export default TabsSizeDemo;
