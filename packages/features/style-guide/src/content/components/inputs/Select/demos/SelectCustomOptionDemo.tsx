import React, { useState } from 'react';
import { Select } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const options = [
    { label: 'Standard Option', value: 'std' },
    { label: 'Custom Option (Bold)', value: 'custom', renderLabel: (l: string) => <strong>{l}</strong> },
];

const codeUsage = `<Select
    label="Custom Options"
    options={[
        { value: '1', label: 'Bold', renderLabel: l => <strong>{l}</strong> }
    ]}
    placeholder="Select…"
/>`;

const SelectCustomOptionDemo = () => {
    const [value, setValue] = useState('');

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Custom Options" description="Select with custom option rendering">
            <div style={{ width: '300px' }}>
                <Select
                    label="Custom Options"
                    options={options}
                    value={value}
                    onChange={(val) => setValue(val as string)}
                    placeholder="Select…"
                />
            </div>
        </DemoCard>
    );
};

export default SelectCustomOptionDemo;
