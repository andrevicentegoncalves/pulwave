/**
 * Button with Icons Demo
 * Shows buttons with leading, trailing, and both icons
 */
import { Button } from '@ui';
import { Plus, ArrowRight, Download } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Button } from '@ui';
import { Plus, ArrowRight, Download } from '@pulwave/ui';

// Leading icon (leftIcon prop)
<Button leftIcon={<Plus size={16} />}>Add Item</Button>

// Trailing icon (rightIcon prop)
<Button rightIcon={<ArrowRight size={16} />}>Continue</Button>

// Both icons
<Button leftIcon={<Download size={16} />} rightIcon={<ArrowRight size={16} />}>
    Download
</Button>`;

const ButtonWithIconsDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Buttons with Icons"
        description="Leading and trailing icon combinations"
    >
        <div className="flex flex-wrap gap-4">
            <Button leftIcon={<Plus size={16} />}>Add Item</Button>
            <Button rightIcon={<ArrowRight size={16} />}>Continue</Button>
            <Button leftIcon={<Download size={16} />} rightIcon={<ArrowRight size={16} />}>
                Download
            </Button>
        </div>
    </DemoCard>
);

export default ButtonWithIconsDemo;
