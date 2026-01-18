import { CardGrid, Card, Text, Button } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<CardGrid>
    <Card title="Short Content">
        <Text>Minimal content here.</Text>
    </Card>
    <Card title="Long Content" style={{ minHeight: '300px' }}>
        <Text>This card has forced height to show vertical expansion.</Text>
        <Text>More text...</Text>
    </Card>
    <Card title="Mixed Content">
        <Text>Text content</Text>
        <Button>Action</Button>
    </Card>
</CardGrid>`;

const CardGridContentDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Card Grid Content Sizing" description="Validates that cards expand with content and grid fills available space.">
        <CardGrid>
            {/* Short Card */}
            <Card title="Short Content">
                <Text>This card should shrink to fit or fill the grid column minimum.</Text>
            </Card>

            {/* Long Content Card */}
            <Card title="Long Content">
                <Text>
                    This is a paragraph with more text to demonstrate how the card expands vertically to fit the content.
                    It should not overflow or truncate. The grid row will adapt to the tallest card in the row (stretch behavior)
                    or the card will just grow if alignment is not stretched.
                </Text>
                <div style={{ marginTop: '1rem', height: '100px', background: '#f0f0f0' }}>Placeholder Image</div>
            </Card>

            {/* Wide Content Card? Grid columns constrained it, but implicit height grows */}
            <Card title="Mixed Content">
                <Text className="mb-4">Contains button and text.</Text>
                <Button>Action Button</Button>
            </Card>

            {/* Just Another Card */}
            <Card title="Card 4">
                <Text>Standard card content.</Text>
            </Card>

            {/* Card 5 */}
            <Card title="Card 5">
                <Text>Standard card content.</Text>
            </Card>
        </CardGrid>
    </DemoCard>
);

export default CardGridContentDemo;
