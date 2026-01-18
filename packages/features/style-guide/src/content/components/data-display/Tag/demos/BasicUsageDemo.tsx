import React from 'react';
import { Tag, Stack } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';
import demoCode from './BasicUsageDemo.tsx?raw';

const TagBasicDemo = () => {
    return (
        <DemoCard sourceCode={demoCode} showSourceToggle={true}
            title="Tag Variants"
            description="Tags capture categories or metadata. They can be removed but are typically static."
        >
            <Stack spacing="4">
                <Stack direction="row" spacing="2">
                    <Tag>Neutral</Tag>
                    <Tag color="primary">Primary</Tag>
                    <Tag color="success">Success</Tag>
                    <Tag color="warning">Warning</Tag>
                    <Tag color="error">Error</Tag>
                </Stack>
                <Stack direction="row" spacing="2">
                    <Tag variant="subtle" color="primary">Soft Primary</Tag>
                    <Tag variant="outline" color="success">Outline Success</Tag>
                    <Tag removable onRemove={() => alert('Removed')}>Removable</Tag>
                </Stack>
            </Stack>
        </DemoCard>
    );
};

export default TagBasicDemo;

