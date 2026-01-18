import { Card, Stack, Button, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Card
    onClick={() => alert('Card clicked!')}
    variant="elevated"
    header="Interactive Card"
>
    <Text>This card is clickable. Hover over it to see the elevation lift effect.</Text>
</Card>

// Compound Component Usage
<Card padding="none">
    <Card.Header>
        <Text category="title" size="m">Header Section</Text>
    </Card.Header>
    <Card.Body className="p-6">
        <Text>Body Section: Contains the main content.</Text>
    </Card.Body>
    <Card.Footer>
        <Button variant="ghost" size="s">Footer Action</Button>
    </Card.Footer>
</Card>`;

const CardStructureDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Card Structure" description="Examples of card interactions and slots">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', width: '100%' }}>
                <Card
                    onClick={() => alert('Card clicked!')}
                    variant="elevated"
                    header="Interactive Card"
                >
                    <Text>This card is clickable. Hover over it to see the elevation lift effect.</Text>
                </Card>

                <Card
                    header="Header Section"
                    footer={<Button variant="ghost" size="s">Footer Action</Button>}
                >
                    <Text>Body Section: Contains the main content.</Text>
                </Card>
            </div>
        </DemoCard>
    );
};

export default CardStructureDemo;

