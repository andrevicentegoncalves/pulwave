/**
 * Button Sizes Demo
 * Shows all button sizes: xs, s, m, l
 */
import { Button } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Button } from '@ui';

// Size options: xs, s, m (default), l, xl
<Button size="xs">Extra Small</Button>
<Button size="s">Small</Button>
<Button size="m">Medium</Button>
<Button size="l">Large</Button>
<Button size="xl">Extra Large</Button>
<Button size="2xl">2X Large</Button>`;

const ButtonSizesDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Button Sizes"
        description="Size variants from extra small to large"
    >
        <div className="flex flex-wrap items-center gap-4">
            <Button size="xs">Extra Small</Button>
            <Button size="s">Small</Button>
            <Button size="m">Medium</Button>
            <Button size="l">Large</Button>
            <Button size="xl">Extra Large</Button>
            <Button size="2xl">2X Large</Button>
        </div>
    </DemoCard >
);

export default ButtonSizesDemo;
