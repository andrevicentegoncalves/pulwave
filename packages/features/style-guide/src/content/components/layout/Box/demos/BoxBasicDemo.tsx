/**
 * Box Basic Demo
 */
import { Box } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Box padding={4} style={{ backgroundColor: '#e0e0e0', borderRadius: 4 }}>
    Content inside a box with padding
</Box>`;

const BoxBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Box" description="Basic layout box">
        <Box padding={4} style={{ backgroundColor: '#e0e0e0', borderRadius: 4 }}>
            Content inside a box with padding
        </Box>
    </DemoCard>
);

export default BoxBasicDemo;
