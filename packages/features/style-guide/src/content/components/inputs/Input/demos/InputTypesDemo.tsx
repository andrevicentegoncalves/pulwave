/**
 * Input Types Demo
 * Shows all HTML input types
 */
import { Input } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Input } from '@ui';

<Input type="text" label="Text" placeholder="Enter text" />
<Input type="email" label="Email" placeholder="email@example.com" />
<Input type="password" label="Password" placeholder="Enter password" />
<Input type="number" label="Number" placeholder="0" />
<Input type="tel" label="Phone" placeholder="+1 (555) 000-0000" />
<Input type="url" label="URL" placeholder="https://example.com" />`;

const InputTypesDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Input Types"
        description="All supported HTML input types"
    >
        <div className="demo-grid">
            <Input type="text" label="Text" placeholder="Enter text…" />
            <Input type="email" label="Email" placeholder="email@example.com" autoComplete="email" />
            <Input type="password" label="Password" placeholder="Enter password…" autoComplete="new-password" />
            <Input type="number" label="Number" placeholder="0" />
            <Input type="tel" label="Phone" placeholder="+1 (555) 000-0000" autoComplete="tel" />
            <Input type="url" label="URL" placeholder="https://example.com" autoComplete="url" />
        </div>
    </DemoCard>
);

export default InputTypesDemo;
