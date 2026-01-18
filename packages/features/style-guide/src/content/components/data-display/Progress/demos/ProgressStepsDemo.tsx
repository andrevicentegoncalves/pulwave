import { Progress } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Progress
    variant="steps"
    steps={[
        { label: 'Step 1', complete: true },
        { label: 'Step 2', complete: true },
        { label: 'Step 3', active: true },
        { label: 'Step 4' }
    ]}
/>`;

const ProgressStepsDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Progress Steps" description="Step-based progress indicator">
        <Progress
            variant="steps"
            steps={[
                { label: 'Step 1', complete: true },
                { label: 'Step 2', complete: true },
                { label: 'Step 3', active: true },
                { label: 'Step 4' }
            ]}
        />
    </DemoCard>
);

export default ProgressStepsDemo;
