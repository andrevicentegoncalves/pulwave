
import React from 'react';
import { SectionHeader, Stack, Text } from '@pulwave/ui';
import { User, Settings, Lock } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Stack spacing="6">
    <div>
        <SectionHeader title="Account Settings" icon={User} size="l" />
        <Text>Standard large header for main sections.</Text>
    </div>
    <div>
        <SectionHeader title="Security" icon={Lock} size="m" />
        <Text>Medium header for sub-sections.</Text>
    </div>
    <div>
        <SectionHeader title="Preferences" icon={Settings} size="s" />
        <Text>Small header for minor sections.</Text>
    </div>
</Stack>`;

const SectionHeaderBasicDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Section Header Variants"
            description="Headers with different icons and sizes."
        >
            <Stack spacing="6">
                <div>
                    <SectionHeader title="Account Settings" icon={User} size="l" />
                    <Text>Standard large header for main sections.</Text>
                </div>
                <div>
                    <SectionHeader title="Security" icon={Lock} size="m" />
                    <Text>Medium header for sub-sections.</Text>
                </div>
                <div>
                    <SectionHeader title="Preferences" icon={Settings} size="m" />
                    <Text>Small header (Medium in system) for minor sections.</Text>
                </div>
            </Stack>
        </DemoCard>
    );
};

export default SectionHeaderBasicDemo;
