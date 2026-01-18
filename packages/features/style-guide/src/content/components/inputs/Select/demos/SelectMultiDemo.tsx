import React, { useState } from 'react';
import { Select } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const options = [
    { label: 'Red', value: 'red' },
    { label: 'Green', value: 'green' },
    { label: 'Blue', value: 'blue' },
    { label: 'Yellow', value: 'yellow' },
];

const codeUsage = `<Select
    label="Favorite Colors"
    options={options}
    value={value} // string[]
    onChange={setValue}
    multi
    placeholder="Select colors…"
/>`;

const SelectMultiDemo = () => {
    const [value, setValue] = useState<string[]>([]);

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Multi Select" description="Select multiple options">
            <div style={{ width: '300px' }}>
                <Select<string>
                    label="Favorite Colors"
                    options={options}
                    value={value}
                    onChange={(val) => setValue(val as string[] || [])}
                    multiple
                    placeholder="Select colors…"
                />
            </div>
        </DemoCard>
    );
};

export default SelectMultiDemo;
