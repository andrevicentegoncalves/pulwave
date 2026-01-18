/**
 * DatePicker Sizes Demo
 * Shows all DatePicker size variants
 */
import { DatePicker } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { DatePicker } from '@ui';

<DatePicker size="s" label="Small" />
<DatePicker size="m" label="Medium (default)" />
<DatePicker size="l" label="Large" />`;

const DatePickerSizesDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="DatePicker Sizes"
        description="Size variants aligned with other form controls (32px, 40px, 48px)"
    >
        <div className="demo-stack" style={{ maxWidth: '300px' }}>
            <DatePicker size="s" label="Small" />
            <DatePicker size="m" label="Medium (default)" />
            <DatePicker size="l" label="Large" />
        </div>
    </DemoCard>
);

export default DatePickerSizesDemo;
