/**
 * Button States Demo
 * Shows disabled and loading states
 */
import { Button } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';
import demoCode from './ButtonStatesDemo.tsx?raw';

const codeUsage = `import { Button } from '@ui';

// Default enabled state
<Button>Default</Button>

// Disabled state (prevents interaction)
<Button disabled>Disabled</Button>

// Loading state (shows spinner, disables interaction)
<Button loading>Loading</Button>`;

const ButtonStatesDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Button States"
        description="Disabled and loading interactive states"
    >
        <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
        </div>
    </DemoCard>
);

export default ButtonStatesDemo;
