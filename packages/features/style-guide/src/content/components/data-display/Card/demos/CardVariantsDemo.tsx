/**
 * Card Variants Demo
 */
import { Card, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Card variant="plain" style={{ padding: 'var(--spacing-4)', minWidth: 150 }}>
    <Text>Plain Card</Text>
</Card>
<Card variant="elevated" style={{ padding: 'var(--spacing-4)', minWidth: 150 }}>
    <Text>Elevated Card</Text>
</Card>
<Card variant="outlined" style={{ padding: 'var(--spacing-4)', minWidth: 150 }}>
    <Text>Outlined Card</Text>
</Card>`;

const CardVariantsDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Card Variants" description="Different visual styles">
        <div className="demo-row">
            <Card variant="plain" style={{ padding: 'var(--spacing-4)', minWidth: 150 }}>
                <Text>Plain Card</Text>
            </Card>
            <Card variant="elevated" style={{ padding: 'var(--spacing-4)', minWidth: 150 }}>
                <Text>Elevated Card</Text>
            </Card>
            <Card variant="outlined" style={{ padding: 'var(--spacing-4)', minWidth: 150 }}>
                <Text>Outlined Card</Text>
            </Card>
        </div>
    </DemoCard>
);

export default CardVariantsDemo;
