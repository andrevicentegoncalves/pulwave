import React from 'react';
import { Text, Stack } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

export const TextBasicDemo = () => {
    return (
        <DemoCard title="Typography Scale" description="The Text component enforces the design system typography scale.">
            <Stack gap="4">
                <Text category="display" size="l">Display Large</Text>
                <Text category="display" size="m">Display Medium</Text>
                <Text category="display" size="s">Display Small</Text>
                <hr />
                <Text category="title" size="l">Title Large</Text>
                <Text category="title" size="m">Title Medium</Text>
                <Text category="title" size="s">Title Small</Text>
                <hr />
                <Text category="body" size="l">Body Large - The quick brown fox jumps over the lazy dog.</Text>
                <Text category="body" size="m">Body Medium - The quick brown fox jumps over the lazy dog.</Text>
                <Text category="body" size="s">Body Small - The quick brown fox jumps over the lazy dog.</Text>
                <hr />
                <Text category="label" size="l">Label Large</Text>
                <Text category="label" size="m">Label Medium</Text>
                <Text category="label" size="s">Label Small</Text>
            </Stack>
        </DemoCard>
    );
};
