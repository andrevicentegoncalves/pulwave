/**
 * StatusIndicator Basic Demo
 * Shows all status types
 */
import { StatusIndicator } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<StatusIndicator status="online" label="Online" />
<StatusIndicator status="away" label="Away" />
<StatusIndicator status="busy" label="Busy" />
<StatusIndicator status="dnd" label="Do Not Disturb" />
<StatusIndicator status="offline" label="Offline" />
<StatusIndicator status="invisible" label="Invisible" />`;

const StatusIndicatorBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Status Types"
        description="All available status indicator states"
    >
        <>
            <StatusIndicator status="online" label="Online" />
            <StatusIndicator status="away" label="Away" />
            <StatusIndicator status="busy" label="Busy" />
            <StatusIndicator status="dnd" label="Do Not Disturb" />
            <StatusIndicator status="offline" label="Offline" />
            <StatusIndicator status="invisible" label="Invisible" />
        </>
    </DemoCard>
);

export default StatusIndicatorBasicDemo;
