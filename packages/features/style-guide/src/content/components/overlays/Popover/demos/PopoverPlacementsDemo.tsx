/**
 * PopoverPlacementsDemo - Demonstrates all placement options
 */
import React from 'react';
import { Popover, Button, Stack, Text } from '@pulwave/ui';
import type { PopoverPlacement } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Popover placement="top" trigger={<Button>Top</Button>}>
    <Text>Popover on top</Text>
</Popover>
<Popover placement="bottom" trigger={<Button>Bottom</Button>}>
    <Text>Popover on bottom</Text>
</Popover>
<Popover placement="left" trigger={<Button>Left</Button>}>
    <Text>Popover on left</Text>
</Popover>
<Popover placement="right" trigger={<Button>Right</Button>}>
    <Text>Popover on right</Text>
</Popover>`;

const PopoverPlacementsDemo = () => {
    const placements: PopoverPlacement[] = ['top', 'bottom', 'left', 'right'];

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Popover Placements" description="Different positioning options">
            <Stack gap="4" direction="row" align="center" justify="center" style={{ padding: '60px' }}>
                {placements.map((placement) => (
                    <Popover
                        key={placement}
                        trigger={<Button kind="secondary" variant="outlined">{placement}</Button>}
                        placement={placement}
                    >
                        <Text style={{ margin: 0 }}>Popover on {placement}</Text>
                    </Popover>
                ))}
            </Stack>
        </DemoCard>
    );
};

export default PopoverPlacementsDemo;
