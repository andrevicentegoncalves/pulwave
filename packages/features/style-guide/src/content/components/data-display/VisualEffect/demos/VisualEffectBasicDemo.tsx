import { VisualEffect, Stack, Box, Text } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<VisualEffect variant="sidebar-wave" />
<VisualEffect variant="pulse-wave" />
<VisualEffect variant="ring-wave" size="xl" />`;

const VisualEffectBasicDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Visual Effects"
            description="Decorative background animations."
        >
            <Stack spacing="6">
                <Box padding={4} background="neutral-subtle" borderRadius="m" style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
                    <Text category="heading" size="m" style={{ position: 'relative', zIndex: 1 }}>Sidebar Wave</Text>
                    <VisualEffect variant="sidebar-wave" style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }} />
                </Box>

                <Box padding={4} background="surface" borderRadius="m" style={{ position: 'relative', overflow: 'hidden', height: '150px' }}>
                    <Text category="heading" size="m" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>Pulse Wave</Text>
                    <VisualEffect variant="pulse-wave" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }} />
                </Box>

                <Box padding={4} background="neutral-subtle" borderRadius="m" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <div style={{ position: 'relative' }}>
                        <VisualEffect variant="ring-wave" size="xl" />
                        <Text category="heading" size="m" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Ring Wave</Text>
                    </div>
                </Box>
            </Stack>
        </DemoCard>
    );
};

export default VisualEffectBasicDemo;
