import React, { useState } from 'react';
import { Combobox, Text } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Combobox
    multiple
    options={OPTIONS}
    value={selected}
    onChange={setSelected}
    placeholder="Select frameworks…"
    clearable
/>`;

const OPTIONS = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'nuxt', label: 'Nuxt' },
];

const ComboboxMultiDemo = () => {
    const [selected, setSelected] = useState<string[]>(['react', 'nextjs']);

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Multi-Select Combobox" description="Select multiple options">
            <div style={{ maxWidth: '400px' }}>
                <Combobox
                    multiple
                    options={OPTIONS}
                    value={selected}
                    onChange={(val) => setSelected(val as string[])}
                    placeholder="Select frameworks…"
                    clearable
                />
                <Text size="s" style={{ marginTop: '1rem' }}>
                    <Text as="span" weight="bold">Selected:</Text> {JSON.stringify(selected)}
                </Text>
            </div>
        </DemoCard>
    );
};

export default ComboboxMultiDemo;
