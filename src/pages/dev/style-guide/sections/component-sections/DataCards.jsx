import React from 'react';
import { StatCard, KpiCard, CardGrid } from '../../../../../components/ui';
import { Users, DollarSign, Activity, TrendingUp, ShoppingCart, Eye } from '../../../../../components/ui/iconLibrary';

export default function DataCards() {
    return (
        <div className="space-y-12">
            {/* KPI Cards Section */}
            <div>
                <h3 className="text-lg font-medium mb-4">KPI Cards</h3>
                <p className="text-muted-foreground mb-6">
                    Compact cards for displaying key performance indicators with color coding.
                </p>

                <CardGrid columns={4}>
                    <KpiCard
                        label="Total Users"
                        value="1,234"
                        icon={<Users />}
                        colorScheme="primary"
                        subtext="+12% vs last month"
                    />
                    <KpiCard
                        label="Revenue"
                        value="$45.2k"
                        icon={<DollarSign />}
                        colorScheme="success"
                        subtext="+5.4% vs last month"
                    />
                    <KpiCard
                        label="Bounce Rate"
                        value="42.3%"
                        icon={<Activity />}
                        colorScheme="warning"
                        subtext="-2.1% improvement"
                    />
                    <KpiCard
                        label="Active Sessions"
                        value="892"
                        icon={<Eye />}
                        colorScheme="secondary"
                    />
                </CardGrid>

                <div className="mt-8">
                    <h4 className="text-sm font-medium mb-4 text-muted-foreground">Loading State</h4>
                    <CardGrid columns={4}>
                        <KpiCard
                            label="Loading Metric"
                            value="0"
                            icon={<Users />}
                            loading
                        />
                    </CardGrid>
                </div>
            </div>

            {/* Stat Cards Section */}
            <div>
                <h3 className="text-lg font-medium mb-4">Stat Cards</h3>
                <p className="text-muted-foreground mb-6">
                    Standard statistics display with varied visual weight.
                </p>

                <CardGrid columns={3}>
                    <StatCard
                        label="Total Sales"
                        value="$124,592"
                        icon={<ShoppingCart />}
                        variant="primary"
                        subtext="Lifetime volume"
                    />
                    <StatCard
                        label="Growth"
                        value="+24.5%"
                        icon={<TrendingUp />}
                        variant="success"
                        subtext="Year over Year"
                    />
                    <StatCard
                        label="Pending Orders"
                        value="15"
                        icon={<Activity />}
                        variant="warning"
                        subtext="Requires attention"
                    />
                </CardGrid>
            </div>
        </div>
    );
}
