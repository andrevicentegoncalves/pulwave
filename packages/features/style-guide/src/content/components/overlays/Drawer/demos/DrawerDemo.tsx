/**
 * DrawerDemo - Basic Drawer demonstration
 */
import React, { useState } from 'react';
import { Drawer, Button, Stack, Text } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Drawer
    isOpen={isOpen}
    onClose={handleClose}
    title="Example Drawer"
    footer={
        <Stack direction="row" gap={3} justify="end">
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button kind="primary" onClick={handleClose}>Save</Button>
        </Stack>
    }
>
    <Text>This is the drawer content. You can put any content here including forms, lists, or other components.</Text>
</Drawer>`;

const DrawerDemo = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Basic Drawer" description="Slide-out panel">
            <Button onClick={() => setIsOpen(true)}>
                Open Drawer
            </Button>

            <Drawer
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Example Drawer"
                footer={
                    <Stack direction="row" gap={3} justify="end">
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button kind="primary" onClick={() => setIsOpen(false)}>
                            Save
                        </Button>
                    </Stack>
                }
            >
                <Text>This is the drawer content. You can put any content here including forms, lists, or other components.</Text>
            </Drawer>
        </DemoCard>
    );
};

export default DrawerDemo;
