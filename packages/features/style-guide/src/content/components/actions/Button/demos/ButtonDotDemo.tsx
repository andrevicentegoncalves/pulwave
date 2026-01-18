/**
 * Button Dot Demo
 * Shows dot shape buttons for color swatches and status indicators
 */
import { Button } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Button } from '@ui';

// Dot buttons for color swatches - all available kinds
<Button shape="dot" kind="primary" variant="filled" />
<Button shape="dot" kind="secondary" variant="filled" />
<Button shape="dot" kind="tertiary" variant="filled" />
<Button shape="dot" kind="neutral" variant="filled" />
<Button shape="dot" kind="success" variant="filled" />
<Button shape="dot" kind="warning" variant="filled" />
<Button shape="dot" kind="error" variant="filled" />
<Button shape="dot" kind="info" variant="filled" />
<Button shape="dot" kind="critical" variant="filled" />
<Button shape="dot" kind="growth" variant="filled" />
<Button shape="dot" kind="maintenance" variant="filled" />
<Button shape="dot" kind="discovery" variant="filled" />
<Button shape="dot" kind="premium" variant="filled" />
<Button shape="dot" kind="urgent" variant="filled" />
<Button shape="dot" kind="promotion" variant="filled" />`;

const colors = [
    'primary', 'secondary', 'tertiary', 'neutral',
    'success', 'warning', 'error', 'info',
    'critical', 'growth', 'maintenance', 'discovery', 'premium', 'urgent', 'promotion'
] as const;

const ButtonDotDemo = () => (
    <DemoCard
        sourceCode={codeUsage}
        showSourceToggle={true}
        title="Dot Shape"
        description="Small circular buttons for color swatches and status indicators"
    >
        <div className="flex flex-wrap gap-4">
            {colors.map((color) => (
                <Button
                    key={color}
                    shape="circle"
                    size="xs"
                    kind={color}
                    variant="filled"
                    title={color}
                    className="p-0" // Ensure no padding interferes
                />
            ))}
        </div>
    </DemoCard>
);

export default ButtonDotDemo;
