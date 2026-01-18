import { useState } from 'react';
import { SidebarToggle, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<SidebarToggle
    isExpanded={isExpanded}
    toggleSidebar={handleToggle}
/>`;

const SidebarToggleBasicDemo = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Sidebar Toggle" description="Toggle sidebar expansion">
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #eee' }}>
                <SidebarToggle variant="neutral" isExpanded={isExpanded} toggleSidebar={() => setIsExpanded(!isExpanded)} />
                <Text>Sidebar is <Text as="span" weight="bold">{isExpanded ? 'Expanded' : 'Collapsed'}</Text></Text>
            </div>
        </DemoCard>
    );
};

export default SidebarToggleBasicDemo;
