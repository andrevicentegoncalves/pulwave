/**
 * Input with Helper Text Demo
 * Shows inputs with guidance text
 */
import { Input } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Input } from '@ui';

<Input
    label="Username"
    placeholder="Choose a username"
    helperText="Must be 3-20 characters, letters and numbers only"
/>
<Input
    label="Password"
    type="password"
    placeholder="Enter password"
    helperText="Must contain at least 8 characters…"
/>`;

const InputHelperTextDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Input with Helper Text"
        description="Guidance text below the input field"
    >
        <div className="demo-stack" style={{ maxWidth: '400px' }}>
            <Input
                label="Username"
                placeholder="Choose a username…"
                helperText="Must be 3-20 characters, letters and numbers only"
                autoComplete="username"
            />
            <Input
                label="Password"
                type="password"
                placeholder="Enter password…"
                helperText="Must contain at least 8 characters with uppercase, lowercase, and number"
                autoComplete="new-password"
            />
        </div>
    </DemoCard>
);

export default InputHelperTextDemo;
