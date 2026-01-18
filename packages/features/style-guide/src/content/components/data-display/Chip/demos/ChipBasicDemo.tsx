/**
 * Chip Basic Demo
 * Shows Chip variants
 */
import { Chip } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Chip>Default</Chip>
<Chip variant="filled">Filled</Chip>
<Chip variant="outline">Outline</Chip>`;

const ChipBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Chip Variants"
        description="Basic chip styles"
    >
        <>
            <Chip>Default</Chip>
            <Chip variant="filled">Filled</Chip>
            <Chip variant="outline">Outline</Chip>
        </>
    </DemoCard>
);

export default ChipBasicDemo;

