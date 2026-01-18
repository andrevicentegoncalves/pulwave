/**
 * PopoverDemo - Basic Popover demonstration
 */
import React from 'react';
import { Popover, Button, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Popover
    trigger={<Button>Click to open</Button>}
    placement="bottom"
>
    <div style={{ maxWidth: '200px' }}>
        <Text category="title" size="s" style={{ marginBottom: '8px' }}>Popover Title</Text>
        <Text category="body" style={{ margin: 0 }}>This is popover content. It can contain any elements.</Text>
    </div>
</Popover>`;

const PopoverDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Basic Popover" description="Rich content overlay">
            <Popover
                trigger={<Button>Click to open</Button>}
                placement="bottom"
            >
                <div style={{ maxWidth: '200px' }}>
                    <Text category="title" size="s" style={{ marginBottom: '8px' }}>Popover Title</Text>
                    <Text category="body" style={{ margin: 0 }}>This is popover content. It can contain any elements.</Text>
                </div>
            </Popover>
        </DemoCard>
    );
};

export default PopoverDemo;
