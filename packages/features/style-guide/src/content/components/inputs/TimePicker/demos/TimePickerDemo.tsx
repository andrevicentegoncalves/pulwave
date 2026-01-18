import { useState } from 'react';
import { TimePicker } from '@ui';
import type { TimeValue } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<TimePicker
    value={time}
    onChange={setTime}
    label="Select a time"
    format="12h"
    clearable
/>`;

const TimePickerDemo = () => {
    const [time, setTime] = useState<TimeValue | null>(null);

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="TimePicker" description="Full-featured time picker">
            <TimePicker
                value={time}
                onChange={setTime}
                label="Select a time"
                format="12h"
                clearable
            />
        </DemoCard>
    );
};

export default TimePickerDemo;
