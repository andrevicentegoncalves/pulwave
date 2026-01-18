/**
 * TextArea States Demo
 * Shows different states: error, disabled, readonly
 */
import { TextArea } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { TextArea } from '@ui';

// Error state
<TextArea label="Description" error="This field is required" />

// Disabled state
<TextArea label="Disabled" placeholder="Cannot edit…" disabled />

// Read-only state
<TextArea label="Read Only" defaultValue="This content is read-only" readOnly />

// With helper text
<TextArea label="Bio" helperText="Maximum 500 characters" maxLength={500} />

// With character count
<TextArea label="Comment" maxLength={200} showCount />

// Props: label, placeholder, value, defaultValue, onChange,
// error, disabled, readOnly, helperText, maxLength, showCount,
// variant (outlined/contained), resizable, rows, minHeight, maxHeight`;

const TextAreaStatesDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="TextArea States" description="Different states and configurations">
        <div className="demo-stack" style={{ width: '100%' }}>
            <TextArea label="With Error" placeholder="Enter description…" error={true} />
            <TextArea label="Disabled" placeholder="Cannot edit…" disabled />
            <TextArea label="With Helper Text" helperText="Maximum 500 characters" placeholder="Enter bio…" />
            <TextArea label="With Character Count" placeholder="Enter your comment…" maxLength={200} />
        </div>
    </DemoCard>
);

export default TextAreaStatesDemo;
