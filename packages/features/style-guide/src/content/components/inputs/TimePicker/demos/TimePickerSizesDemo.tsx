/**
 * TimePicker Sizes Demo
 * Shows all TimePicker size variants
 */
import { TimePicker } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { TimePicker } from '@ui';

<TimePicker size="s" label="Small" />
<TimePicker size="m" label="Medium (default)" />
<TimePicker size="l" label="Large" />`;

const TimePickerSizesDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="TimePicker Sizes"
        description="Size variants aligned with other form controls (32px, 40px, 48px)"
    >
        <div className="demo-stack" style={{ maxWidth: '200px' }}>
            <TimePicker size="s" label="Small" />
            <TimePicker size="m" label="Medium (default)" />
            <TimePicker size="l" label="Large" />
        </div>
    </DemoCard>
);

export default TimePickerSizesDemo;
