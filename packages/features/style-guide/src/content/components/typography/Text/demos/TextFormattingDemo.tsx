import React from 'react';
import { Text, Stack, Box } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `// Alignment
<Text align="left">Left</Text>
<Text align="center">Center</Text>
<Text align="right">Right</Text>

// Truncation
<Text truncate>Long text here...</Text>

// Line Clamp
<Text lineClamp={2}>Multi-line text...</Text>`;

export const TextFormattingDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Formatting" description="Utilities for alignment, truncation, and line clamping.">
            <Stack gap="xl">
                <Stack gap="m">
                    <Text weight="bold">Alignment</Text>
                    <Box style={{ background: 'var(--color-surface-neutral-subtle)', padding: 'var(--spacing-m)' }}>
                        <Text align="left">Left Aligned</Text>
                        <Text align="center">Center Aligned</Text>
                        <Text align="right">Right Aligned</Text>
                    </Box>
                </Stack>

                <Stack gap="m">
                    <Text weight="bold">Truncation (Single Line)</Text>
                    <Box style={{ width: '200px', background: 'var(--color-surface-neutral-subtle)', padding: 'var(--spacing-s)' }}>
                        <Text truncate>
                            This is a very long text that should be truncated with an ellipsis because it exceeds the container width.
                        </Text>
                    </Box>
                </Stack>

                <Stack gap="m">
                    <Text weight="bold">Line Clamp (Multi-line)</Text>
                    <Box style={{ width: '300px', background: 'var(--color-surface-neutral-subtle)', padding: 'var(--spacing-s)' }}>
                        <Text lineClamp={2}>
                            This is a long paragraph that will be clamped to two lines. It contains enough text to demonstrate the multi-line truncation behavior, which is very useful for cards, list items, and descriptions where vertical space is limited. Additional text here to ensure it overflows.
                        </Text>
                    </Box>
                </Stack>
            </Stack>
        </DemoCard>
    );
};
