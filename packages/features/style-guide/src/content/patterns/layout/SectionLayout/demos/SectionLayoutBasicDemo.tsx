import { Box, Text } from '@pulwave/ui';
import { SectionLayout } from '@pulwave/widgets';
import { Home, Settings } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<SectionLayout
    sidebar={<Sidebar />}
    breadcrumbs={<Text style={{ padding: '0 1rem' }}>Home / Dashboard</Text>}
>
    <Box padding={6}>
        <Text category="heading" size="s">Main Content Area</Text>
        <Text>This area scrolls independently of the sidebar.</Text>
    </Box>
</SectionLayout>`;

// Mock Sidebar for demo
const MockSidebar = ({ isExpanded }: any) => (
    <div style={{
        padding: '1rem',
        height: '100%',
        background: 'var(--color-surface-default)',
        borderRight: '1px solid var(--color-border-subtle)',
        width: isExpanded ? '240px' : '60px',
        transition: 'width 0.3s ease'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Home size={20} aria-hidden="true" />
            {isExpanded && <Text>Home</Text>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Settings size={20} aria-hidden="true" />
            {isExpanded && <Text>Settings</Text>}
        </div>
    </div>
);

const SectionLayoutBasicDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Section Layout Structure"
            description="Example of the section layout with a mock sidebar."
        >
            <div style={{ height: '400px', border: '1px solid var(--color-border-neutral-subtle)', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                <SectionLayout
                    sidebar={<MockSidebar />}
                    breadcrumbs={<Text style={{ padding: '0 1rem' }}>Home / Dashboard</Text>}
                >
                    <Box padding={4}>
                        <Text category="heading" size="s">Main Content Area</Text>
                        <Text>This area scrolls independently of the sidebar.</Text>
                    </Box>
                </SectionLayout>
            </div>
        </DemoCard>
    );
};

export default SectionLayoutBasicDemo;
