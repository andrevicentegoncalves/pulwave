/**
 * Input Required Demo
 * Shows required field indicators
 */
import { Input } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Input } from '@ui';

<Input label="Full Name" placeholder="Enter name" required />
<Input label="Nickname" placeholder="Optional" />`;

const InputRequiredDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Required Fields"
        description="Required indicator with asterisk"
    >
        <div className="demo-grid" style={{ maxWidth: '500px' }}>
            <Input label="Full Name" placeholder="Enter name" required />
            <Input label="Nickname" placeholder="Optional" />
        </div>
    </DemoCard>
);

export default InputRequiredDemo;
