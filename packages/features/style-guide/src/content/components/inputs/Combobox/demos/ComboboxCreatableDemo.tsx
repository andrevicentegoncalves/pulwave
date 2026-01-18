/**
 * ComboboxCreatableDemo - Demonstrates creatable option
 */
import React, { useState } from 'react';
import { Combobox } from '@ui';
import type { ComboboxOption } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Combobox
    creatable
    onCreate={handleCreate}
    options={options}
    value={value}
    onChange={setValue}
    placeholder="Select or create…"
/>`;

const ComboboxCreatableDemo = () => {
    const [options, setOptions] = useState<ComboboxOption[]>([
        { value: 'react', label: 'React' },
        { value: 'vue', label: 'Vue' },
        { value: 'angular', label: 'Angular' },
        { value: 'svelte', label: 'Svelte' },
    ]);
    const [value, setValue] = useState<string | undefined>();

    const handleCreate = (inputValue: string) => {
        const newOption = { value: inputValue.toLowerCase(), label: inputValue };
        setOptions(prev => [...prev, newOption]);
        setValue(newOption.value);
    };

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Creatable Combobox" description="Create new options on the fly">
            <div style={{ maxWidth: '300px' }}>
                <Combobox
                    options={options}
                    value={value}
                    onChange={setValue}
                    creatable
                    onCreate={handleCreate}
                    placeholder="Select or create…"
                />
            </div>
        </DemoCard>
    );
};

export default ComboboxCreatableDemo;
