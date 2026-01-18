import { CardGrid, Card, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<CardGrid>
    {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} title={\`Card \${i}\`} style={{ minHeight: '150px' }}>
            <Text>Content for card {i}</Text>
        </Card>
    ))}
</CardGrid>`;

const CardGridBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Card Grid" description="Responsive layout for cards">
        <CardGrid>
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} title={`Card ${i}`} style={{ minHeight: '150px' }}>
                    <Text>Content for card {i}</Text>
                </Card>
            ))}
        </CardGrid>
    </DemoCard>
);

export default CardGridBasicDemo;
