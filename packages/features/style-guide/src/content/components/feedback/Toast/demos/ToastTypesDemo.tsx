/**
 * Toast Types Demo
 */
import { Toast } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Toast variant="info" message="This is an info toast" />
<Toast variant="success" message="Action completed successfully" />
<Toast variant="warning" message="Please review your input" />
<Toast variant="error" message="An error occurred" />`;

const ToastTypesDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Toast Types" description="Different toast message types">
        <div className="demo-stack" style={{ gap: 'var(--spacing-3)' }}>
            <Toast variant="info" message="This is an info toast" />
            <Toast variant="success" message="Action completed successfully" />
            <Toast variant="warning" message="Please review your input" />
            <Toast variant="error" message="An error occurred" />
        </div>
    </DemoCard>
);

export default ToastTypesDemo;
