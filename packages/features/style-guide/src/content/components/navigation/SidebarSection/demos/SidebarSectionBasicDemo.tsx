import React, { useState } from 'react';
import { SidebarSection } from '@pulwave/ui';
import { Home, Users, Settings } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

export const SidebarSectionBasicDemo = () => {
    const [active, setActive] = useState('home');

    return (
        <DemoCard title="Sidebar Section" description="A navigation section for the sidebar.">
            <div style={{ maxWidth: '300px' }}>
                <SidebarSection
                    title="Main Menu"
                    activeKey={active}
                    onSelect={(item) => setActive(item.key)}
                    items={[
                        { key: 'home', label: 'Dashboard', icon: Home },
                        { key: 'users', label: 'Users', icon: Users },
                        { key: 'settings', label: 'Settings', icon: Settings },
                    ]}
                />
            </div>
        </DemoCard>
    );
};
