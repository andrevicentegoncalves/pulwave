/**
 * Badge Outline Demo
 * Shows outline/bordered badge style (variant="light")
 */
import { Badge } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Badge } from '@ui';

<Badge variant="light">Neutral</Badge>
<Badge variant="light" status="primary">Primary</Badge>
<Badge variant="light" status="success">Success</Badge>
<Badge variant="light" status="error">Error</Badge>`;

const BadgeOutlineDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Outline Badges"
        description="Bordered style with lower visual weight (variant='light')"
    >
        <div className="demo-row">
            <Badge variant="light">Neutral</Badge>
            <Badge variant="light" status="primary">Primary</Badge>
            <Badge variant="light" status="success">Success</Badge>
            <Badge variant="light" status="error">Error</Badge>
        </div>
    </DemoCard>
);

export default BadgeOutlineDemo;
