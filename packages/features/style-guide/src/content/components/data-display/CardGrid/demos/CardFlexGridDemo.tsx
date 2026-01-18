import { CardFlexGrid, Card, Text, Button } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<CardFlexGrid gap="var(--space-4)">
    <Card title="Small Card" style={{ width: '200px' }}>
        <Text>Fixed width 200px</Text>
    </Card>
    <Card title="Wide Card" style={{ width: '400px' }}>
        <Text>Fixed width 400px</Text>
    </Card>
    <Card title="Auto Card">
        <Text>This card has auto width.</Text>
    </Card>
</CardFlexGrid>`;

const CardFlexGridDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Card Flex Grid" description="Uses Flexbox to allow independent content-driven card widths.">
        <CardFlexGrid>
            {/* Row 1: Mixed fixed widths */}
            <Card title="Fixed 250px" style={{ width: '250px' }}>
                <Text>Card 1</Text>
            </Card>
            <Card title="Fixed 350px" style={{ width: '350px' }}>
                <Text>Card 2</Text>
            </Card>
            <Card title="Fixed 200px" style={{ width: '200px' }}>
                <Text>Card 3</Text>
            </Card>

            {/* Row 2: Flow of auto-width cards */}
            <Card title="Short">
                <Text>Small content.</Text>
            </Card>
            <Card title="Medium Auto">
                <Text>Medium length content.</Text>
            </Card>
            <Card title="Short">
                <Text>Tiny.</Text>
            </Card>
            <Card title="Medium Auto">
                <Text>Another medium one.</Text>
            </Card>
            <Card title="Long Auto">
                <Text>This is a much longer card that will take up more space and potentially wrap.</Text>
            </Card>

            {/* Row 3: More wrapping */}
            <Card title="Fixed 300px" style={{ width: '300px' }}>
                <Text>Fixed width 300px.</Text>
            </Card>
            <Card title="Fixed 250px" style={{ width: '250px' }}>
                <Text>Card 8</Text>
            </Card>
            <Card title="Fixed 250px" style={{ width: '250px' }}>
                <Text>Card 9</Text>
            </Card>
            <Card title="Fixed 150px" style={{ width: '150px' }}>
                <Text>Tiny fixed</Text>
            </Card>
            <Card title="Auto">
                <Text>Auto sizing</Text>
            </Card>
            <Card title="Auto">
                <Text>More auto sizing</Text>
            </Card>
        </CardFlexGrid>
    </DemoCard>
);

export default CardFlexGridDemo;
