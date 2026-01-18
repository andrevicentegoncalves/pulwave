import { Progress, Stack } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Progress value={40} size="s" />
<Progress value={60} size="m" />
<Progress value={80} size="l" />`;

const ProgressSizeDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Progress Sizes" description="Available sizes: s, m (default), l">
        <Stack spacing="6">
            <Stack spacing="2">
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Small (s)</div>
                <Progress value={40} size="s" />
            </Stack>
            <Stack spacing="2">
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Medium (m)</div>
                <Progress value={60} size="m" />
            </Stack>
            <Stack spacing="2">
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Large (l)</div>
                <Progress value={80} size="l" />
            </Stack>
        </Stack>
    </DemoCard>
);

export default ProgressSizeDemo;
