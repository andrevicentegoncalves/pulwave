import { Card, Button, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Card
    header="Card Title"
    footer={
        <Button variant="primary" size="s">Action</Button>
    }
>
    <Text>This is a basic card component. It acts as a container for distinct content groupings.</Text>
</Card>`;

const CardBasicDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Basic Card" description="Standard card layout">
            <Card
                header="Card Title"
                footer={
                    <Button kind="primary" size="s">Action</Button>
                }
            >
                <Text>This is a basic card component. It acts as a container for distinct content groupings.</Text>
            </Card>
        </DemoCard>
    );
};

export default CardBasicDemo;
