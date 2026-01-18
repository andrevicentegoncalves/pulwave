/**
 * Input Sizes Demo
 * Shows all input size variants
 */
import { Input } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Input } from '@ui';

<Input size="s" label="Small" placeholder="Small input" />
<Input size="m" label="Medium" placeholder="Medium input (default)" />
<Input size="l" label="Large" placeholder="Large input" />`;

const InputSizesDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Input Sizes"
        description="Size variants from small (32px) to large (48px)"
    >
        <div className="demo-stack" style={{ maxWidth: '400px', gap: 'var(--scale-6)' }}>
            <Input size="s" label="Small" placeholder="Small input" />
            <Input size="m" label="Medium" placeholder="Medium input (default)" />
            <Input size="l" label="Large" placeholder="Large input" />
        </div>
    </DemoCard>
);

export default InputSizesDemo;
