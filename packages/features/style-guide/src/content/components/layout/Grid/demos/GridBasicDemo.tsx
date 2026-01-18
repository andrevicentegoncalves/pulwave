/**
 * Grid Basic Demo
 */
import { Grid, Box } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Grid columns={3} gap={4}>
    <BoxItem />
    <BoxItem />
    <BoxItem />
    <BoxItem />
    <BoxItem />
    <BoxItem />
</Grid>`;

const BoxItem = () => (
    <Box padding={4} style={{ backgroundColor: '#e0e0e0', height: 80 }} />
);

const GridBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Grid" description="2D grid layout">
        <Grid columns={3} gap={4}>
            <BoxItem />
            <BoxItem />
            <BoxItem />
            <BoxItem />
            <BoxItem />
            <BoxItem />
        </Grid>
    </DemoCard>
);

export default GridBasicDemo;
