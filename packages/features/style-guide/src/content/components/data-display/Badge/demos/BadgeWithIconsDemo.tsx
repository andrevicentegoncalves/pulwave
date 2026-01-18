/**
 * Badge with Icons Demo
 * Shows badges with leading icons
 */
import { Badge } from '@ui';
import { Check, AlertTriangle, X, Info } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Badge, Check, AlertTriangle, X, Info } from '@ui';

<Badge status="success" icon={<Check size={12} />}>Completed</Badge>
<Badge status="warning" icon={<AlertTriangle size={12} />}>Pending</Badge>
<Badge status="error" icon={<X size={12} />}>Failed</Badge>
<Badge status="info" icon={<Info size={12} />}>Info</Badge>`;

const BadgeWithIconsDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Badges with Icons"
        description="Leading icons for visual context"
    >
        <div className="demo-row">
            <Badge status="success" icon={<Check size={12} />}>Completed</Badge>
            <Badge status="warning" icon={<AlertTriangle size={12} />}>Pending</Badge>
            <Badge status="error" icon={<X size={12} />}>Failed</Badge>
            <Badge status="info" icon={<Info size={12} />}>Info</Badge>
        </div>
    </DemoCard>
);

export default BadgeWithIconsDemo;
