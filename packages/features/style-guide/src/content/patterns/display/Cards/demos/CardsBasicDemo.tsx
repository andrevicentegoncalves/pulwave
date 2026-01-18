import { KpiCard, StatCard, Grid } from '@pulwave/ui';
import { DollarSign, Users, TrendingUp, Activity } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

export const CardsBasicDemo = () => {
    return (
        <DemoCard title="Metric Cards" description="KPI and Stat Cards for dashboards.">
            <Grid columns={2} gap={4}>
                <KpiCard
                    title="Total Revenue"
                    value="$45,231.89"
                    status="success"
                    icon={<DollarSign />}
                    description="+20.1% from last month"
                />
                <KpiCard
                    title="Active Users"
                    value="2,350"
                    status="primary"
                    icon={<Users />}
                    description="+180 last hour"
                />
                <StatCard
                    icon={<TrendingUp />}
                    label="Growth Rate"
                    value="12.5%"
                    subtext="Year over year"
                    variant="success"
                />
                <StatCard.Root variant="warning">
                    <StatCard.Header>
                        <StatCard.Icon variant="warning"><Activity /></StatCard.Icon>
                    </StatCard.Header>
                    <StatCard.Body>
                        <StatCard.Value>89%</StatCard.Value>
                        <StatCard.Label>System Load</StatCard.Label>
                        <StatCard.Subtext>Requires attention</StatCard.Subtext>
                    </StatCard.Body>
                </StatCard.Root>
            </Grid>
        </DemoCard>
    );
};
