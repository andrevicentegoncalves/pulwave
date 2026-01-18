import React from 'react';
import { MobileHeader } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const minimalUsage = `<MobileHeader
    toggleSidebar={() => toggleSidebar()}
/>`;

/**
 * MobileHeader without avatar
 */
export const MobileHeaderMinimalDemo = () => {
    return (
        <DemoCard
            title="Minimal MobileHeader"
            description="Header with only the menu toggle (no user actions)."
            sourceCode={minimalUsage}
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
                />
            </div>
        </DemoCard>
    );
};

export default MobileHeaderMinimalDemo;
