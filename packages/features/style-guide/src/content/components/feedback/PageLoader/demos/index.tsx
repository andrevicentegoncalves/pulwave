/**
 * PageLoader Demos
 */
import React from 'react';
import { PageLoader } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

/**
 * Basic PageLoader demo
 */
export const PageLoaderBasicDemo = () => {
    return (
        <DemoCard
            title="Container PageLoader"
            description="PageLoader within a contained area (fullScreen=false)."
        >
            {() => (
                <div style={{
                    height: '200px',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--border-radius-m)',
                    overflow: 'hidden'
                }}>
                    <PageLoader fullScreen={false} message="Loading content…" />
                </div>
            )}
        </DemoCard>
    );
};

/**
 * PageLoader with custom message
 */
export const PageLoaderMessagesDemo = () => {
    return (
        <DemoCard
            title="Custom Messages"
            description="Different loading messages for various contexts."
        >
            {() => (
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{
                        flex: 1,
                        height: '150px',
                        border: '1px solid var(--color-border-default)',
                        borderRadius: 'var(--border-radius-m)',
                        overflow: 'hidden'
                    }}>
                        <PageLoader fullScreen={false} message="Preparing dashboard…" />
                    </div>
                    <div style={{
                        flex: 1,
                        height: '150px',
                        border: '1px solid var(--color-border-default)',
                        borderRadius: 'var(--border-radius-m)',
                        overflow: 'hidden'
                    }}>
                        <PageLoader fullScreen={false} message="Verifying credentials…" />
                    </div>
                </div>
            )}
        </DemoCard>
    );
};
