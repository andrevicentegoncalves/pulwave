import React, { useState } from 'react';
import { Chip, Stack, Avatar } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';
import { User, Globe } from '@ui';
import demoCode from './BasicUsageDemo.tsx?raw';

const ChipBasicDemo = () => {
    const [selected, setSelected] = useState(false);

    return (
        <DemoCard sourceCode={demoCode} showSourceToggle={true}
            title="Chip Variants"
            description="Chips are interactive and can support avatars, icons, and selection states."
        >
            <Stack spacing="4">
                <Stack direction="row" spacing="2">
                    <Chip onClick={() => console.log('clicked')}>Action Chip</Chip>
                    <Chip selected={selected} onSelect={() => setSelected(!selected)} variant="outline">
                        Selectable
                    </Chip>
                    <Chip removable onRemove={() => alert('Remove!')}>Removable</Chip>
                </Stack>
                <Stack direction="row" spacing="2">
                    <Chip avatar={<Avatar src="https://i.pravatar.cc/150?u=1" size="xs" />}>John Doe</Chip>
                    <Chip icon={<Globe size={14} />}>Global</Chip>
                </Stack>
            </Stack>
        </DemoCard>
    );
};

export default ChipBasicDemo;

