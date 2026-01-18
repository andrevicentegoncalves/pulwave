/**
 * Skeleton Variants Demo
 */
import { Skeleton } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Skeleton variant="circular" width={48} height={48} />
<div style={{ flex: 1 }}>
    <Skeleton variant="text" width="80%" />
    <Skeleton variant="text" width="60%" />
</div>
<Skeleton variant="rectangular" width="100%" height={100} />`;

const SkeletonVariantsDemo = () => (
    <DemoCard sourceCode={demoCode} showSourceToggle={true} title="Skeleton Variants" description="Different skeleton shapes">
        <div className="demo-stack" style={{ width: 300 }}>
            <div className="demo-row">
                <Skeleton variant="circular" width={48} height={48} />
                <div style={{ flex: 1 }}>
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                </div>
            </div>
            <Skeleton variant="rectangular" width="100%" height={100} />
        </div>
    </DemoCard>
);

const demoCode = `<Skeleton variant="circular" width={48} height={48} />
<div style={{ flex: 1 }}>
    <Skeleton variant="text" width="80%" />
    <Skeleton variant="text" width="60%" />
</div>
<Skeleton variant="rectangular" width="100%" height={100} />`;

export default SkeletonVariantsDemo;
