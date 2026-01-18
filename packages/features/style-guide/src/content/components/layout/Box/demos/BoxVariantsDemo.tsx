/**
 * Box Variants Demo
 */
import { Box, Stack, Text } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const BoxVariantsDemo = () => (
    <DemoCard title="Box Variants" description="Showcasing premium box styles (Card, Glass, Outlined)">
        <Stack direction="row" spacing={6} style={{ padding: '20px', background: 'url(https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=400&q=80) center/cover' }}>
            {/* Default */}
            <Box padding={4} background="surface" borderRadius="m">
                <Text>Default Box</Text>
            </Box>

            {/* Card */}
            <Box variant="card" padding={4} borderRadius="m" interactive>
                <Text weight="bold">Interactive Card</Text>
                <Text size="s" color="muted">Hover me!</Text>
            </Box>

            {/* Glass */}
            <Box variant="glass" padding={4} borderRadius="m">
                <Text weight="bold">Glass Effect</Text>
                <Text size="s">Modern translucency</Text>
            </Box>

            {/* Outlined */}
            <Box variant="outlined" padding={4} borderRadius="m" background="surface">
                <Text>Outlined</Text>
            </Box>
        </Stack>
    </DemoCard>
);

export default BoxVariantsDemo;
