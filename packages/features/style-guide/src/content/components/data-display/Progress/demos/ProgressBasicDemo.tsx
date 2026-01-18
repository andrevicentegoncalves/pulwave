import { Progress } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <Progress value={30} />
    <Progress value={60} />
    <Progress value={90} />
</div>`;

const ProgressBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Basic Progress" description="Standard linear progress bar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Progress value={30} />
            <Progress value={60} />
            <Progress value={90} />
        </div>
    </DemoCard>
);

export default ProgressBasicDemo;
