/**
 * Input Full Width Demo
 * Shows full-width input layout
 */
import { Input } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Input } from '@ui';

<Input
    label="Address"
    placeholder="Enter your full address"
    fullWidth
/>`;

const InputFullWidthDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Full Width Input"
        description="Input that expands to fill container width"
    >
        <Input
            label="Address"
            placeholder="Enter your full address"
            fullWidth
        />
    </DemoCard>
);

export default InputFullWidthDemo;
