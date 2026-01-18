import React from 'react';
import { LiveRegion, useAnnounceContext, Button, Stack } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const AnnounceTrigger = () => {
    const { announce } = useAnnounceContext();
    return (
        <Stack gap="4" direction="row">
            <Button onClick={() => announce("Operation completed successfully", "polite")}>
                Trigger Polite Message
            </Button>
            <Button variant="outlined" onClick={() => announce("Error occurred!", "assertive")}>
                Trigger Assertive Message
            </Button>
        </Stack>
    );
};

export const LiveRegionBasicDemo = () => {
    return (
        <DemoCard title="Live Region" description="Announce dynamic content changes to screen readers.">
            {/* LiveRegion is usually at the root, but here for demo */}
            <LiveRegion>
                <div style={{ padding: '1rem', border: '1px dashed var(--color-border-default)' }}>
                    <p style={{ marginBottom: '1rem' }}>Click buttons to trigger announcements (inspect DOM or use screen reader to verify)</p>
                    <AnnounceTrigger />
                </div>
            </LiveRegion>
        </DemoCard>
    );
};


