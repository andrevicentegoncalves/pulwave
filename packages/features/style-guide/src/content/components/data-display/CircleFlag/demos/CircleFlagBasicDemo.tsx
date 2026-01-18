/**
 * CircleFlag Basic Demo
 */
import { CircleFlag, Stack } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<CircleFlag countryCode="us" />
<CircleFlag countryCode="gb" />
<CircleFlag countryCode="fr" size="l" />`;

const CircleFlagBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="CircleFlag" description="Country flags">
        <Stack direction="row" spacing="4" align="center">
            <CircleFlag countryCode="us" />
            <CircleFlag countryCode="gb" />
            <CircleFlag countryCode="fr" size="l" />
        </Stack>
    </DemoCard>
);

export default CircleFlagBasicDemo;
