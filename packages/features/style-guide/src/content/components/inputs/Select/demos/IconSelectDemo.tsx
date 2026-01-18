import React, { useState } from 'react';
import { Select, SelectOption } from '@ui';
import { User, Mail, Phone, Calendar } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Select
    options={[
        { value: 'user', label: 'User', icon: <User /> },
        { value: 'mail', label: 'Mail', icon: <Mail /> },
    ]}
    placeholder="Select an icon…"
/>`;

const IconSelectDemo = () => {
    const [value, setValue] = useState('');

    const options: SelectOption[] = [
        { value: 'user', label: 'User', icon: <User size={16} /> },
        { value: 'mail', label: 'Mail', icon: <Mail size={16} /> },
        { value: 'phone', label: 'Phone', icon: <Phone size={16} /> },
        { value: 'calendar', label: 'Calendar', icon: <Calendar size={16} /> },
    ];

    return (
        <DemoCard
            title="Icon Select"
            description="Select with icons in options and value."
            showPrimaryToggle
            sourceCode={codeUsage}
            showSourceToggle
        >
            <div style={{ maxWidth: '300px' }}>
                <Select
                    options={options}
                    value={value}
                    onChange={(val) => setValue(val as string)}
                    placeholder="Select an icon…"
                />
            </div>
        </DemoCard>
    );
};

export default IconSelectDemo;
