/**
 * Label Basic Demo
 */
import { Label } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';
import demoCode from './LabelDemo.tsx?raw';

const LabelDemo = () => (
    <DemoCard sourceCode={demoCode} showSourceToggle={true}
        title="Label Variants"
        description="Labels with required, optional, and description"
    >
        <>
            <Label>Default Label</Label>
            <Label required>Required Field</Label>
            <Label optional>Optional Field</Label>
            <Label description="This is helper text for the field.">With Description</Label>
        </>
    </DemoCard>
);

export default LabelDemo;
