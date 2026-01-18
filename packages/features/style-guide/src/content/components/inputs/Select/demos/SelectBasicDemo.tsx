import React, { useState } from 'react';
import { Select } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';
import demoCode from './SelectBasicDemo.tsx?raw';

const options = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' },
];

const codeUsage = `<Select
    label="Choose an option"
    options={options}
    value={value}
    onChange={setValue}
    placeholder="Select…"
/>`;

const SelectBasicDemo = () => {
    const [value, setValue] = useState('');

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Basic Select" description="Standard select component">
            <div style={{ width: '300px' }}>
                <Select<string>
                    label="Choose an option"
                    options={options}
                    value={value}
                    onChange={(val) => setValue(val)}
                    placeholder="Select…"
                />
            </div>
        </DemoCard>
    );
};

export default SelectBasicDemo;
