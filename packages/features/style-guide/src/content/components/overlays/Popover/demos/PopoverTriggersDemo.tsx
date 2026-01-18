/**
 * PopoverTriggersDemo - Demonstrates different trigger types
 */
import React from 'react';
import { Popover, Button, Stack, Text } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Popover triggerType="click" trigger={<Button>Click</Button>}>
    <Text>Opened by click</Text>
</Popover>

<Popover triggerType="hover" trigger={<Button>Hover</Button>}>
    <Text>Opened by hover</Text>
</Popover>

<Popover triggerType="focus" trigger={<Button>Focus</Button>}>
    <Text>Opened by focus</Text>
</Popover>`;

const PopoverTriggersDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Popover Triggers" description="Click, hover, or focus triggers">
            <Stack gap={4} direction="row">
                <Popover
                    trigger={<Button>Click Trigger</Button>}
                    triggerType="click"
                >
                    <Text style={{ margin: 0 }}>Opened by click</Text>
                </Popover>

                <Popover
                    trigger={<Button kind="secondary">Hover Trigger</Button>}
                    triggerType="hover"
                    openDelay={200}
                >
                    <Text style={{ margin: 0 }}>Opened by hover</Text>
                </Popover>

                <Popover
                    trigger={<Button variant="ghost">Focus Trigger</Button>}
                    triggerType="focus"
                >
                    <Text style={{ margin: 0 }}>Opened by focus</Text>
                </Popover>
            </Stack>
        </DemoCard>
    );
};

export default PopoverTriggersDemo;
