import React, { useState } from 'react';
import { Select } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const options = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
];

const codeUsage = `<Select label="Disabled" disabled />
<Select label="Error" error="Required" />
<Select label="Read Only" readOnly />`;

const SelectStatesDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Select States" description="Different states of the select component">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
                <Select<string>
                    label="Disabled"
                    options={options}
                    value=""
                    onChange={() => { }}
                    disabled
                    placeholder="Disabled select"
                />
                <Select<string>
                    label="Error"
                    options={options}
                    value=""
                    onChange={() => { }}
                    error="This field is required"
                    placeholder="Error state"
                />
                <Select<string>
                    label="Read Only (Simulated with disabled)"
                    options={options}
                    value="1"
                    onChange={() => { }}
                    disabled
                />
            </div>
        </DemoCard>
    );
};

export default SelectStatesDemo;
