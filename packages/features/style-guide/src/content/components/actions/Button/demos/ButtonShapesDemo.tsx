import { Button, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';
const codeUsage = `// Shapes
<Button kind="primary">Default</Button>
<Button kind="primary" shape="pill">Pill Shape</Button>
<Button kind="primary" shape="square" aria-label="Square"><span style={{ fontSize: '1.2rem' }}>+</span></Button>
<Button kind="primary" shape="circle" aria-label="Circle"><span style={{ fontSize: '1.2rem' }}>+</span></Button>`;

export const ButtonShapesDemo = () => {
    return (
        <DemoCard
            title="Shapes & Sizes"
            description="Button shape variations including default, pill, and circle/square for icons."
            sourceCode={codeUsage}
            showSourceToggle={true}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '32px' }}>
                    <div style={{ minWidth: '80px', textAlign: 'right' }}>
                        <Text size="s" color="muted" weight="medium">Default</Text>
                    </div>
                    <Button kind="primary">Default</Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '32px' }}>
                    <div style={{ minWidth: '80px', textAlign: 'right' }}>
                        <Text size="s" color="muted" weight="medium">Pill</Text>
                    </div>
                    <Button kind="primary" shape="pill">Pill Shape</Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '32px' }}>
                    <div style={{ minWidth: '80px', textAlign: 'right' }}>
                        <Text size="s" color="muted" weight="medium">Square</Text>
                    </div>
                    <Button kind="primary" shape="square" aria-label="Square">
                        <span className="text-xl leading-none">+</span>
                    </Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '32px' }}>
                    <div style={{ minWidth: '80px', textAlign: 'right' }}>
                        <Text size="s" color="muted" weight="medium">Circle</Text>
                    </div>
                    <Button kind="primary" shape="circle" aria-label="Circle">
                        <span className="text-xl leading-none">+</span>
                    </Button>
                </div>
            </div>
        </DemoCard>
    );
};
