import React from 'react';
import { Text, Stack, Card } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Text category="headline">Headline</Text>
<Text category="title">Title</Text>
<Text category="body">Body</Text>
<Text category="action">Action</Text>
<Text category="label">Label</Text>
<Text category="eyebrow">Eyebrow</Text>
<Text category="price">$1,299</Text>`;

export const TextCategoriesDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Categories" description="Semantic categories map to the type scale.">
            <Stack gap="l" align="start">
                <Stack gap="xs">
                    <Text category="heading" size="l">Headline Text</Text>
                    <Text size="s" color="muted">category="headline"</Text>
                </Stack>
                <Stack gap="xs">
                    <Text category="title" size="l">Title Text</Text>
                    <Text size="s" color="muted">category="title"</Text>
                </Stack>
                <Stack gap="xs">
                    <Text category="body" size="l">Body Text (Default)</Text>
                    <Text size="s" color="muted">category="body"</Text>
                </Stack>
                <Stack gap="xs">
                    <Text category="label" size="l">Action / Button Text</Text>
                    <Text size="s" color="muted">category="label" (action mapping)</Text>
                </Stack>
                <Stack gap="xs">
                    <Text category="label" size="l">Label Text</Text>
                    <Text size="s" color="muted">category="label"</Text>
                </Stack>
                <Stack gap="xs">
                    <Text category="label" size="l">Eyebrow Text</Text>
                    <Text size="s" color="muted">category="label" (eyebrow mapping)</Text>
                </Stack>
                <Stack gap="xs">
                    <Text category="label" size="l">$1,299.00</Text>
                    <Text size="s" color="muted">category="label" (price mapping)</Text>
                </Stack>
            </Stack>
        </DemoCard>
    );
};
