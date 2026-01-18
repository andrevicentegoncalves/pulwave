/**
 * DrawerSizesDemo - Demonstrates all drawer sizes
 */
import React, { useState } from 'react';
import { Drawer, Button, Stack, Text } from '@pulwave/ui';
import type { DrawerSize } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Drawer
    size={size} // 's', 'm', 'l', 'full'
    isOpen={isOpen}
    onClose={handleClose}
    title="Sized Drawer"
>
    <Text>Drawer Content</Text>
</Drawer>`;

const DrawerSizesDemo = () => {
    const [size, setSize] = useState<DrawerSize | null>(null);

    const sizes: DrawerSize[] = ['s', 'm', 'l', 'full'];

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Drawer Sizes" description="Available width presets">
            <Stack gap="3" direction="row">
                {sizes.map((s) => (
                    <Button key={s} kind="secondary" variant="outlined" onClick={() => setSize(s)}>
                        Size {s.toUpperCase()}
                    </Button>
                ))}

                <Drawer
                    isOpen={size !== null}
                    onClose={() => setSize(null)}
                    size={size || 'm'}
                    title={`Size: ${size?.toUpperCase()}`}
                >
                    <Text style={{ marginBottom: '1rem' }}>This drawer has size <Text as="strong" weight="bold">{size}</Text>.</Text>
                    <ul>
                        <li><Text><Text as="strong" weight="bold">S:</Text> 288px (18rem)</Text></li>
                        <li><Text><Text as="strong" weight="bold">M:</Text> 384px (24rem)</Text></li>
                        <li><Text><Text as="strong" weight="bold">L:</Text> 512px (32rem)</Text></li>
                        <li><Text><Text as="strong" weight="bold">Full:</Text> 100%</Text></li>
                    </ul>
                </Drawer>
            </Stack>
        </DemoCard>
    );
};

export default DrawerSizesDemo;
