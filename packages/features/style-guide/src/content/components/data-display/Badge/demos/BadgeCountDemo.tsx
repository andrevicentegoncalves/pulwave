/**
 * Badge Count Demo
 * Shows numeric count badges
 */
import { Badge } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Badge } from '@ui';

<Badge status="primary">3</Badge>
<Badge status="error">12</Badge>
<Badge status="primary">99+</Badge>`;

const BadgeCountDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Count Badges"
        description="Numeric indicators for notifications and counts"
    >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <Badge status="primary">3</Badge>
            <Badge status="error">12</Badge>
            <Badge status="primary">99+</Badge>
        </div>
    </DemoCard>
);

export default BadgeCountDemo;
