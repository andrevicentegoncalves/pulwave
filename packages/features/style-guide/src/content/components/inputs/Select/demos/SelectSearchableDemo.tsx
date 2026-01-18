import React, { useState } from 'react';
import { Select } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Date', value: 'date' },
    { label: 'Elderberry', value: 'elderberry' },
];

const codeUsage = `<Select
    label="Favorite Fruit"
    options={options}
    searchable
    placeholder="Search fruits…"
/>`;

const SelectSearchableDemo = () => {
    const [value, setValue] = useState('');

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Searchable Select" description="Select with search functionality">
            <div style={{ width: '300px' }}>
                <Select<string>
                    label="Favorite Fruit"
                    options={options}
                    value={value}
                    onChange={(val) => setValue(val)}
                    searchable
                    placeholder="Search fruits…"
                />
            </div>
        </DemoCard>
    );
};

export default SelectSearchableDemo;
