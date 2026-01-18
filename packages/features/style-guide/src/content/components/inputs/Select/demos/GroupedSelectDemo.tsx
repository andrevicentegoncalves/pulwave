import React, { useState } from 'react';
import { Select } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const GROUPED_OPTIONS = [
    { value: 'react', label: 'React', group: 'Frontend' },
    { value: 'angular', label: 'Angular', group: 'Frontend' },
    { value: 'vue', label: 'Vue', group: 'Frontend' },
    { value: 'node', label: 'Node.js', group: 'Backend' },
    { value: 'python', label: 'Python', group: 'Backend' },
    { value: 'go', label: 'Go', group: 'Backend' },
    { value: 'postgres', label: 'PostgreSQL', group: 'Database' },
    { value: 'mongo', label: 'MongoDB', group: 'Database' },
    { value: 'redis', label: 'Redis', group: 'Database' },
    { value: 'aws', label: 'AWS', group: 'Infrastructure' },
    { value: 'docker', label: 'Docker', group: 'Infrastructure' },
    { value: 'kubernetes', label: 'Kubernetes', group: 'Infrastructure' },
    { value: 'git', label: 'Git' }, // Orphan option
    { value: 'vscode', label: 'VS Code' }, // Orphan option
];

const codeUsage = `const options = [
    { value: 'react', label: 'React', group: 'Frontend' },
    { value: 'java', label: 'Java', group: 'Backend' },
];

<Select
    label="Technology Stack"
    options={options}
    grouped
    fullWidth
/>`;

const GroupedSelectDemo = () => {
    const [value, setValue] = useState<string>('');

    return (
        <DemoCard
            title="Grouped Select"
            description="Options can be grouped by categories using the `grouped` prop and a `group` field in the options objects."
            showPrimaryToggle
            sourceCode={codeUsage}
            showSourceToggle
        >
            <Select<string>
                label="Technology Stack"
                value={value}
                onChange={(val) => setValue(val || '')}
                options={GROUPED_OPTIONS}
                grouped
                fullWidth
                placeholder="Select technology…"
            />
        </DemoCard>
    );
};

export default GroupedSelectDemo;
