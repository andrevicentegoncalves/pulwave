/**
 * Full Width Buttons Demo
 * Shows full-width button layout
 */
import { Button } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Button fullWidth variant="primary">Primary Full Width</Button>
<Button fullWidth variant="secondary">Secondary Full Width</Button>`;

const FullWidthButtonsDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Full Width Buttons"
        description="Buttons that expand to fill container width"
    >
        <div className="flex flex-col gap-4 w-full">
            <Button fullWidth kind="primary">Primary Full Width</Button>
            <Button fullWidth kind="secondary">Secondary Full Width</Button>
        </div>
    </DemoCard>
);

export default FullWidthButtonsDemo;
