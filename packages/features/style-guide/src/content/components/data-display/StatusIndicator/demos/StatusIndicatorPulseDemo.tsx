/**
 * StatusIndicator Pulse Demo
 * Shows animated pulse effect
 */
import { StatusIndicator } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<StatusIndicator status="online" pulse label="Active Now" />
<StatusIndicator status="online" size="l" pulse />`;

const StatusIndicatorPulseDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Pulse Animation"
        description="Online status with animated pulse effect"
    >
        <>
            <StatusIndicator status="online" pulse label="Active Now" />
            <StatusIndicator status="online" size="l" pulse />
        </>
    </DemoCard>
);

export default StatusIndicatorPulseDemo;
