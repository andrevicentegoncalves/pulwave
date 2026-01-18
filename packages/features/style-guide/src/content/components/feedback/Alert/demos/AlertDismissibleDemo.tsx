/**
 * Alert Dismissible Demo
 */
import { Alert } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Alert status="info" dismissible onDismiss={handleDismiss}>
    This alert can be dismissed.
</Alert>
<Alert status="success" dismissible onDismiss={handleDismiss}>
    Click the X to close this alert.
</Alert>`;

const AlertDismissibleDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Dismissible Alerts" description="Alerts with close button">
        <div className="demo-stack">
            <Alert status="info" dismissible onDismiss={() => console.log('Dismissed')}>
                This alert can be dismissed.
            </Alert>
            <Alert status="success" dismissible onDismiss={() => console.log('Dismissed')}>
                Click the X to close this alert.
            </Alert>
        </div>
    </DemoCard>
);

export default AlertDismissibleDemo;
