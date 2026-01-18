/**
 * ComboboxDemo - Basic Combobox demonstration
 */
import React, { useState } from 'react';
import { Combobox, Text } from '@ui';
import type { ComboboxOption } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Combobox
    options={options}
    value={value}
    onChange={setValue}
    placeholder="Select a fruit…"
/>`;

const options: ComboboxOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'date', label: 'Date' },
    { value: 'elderberry', label: 'Elderberry' },
    { value: 'fig', label: 'Fig' },
    { value: 'grape', label: 'Grape' },
];

const ComboboxDemo = () => {
    const [value, setValue] = useState<string | undefined>();

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Basic Combobox" description="Searchable single select">
            <div style={{ maxWidth: '300px' }}>
                <Combobox
                    options={options}
                    value={value}
                    onChange={setValue}
                    placeholder="Select a fruit…"
                />
                {value && <Text style={{ marginTop: '8px' }}>Selected: {value}</Text>}
            </div>
        </DemoCard>
    );
};

export default ComboboxDemo;
