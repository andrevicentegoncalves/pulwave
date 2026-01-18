/**
 * DrawerPositionsDemo - Demonstrates all drawer positions
 */
import React, { useState } from 'react';
import { Drawer, Button, Stack, Text } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Drawer
    position={position} // 'left' | 'right' | 'bottom'
    isOpen={isOpen}
    onClose={handleClose}
    title="Drawer Title"
>
    <Text>Drawer Content</Text>
</Drawer>`;

const DrawerPositionsDemo = () => {
    const [position, setPosition] = useState<'left' | 'right' | 'bottom' | null>(null);

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Drawer Positions" description="Left, right, or bottom placement">
            <Stack gap={3} direction="row">
                <Button kind="secondary" variant="filled" onClick={() => setPosition('left')}>
                    Left Drawer
                </Button>
                <Button kind="secondary" variant="filled" onClick={() => setPosition('right')}>
                    Right Drawer
                </Button>
                <Button kind="secondary" variant="filled" onClick={() => setPosition('bottom')}>
                    Bottom Sheet
                </Button>

                <Drawer
                    isOpen={position !== null}
                    onClose={() => setPosition(null)}
                    position={position || 'right'}
                    title={`${position?.charAt(0).toUpperCase()}${position?.slice(1) || ''} Drawer`}
                >
                    <Text>This drawer slides in from the <Text as="span" weight="bold">{position}</Text> position.</Text>
                    <Text>Try the different positions to see the animations.</Text>
                </Drawer>
            </Stack>
        </DemoCard>
    );
};

export default DrawerPositionsDemo;
