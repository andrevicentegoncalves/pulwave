/**
 * Badge Sizes Demo
 * Shows all badge size variants
 */
import { Badge } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Badge } from '@ui';

<Badge size="xs">Extra Small</Badge>
<Badge size="s">Small</Badge>
<Badge size="m">Medium</Badge>
<Badge size="l">Large</Badge>
<Badge size="xl">Extra Large</Badge>`;

const BadgeSizesDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Badge Sizes"
        description="Size variants from extra-small to extra-large"
    >
        <div className="demo-row demo-row--align-center">
            <Badge size="xs" status="primary">Extra Small</Badge>
            <Badge size="s" status="primary">Small</Badge>
            <Badge size="m" status="primary">Medium</Badge>
            <Badge size="l" status="primary">Large</Badge>
            <Badge size="xl" status="primary">Extra Large</Badge>
        </div>
    </DemoCard>
);

export default BadgeSizesDemo;
