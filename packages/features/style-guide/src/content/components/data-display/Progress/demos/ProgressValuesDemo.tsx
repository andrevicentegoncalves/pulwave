/**
 * Progress Values Demo
 */
import { Progress } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Progress value={25} label="25% Complete" />
<Progress value={50} label="50% Complete" />
<Progress value={75} label="75% Complete" />
<Progress value={100} label="Complete" />`;

const ProgressValuesDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Progress Values" description="Different progress percentages">
        <div className="demo-stack">
            <Progress value={25} label="25% Complete" />
            <Progress value={50} label="50% Complete" />
            <Progress value={75} label="75% Complete" />
            <Progress value={100} label="Complete" />
        </div>
    </DemoCard>
);

export default ProgressValuesDemo;
