import React, { useState } from 'react';
import { Combobox, Stack, Text, Card } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Combobox
    virtualized
    options={largeDataset}
    value={value}
    onChange={setValue}
    placeholder="Search 10k items…"
/>`;

// Generate 10,000 items
const largeDataset = Array.from({ length: 10000 }).map((_, i) => ({
    value: `item-${i}`,
    label: `Item ${i + 1} - ${Math.random().toString(36).substring(7)}`,
    description: `Description for item ${i + 1}`,
}));

const ComboboxVirtualDemo = () => {
    const [value, setValue] = useState<string | undefined>();
    const [multiValue, setMultiValue] = useState<string[]>([]);
    const [query, setQuery] = useState('');

    const filteredOptions = query
        ? largeDataset.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
        : largeDataset;

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Virtualized Combobox" description="Efficiently render large lists">
            <Stack spacing="8">
                <Stack spacing="4">
                    <Text category="title" size="m">Virtualization (10,000 Items)</Text>
                    <Text>
                        The Combobox can handle large datasets efficiently using the <code>virtualized</code> prop.
                        This demo loads 10,000 items.
                    </Text>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-4 space-y-4">
                            <Text weight="bold">Single Select</Text>
                            <Combobox
                                options={filteredOptions}
                                value={value}
                                onChange={(val) => setValue(val as string)}
                                onSearch={setQuery}
                                placeholder="Search 10k items…"
                                virtualized
                                emptyMessage="No items found"
                            />
                            <div className="text-xs text-neutral-500">
                                Selected: {value || 'None'}
                            </div>
                        </Card>

                        <Card className="p-4 space-y-4">
                            <Text weight="bold">Multi Select</Text>
                            <Combobox
                                options={filteredOptions}
                                value={multiValue}
                                onChange={(val) => setMultiValue(val as string[])}
                                onSearch={setQuery}
                                placeholder="Select multiple items…"
                                virtualized
                                multiple
                            />
                            <div className="text-xs text-neutral-500">
                                Selected count: {multiValue.length}
                            </div>
                        </Card>
                    </div>
                </Stack>
            </Stack>
        </DemoCard>
    );
};

export default ComboboxVirtualDemo;
