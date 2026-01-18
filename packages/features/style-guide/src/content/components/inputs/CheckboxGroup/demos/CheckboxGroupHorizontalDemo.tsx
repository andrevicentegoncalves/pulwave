import { useState } from 'react';
import { CheckboxGroup } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<CheckboxGroup
    name="days"
    label="Preferred days"
    orientation="horizontal"
    options={[
        { value: 'mon', label: 'Monday' },
        { value: 'tue', label: 'Tuesday' },
    ]}
    value={selected}
    onChange={setSelected}
/>`;

const CheckboxGroupHorizontalDemo = () => {
    const [selected, setSelected] = useState<string[]>([]);

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Horizontal Layout" description="Checkbox group with horizontal orientation">
            <CheckboxGroup
                name="days"
                label="Preferred days"
                orientation="horizontal"
                options={[
                    { value: 'mon', label: 'Monday' },
                    { value: 'tue', label: 'Tuesday' },
                    { value: 'wed', label: 'Wednesday' },
                    { value: 'thu', label: 'Thursday' },
                    { value: 'fri', label: 'Friday' },
                ]}
                value={selected}
                onChange={setSelected}
            />
        </DemoCard>
    );
};

export default CheckboxGroupHorizontalDemo;
