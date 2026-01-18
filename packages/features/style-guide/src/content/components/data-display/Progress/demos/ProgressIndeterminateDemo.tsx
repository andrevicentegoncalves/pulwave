import { Progress, Stack } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Progress indeterminate />
<Progress variant="circular" indeterminate />`;

const ProgressIndeterminateDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Indeterminate Progress" description="For unknown duration tasks">
        <Stack spacing="6">
            <Stack spacing="2">
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Linear Indeterminate</div>
                <Progress indeterminate />
            </Stack>
            <Stack spacing="2">
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Circular Indeterminate</div>
                <Progress variant="circular" indeterminate />
            </Stack>
        </Stack>
    </DemoCard>
);

export default ProgressIndeterminateDemo;
