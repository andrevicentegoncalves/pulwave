import React from 'react';
import { MobileHeader } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const basicUsage = `<MobileHeader
    toggleSidebar={() => toggleSidebar()}
    avatarUrl="https://i.pravatar.cc/40"
    onProfileClick={() => handleProfileClick()}
    onLogout={() => handleLogout()}
/>`;

/**
 * Basic MobileHeader demo
 */
export const MobileHeaderBasicDemo = () => {
    return (
        <DemoCard
            title="Basic MobileHeader"
            description="Mobile header with menu toggle and user actions. (Resize browser to mobile width to see actual styling)"
            sourceCode={basicUsage}
            showSourceToggle={true}
        >
            <div style={{
                position: 'relative',
                height: '60px',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--border-radius-m)',
                overflow: 'hidden'
            }}>
                <MobileHeader
                    toggleSidebar={() => alert('Toggle sidebar')}
                    avatarUrl="https://i.pravatar.cc/40"
                    onProfileClick={() => alert('Profile clicked')}
                    onLogout={() => alert('Logout clicked')}
                />
            </div>
        </DemoCard>
    );
};

export default MobileHeaderBasicDemo;
