import { Progress, Stack } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Progress value={60} color="primary" />
<Progress value={100} color="success" />
<Progress value={80} color="warning" />
<Progress value={40} color="error" />
<Progress value={50} color="info" />`;

const ProgressColorDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Progress Colors" description="Semantic status colors">
        <Stack spacing="6">
            <Stack spacing="2">
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Primary (Default)</div>
                <Progress value={60} color="primary" />
            </Stack>
            <Stack spacing="2">
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Success</div>
                <Progress value={100} color="success" />
            </Stack>
            <Stack spacing="2">
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Warning</div>
                <Progress value={80} color="warning" />
            </Stack>
            <Stack spacing="2">
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Error</div>
                <Progress value={40} color="error" />
            </Stack>
            <Stack spacing="2">
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Info</div>
                <Progress value={50} color="info" />
            </Stack>
        </Stack>
    </DemoCard>
);

export default ProgressColorDemo;
