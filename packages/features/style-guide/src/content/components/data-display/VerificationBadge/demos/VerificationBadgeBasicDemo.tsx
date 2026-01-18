/**
 * VerificationBadge Basic Demo
 */
import { VerificationBadge } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<VerificationBadge status="verified" />
<VerificationBadge status="unverified" />`;

const VerificationBadgeBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="VerificationBadge" description="Verification status">
        <div className="demo-row">
            <VerificationBadge status="verified" />
            <VerificationBadge status="unverified" />
        </div>
    </DemoCard>
);

export default VerificationBadgeBasicDemo;
