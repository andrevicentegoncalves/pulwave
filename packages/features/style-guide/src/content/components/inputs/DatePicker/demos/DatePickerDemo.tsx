import { useState } from 'react';
import { DatePicker } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<DatePicker
    value={date}
    onChange={setDate}
    label="Select a date"
    showToday
    clearable
/>`;

const DatePickerDemo = () => {
    const [date, setDate] = useState<Date | null>(null);

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="DatePicker" description="Full-featured date picker with calendar">
            <DatePicker
                value={date}
                onChange={setDate}
                label="Select a date"
                showToday
                clearable
            />
        </DemoCard>
    );
};

export default DatePickerDemo;
