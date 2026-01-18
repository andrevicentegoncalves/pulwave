/**
 * Badge Status Demo
 * Shows real-world status use cases
 */
import { Badge } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Badge } from '@ui';

<Badge status="success">Active</Badge>
<Badge status="warning">Pending</Badge>
<Badge status="error">Inactive</Badge>
<Badge>Draft</Badge>
<Badge status="primary">New</Badge>
<Badge status="info">Beta</Badge>
<Badge status="warning">Deprecated</Badge>`;

const BadgeStatusDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Status Badges"
        description="Real-world status and feature indicators"
    >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <Badge status="success">Active</Badge>
            <Badge status="warning">Pending</Badge>
            <Badge status="error">Inactive</Badge>
            <Badge>Draft</Badge>
            <Badge status="primary">New</Badge>
            <Badge status="info">Beta</Badge>
            <Badge status="warning">Deprecated</Badge>
        </div>
    </DemoCard>
);

export default BadgeStatusDemo;
