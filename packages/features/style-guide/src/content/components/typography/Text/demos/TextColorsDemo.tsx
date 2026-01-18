import React from 'react';
import { Text, Stack } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

export const TextColorsDemo = () => {
    return (
        <DemoCard title="Text Colors" description="Semantic text colors for various contexts.">
            <Stack gap="2">
                <Text color="default">Default Text</Text>
                <Text color="muted">Muted Text</Text>
                <Text color="muted">Subtle Text (mapped to muted)</Text>
                <Text color="primary">Primary Color</Text>
                <Text color="success">Success Color</Text>
                <Text color="warning">Warning Color</Text>
                <Text color="error">Error Color</Text>
                <Text color="info">Info Color</Text>
                <div style={{ background: '#000', padding: '1rem', borderRadius: '4px' }}>
                    <Text color="inverted">Inverse Text (on dark)</Text>
                </div>
            </Stack>
        </DemoCard>
    );
};
