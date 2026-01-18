/**
 * Radio Basic Demo
 */
import { useState } from 'react';
import { RadioGroup } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<RadioGroup
    name="demo-radio"
    value={value}
    onChange={setValue}
    label="Select an option"
    options={[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
    ]}
/>`;

const RadioDemo = () => {
    const [value, setValue] = useState('option1');

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Radio Group"
            description="Group of radio buttons for single selection"
        >
            <RadioGroup
                name="demo-radio"
                value={value}
                onChange={setValue}
                label="Select an option"
                options={[
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' },
                    { value: 'option3', label: 'Option 3', description: 'With description' },
                    { value: 'option4', label: 'Disabled', disabled: true },
                ]}
            />
        </DemoCard>
    );
};

export default RadioDemo;
