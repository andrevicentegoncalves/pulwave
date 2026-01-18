/**
 * Inline Basic Demo
 */
import { Inline, Badge } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Inline gap={2}>
    <Badge>Tag 1</Badge>
    <Badge>Tag 2</Badge>
    <Badge>Tag 3</Badge>
    <Badge>Tag 4</Badge>
    <Badge>Tag 5</Badge>
</Inline>`;

const InlineBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Inline" description="Horizontal list with wrapping">
        <Inline gap={2}>
            <Badge>Tag 1</Badge>
            <Badge>Tag 2</Badge>
            <Badge>Tag 3</Badge>
            <Badge>Tag 4</Badge>
            <Badge>Tag 5</Badge>
        </Inline>
    </DemoCard>
);

export default InlineBasicDemo;
