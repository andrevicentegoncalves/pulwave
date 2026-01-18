/**
 * Badge Dot Demo
 * Shows minimal dot indicators using size="xs" and circle
 */
import { Badge } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Badge } from '@ui';

<Badge size="xs" circle />
<Badge size="xs" circle status="success" />
<Badge size="xs" circle status="warning" />
<Badge size="xs" circle status="error" />`;

const BadgeDotDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Dot Badges"
        description="Minimal circular indicators for status (size='xs' + circle)"
    >
        <div className="demo-row">
            <Badge size="xs" circle />
            <Badge size="xs" circle status="success" />
            <Badge size="xs" circle status="warning" />
            <Badge size="xs" circle status="error" />
        </div>
    </DemoCard>
);

export default BadgeDotDemo;
