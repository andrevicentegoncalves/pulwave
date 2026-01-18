import { useState } from 'react';
import { CheckboxGroup } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<CheckboxGroup
    name="preferences"
    label="Preferences"
    options={[
        { value: 'notifications', label: 'Email notifications' },
        { value: 'marketing', label: 'Marketing emails' },
    ]}
    value={selected}
    onChange={setSelected}
/>`;

const CheckboxGroupBasicDemo = () => {
    const [selected, setSelected] = useState<string[]>(['notifications']);

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Basic Checkbox Group" description="Vertical checkbox group with label">
            <CheckboxGroup
                name="preferences"
                label="Preferences"
                options={[
                    { value: 'notifications', label: 'Email notifications' },
                    { value: 'marketing', label: 'Marketing emails' },
                    { value: 'updates', label: 'Product updates' },
                ]}
                value={selected}
                onChange={setSelected}
            />
        </DemoCard>
    );
};

export default CheckboxGroupBasicDemo;
