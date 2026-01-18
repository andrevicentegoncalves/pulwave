/**
 * Switch States Demo
 */
import { Switch } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Switch label="Off" />
<Switch label="On" defaultChecked />
<Switch label="Disabled" disabled />`;

const SwitchStatesDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Switch States" description="On, off, and disabled states">
        <div className="demo-stack">
            <Switch label="Default off" />
            <Switch label="Default on" defaultChecked />
            <Switch label="Disabled off" disabled />
            <Switch label="Disabled on" disabled defaultChecked />
        </div>
    </DemoCard>
);

export default SwitchStatesDemo;
