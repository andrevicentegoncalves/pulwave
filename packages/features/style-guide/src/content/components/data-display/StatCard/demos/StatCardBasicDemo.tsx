import { StatCard, Grid } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Grid minColumnWidth={200} gap="var(--spacing-4)">
    <StatCard label="Views" value="10.5k" />
    <StatCard label="Clicks" value="2,300" />
    <StatCard label="Conversions" value="450" />
    <StatCard label="Bounce Rate" value="42%" />
</Grid>`;

const StatCardBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Stat Card" description="Simple statistic display">
        <Grid minColumnWidth={200} gap={4}>
            <StatCard label="Views" value="10.5k" />
            <StatCard label="Clicks" value="2,300" />
            <StatCard label="Conversions" value="450" />
            <StatCard label="Bounce Rate" value="42%" />
        </Grid>
    </DemoCard>
);

export default StatCardBasicDemo;
