/**
 * TextArea Basic Demo
 */
import { TextArea } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { TextArea } from '@ui';

// Basic usage
<TextArea label="Description" placeholder="Enter description…" />

// With default value
<TextArea label="Bio" defaultValue="Write about yourself…" />

// Resizable
<TextArea label="Notes" placeholder="Add notes…" resizable />

// Props: label, placeholder, value, defaultValue, rows,
// variant (outlined/contained), resizable, minHeight, maxHeight`;

const TextAreaBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Basic TextArea" description="Multi-line input field">
        <div className="demo-stack" style={{ width: '100%' }}>
            <TextArea label="Notes" placeholder="Add notes…" resize="both" />
        </div>
    </DemoCard>
);

export default TextAreaBasicDemo;
