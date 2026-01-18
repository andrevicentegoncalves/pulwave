import React, { useState } from 'react';
import { DemoCard } from '@pulwave/features-style-guide';
import { Select, SelectOption, Text } from '@ui';

const codeUsage = `<Select size="xs" options={...} />
<Select size="s" options={...} />
<Select size="m" options={...} />
<Select size="l" options={...} />`;

const SelectSizesDemo = () => {
    const [xsValue, setXsValue] = useState<string>('');
    const [sValue, setSValue] = useState<string>('');
    const [mValue, setMValue] = useState<string>('');
    const [lValue, setLValue] = useState<string>('');

    const options: SelectOption<string>[] = [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry' },
        { value: 'grape', label: 'Grape' },
    ];

    return (
        <DemoCard
            title="Select Sizes"
            description="Select supports 4 sizes: xs, s, m (default), and l."
            showPrimaryToggle
            sourceCode={codeUsage}
            showSourceToggle
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px' }}>
                <div>
                    <Text as="label" variant="label" color="muted" className="mb-1 block">
                        Extra Small (xs)
                    </Text>
                    <Select<string>
                        size="xs"
                        options={options}
                        value={xsValue}
                        onChange={(val) => setXsValue(val)}
                        placeholder="Select fruit…"
                    />
                </div>
                <div>
                    <Text as="label" variant="label" color="muted" className="mb-1 block">
                        Small (s)
                    </Text>
                    <Select<string>
                        size="s"
                        options={options}
                        value={sValue}
                        onChange={(val) => setSValue(val)}
                        placeholder="Select fruit…"
                    />
                </div>
                <div>
                    <Text as="label" variant="label" color="muted" className="mb-1 block">
                        Medium (m) - Default
                    </Text>
                    <Select<string>
                        size="m"
                        options={options}
                        value={mValue}
                        onChange={(val) => setMValue(val)}
                        placeholder="Select fruit…"
                    />
                </div>
                <div>
                    <Text as="label" variant="label" color="muted" className="mb-1 block">
                        Large (l)
                    </Text>
                    <Select<string>
                        size="l"
                        options={options}
                        value={lValue}
                        onChange={(val) => setLValue(val)}
                        placeholder="Select fruit…"
                    />
                </div>
            </div>
        </DemoCard>
    );
};

export default SelectSizesDemo;
