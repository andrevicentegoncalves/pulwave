import { KpiCard, Grid, DollarSign, Users, TrendingUp } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<KpiCard
    title="Total Revenue"
    value="$1.2M"
    trend={{ value: 12, isPositive: true, label: 'vs last month' }}
    icon={<DollarSign />}
/>
<KpiCard
    title="Active Users"
    value="4,500"
    trend={{ value: 5, isPositive: false, label: 'vs last week' }}
    icon={<Users />}
/>
<KpiCard
    title="Growth Rate"
    value="18%"
    icon={<TrendingUp />}
/>`;

const KpiCardBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="KPI Card" description="Displaying key performance indicators">
        <Grid columns={3} gap={4}>
            <KpiCard
                title="Total Revenue"
                value="$1.2M"
                trend={{ value: 12, isPositive: true, label: 'vs last month' }}
                icon={<DollarSign />}
            />
            <KpiCard
                title="Active Users"
                value="4,500"
                trend={{ value: 5, isPositive: false, label: 'vs last week' }}
                icon={<Users />}
            />
            <KpiCard
                title="Growth Rate"
                value="18%"
                icon={<TrendingUp />}
            />
        </Grid>
    </DemoCard>
);

export default KpiCardBasicDemo;
