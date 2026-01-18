import React from 'react';
import { SkipLink, Button } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

export const SkipLinkBasicDemo = () => {
    return (
        <DemoCard title="Skip Link" description="Hidden link that becomes visible on focus, allowing users to skip navigation.">
            <div style={{ position: 'relative', height: '100px', border: '1px dashed var(--color-border-default)', padding: '1rem' }}>
                <p>Click inside here and press Tab to see the Skip Link appear.</p>
                <SkipLink targetId="demo-content" style={{ position: 'absolute', top: '10px', left: '10px' }} />

                <div style={{ marginTop: '40px' }}>
                    <Button>Focusable Element Before</Button>
                    <div id="demo-content" tabIndex={-1} style={{ marginTop: '1rem' }}>
                        Main Content Target
                    </div>
                </div>
            </div>
        </DemoCard>
    );
};

