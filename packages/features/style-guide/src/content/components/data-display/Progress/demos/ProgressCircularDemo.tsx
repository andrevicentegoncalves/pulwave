import { Progress, Stack } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Stack direction="row" spacing="8" align="center">
    <Progress variant="circular" value={25} />
    <Progress variant="circular" value={50} />
    <Progress variant="circular" value={75} />
    <Progress variant="circular" value={100} />
</Stack>`;

const ProgressCircularDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Circular Progress" description="Circular variant for compact spaces">
        <Stack direction="row" spacing="8" align="center">
            <Progress variant="circular" value={25} />
            <Progress variant="circular" value={50} />
            <Progress variant="circular" value={75} />
            <Progress variant="circular" value={100} />
        </Stack>
    </DemoCard>
);

export default ProgressCircularDemo;
