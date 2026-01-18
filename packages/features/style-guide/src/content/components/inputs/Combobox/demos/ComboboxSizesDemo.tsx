/**
 * Combobox Sizes Demo
 * Shows all Combobox size variants
 */
import { Combobox } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Orange', value: 'orange' },
];

const codeUsage = `import { Combobox } from '@pulwave/ui';

const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Orange', value: 'orange' },
];

<Combobox size="s" options={options} placeholder="Small" />
<Combobox size="m" options={options} placeholder="Medium (default)" />
<Combobox size="l" options={options} placeholder="Large" />`;

const ComboboxSizesDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Combobox Sizes"
        description="Size variants aligned with other form controls (32px, 40px, 48px)"
    >
        <div className="demo-stack" style={{ maxWidth: '300px' }}>
            <Combobox size="s" options={options} placeholder="Small" />
            <Combobox size="m" options={options} placeholder="Medium (default)" />
            <Combobox size="l" options={options} placeholder="Large" />
        </div>
    </DemoCard>
);

export default ComboboxSizesDemo;
