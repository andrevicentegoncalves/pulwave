import React from 'react';
import { Text, Stack, Grid } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Text size="xs">XS Text</Text>
<Text size="s">Small Text</Text>
<Text size="m">Medium Text</Text>
<Text size="l">Large Text</Text>
<Text size="xl">Extra Large Text</Text>
<Text size="2xl">2XL Text</Text>
<Text size="3xl">3XL Text</Text>`;

export const TextSizesDemo = () => {
    const sizes = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl'] as const;

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Sizes" description="Each category supports a range of sizes.">
            <Stack gap="xl">
                {sizes.map((size) => (
                    <Grid key={size} columns="100px 1fr" gap={4} align="center">
                        <Text color="muted" size="s">{size}</Text>
                        <Text category="body" size={size}>
                            The quick brown fox jumps over the lazy dog.
                        </Text>
                    </Grid>
                ))}
            </Stack>
        </DemoCard>
    );
};
