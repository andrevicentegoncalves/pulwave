/**
 * Alert Types Demo
 */
import { Alert } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Alert status="info">This is an informational message.</Alert>
<Alert status="success">Operation completed successfully!</Alert>
<Alert status="warning">Please review before proceeding.</Alert>
<Alert status="error">An error occurred. Please try again.</Alert>`;

const AlertTypesDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Alert Types" description="Semantic types for different message contexts">
        <div className="demo-stack">
            <Alert status="info">This is an informational message.</Alert>
            <Alert status="success">Operation completed successfully!</Alert>
            <Alert status="warning">Please review before proceeding.</Alert>
            <Alert status="error">An error occurred. Please try again.</Alert>
        </div>
    </DemoCard>
);

export default AlertTypesDemo;
