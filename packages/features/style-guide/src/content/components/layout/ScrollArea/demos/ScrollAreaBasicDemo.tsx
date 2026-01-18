
import React from 'react';
import { ScrollArea, Stack, Box } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<ScrollArea maxHeight="300px" style={{ border: '1px solid var(--color-border-neutral-subtle)', borderRadius: '8px', padding: '1rem' }}>
    <Stack spacing="2">
        {listItems.map((item, index) => (
            <Box key={index} padding="3" background={index % 2 === 0 ? 'neutral-subtle' : 'surface'} borderRadius="m">
                {item}
            </Box>
        ))}
    </Stack>
</ScrollArea>`;

const ScrollAreaBasicDemo = () => {
    const listItems = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}: Some content for scrolling context.`);

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Vertical Scroll"
            description="ScrollArea with defined maxHeight."
        >
            <ScrollArea maxHeight="300px" style={{ border: '1px solid var(--color-border-neutral-subtle)', borderRadius: '8px', padding: '1rem' }}>
                <Stack gap={2}>
                    {listItems.map((item, index) => (
                        <Box key={index} padding={3} background={index % 2 === 0 ? 'neutral-subtle' : 'surface'} borderRadius="m">
                            {item}
                        </Box>
                    ))}
                </Stack>
            </ScrollArea>
        </DemoCard>
    );
};

export default ScrollAreaBasicDemo;
