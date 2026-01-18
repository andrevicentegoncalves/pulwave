import { useState } from 'react';
import { SegmentedControl, Stack } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<SegmentedControl
    value={view}
    onChange={setView}
    options={[
        { label: 'List View', value: 'list' },
        { label: 'Grid View', value: 'grid' },
        { label: 'Map', value: 'map' },
    ]}
/>`;

const SegmentedControlBasicDemo = () => {
    const [view, setView] = useState('list');
    const [alignment, setAlignment] = useState('left');

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Segmented Control"
            description="Used to switch between two or more exclusive views or states."
        >
            <Stack spacing="6">
                <SegmentedControl
                    value={view}
                    onChange={setView}
                    options={[
                        { label: 'List View', value: 'list' },
                        { label: 'Grid View', value: 'grid' },
                        { label: 'Map', value: 'map' },
                    ]}
                />

                <SegmentedControl
                    value={alignment}
                    onChange={setAlignment}
                    size="s"
                    options={[
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' },
                    ]}
                />

                <SegmentedControl
                    value={view}
                    onChange={setView}
                    fullWidth
                    options={[
                        { label: 'Daily', value: 'daily' },
                        { label: 'Weekly', value: 'weekly' },
                        { label: 'Monthly', value: 'monthly' }
                    ]}
                />
            </Stack>
        </DemoCard>
    );
};

export default SegmentedControlBasicDemo;
