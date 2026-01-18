/**
 * Input States Demo
 * Shows all input interactive states
 */
import { Input } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Input } from '@ui';

<Input label="Default" placeholder="Default state" />
<Input label="Filled" defaultValue="Filled value" />
<Input label="Disabled" placeholder="Disabled" disabled />
<Input label="Read Only" value="Read only value" readOnly />
<Input label="Error" placeholder="Error state" error="This field is required" />
<Input label="Success" placeholder="Valid input" helperText="Looks good!" />`;

const InputStatesDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Input States"
        description="All interactive states"
    >
        <div className="demo-grid">
            <Input label="Default" placeholder="Default state" />
            <Input label="Filled" defaultValue="Filled value" />
            <Input label="Disabled" placeholder="Disabled" disabled />
            <Input label="Read Only" value="Read only value" readOnly />
            <Input label="Error" placeholder="Error state" error={true} />
            <Input label="Success" placeholder="Valid input" helperText="Looks good!" />
        </div>
    </DemoCard>
);

export default InputStatesDemo;
