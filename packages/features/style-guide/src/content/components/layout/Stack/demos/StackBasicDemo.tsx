/**
 * Stack Basic Demo
 */
import { Stack, Box } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Stack gap={4}>
    <BoxItem color="#e0e0e0" />
    <BoxItem color="#c0c0c0" />
    <BoxItem color="#a0a0a0" />
</Stack>`;

const BoxItem = ({ color }: { color: string }) => (
    <Box padding={4} style={{ backgroundColor: color, width: 50, height: 50 }} />
);

const StackBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Stack" description="Vertical stacking with spacing">
        <Stack gap={4}>
            <BoxItem color="#e0e0e0" />
            <BoxItem color="#c0c0c0" />
            <BoxItem color="#a0a0a0" />
        </Stack>
    </DemoCard>
);

export default StackBasicDemo;
