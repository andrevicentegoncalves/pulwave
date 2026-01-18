/**
 * Button Group Demo
 * Shows common button group patterns
 */
import { Button } from '@ui';
import { Trash2 } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';
import demoCode from './ButtonGroupDemo.tsx?raw';

const codeUsage = `<Button variant="secondary">Preview</Button>
<Button kind="primary">Save Changes</Button>
<Button variant="secondary">Cancel</Button>
<Button kind="critical" leftIcon={<Trash2 size={16} />}>Delete</Button>`;

const ButtonGroupDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Button Groups"
        description="Common action button combinations"
    >
        <div className="flex flex-wrap items-center gap-6">
            <Button kind="secondary">Preview</Button>
            <Button kind="primary">Save Changes</Button>
            <Button kind="secondary">Cancel</Button>
            <Button kind="error" leftIcon={<Trash2 size={16} />}>Delete</Button>
        </div>
    </DemoCard>
);

export default ButtonGroupDemo;
