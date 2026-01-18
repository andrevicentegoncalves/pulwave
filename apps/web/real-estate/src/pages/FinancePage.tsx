/**
 * FinancePage - Real Estate App
 * @package @pulwave/apps/real-estate
 */
import {
    SectionHeader,
    Button,
    Card,
    Badge,
    VisualEffect,
    Icon,
    DollarSign,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Download
} from '@pulwave/ui';
import { ContentLayout } from '@pulwave/widgets';

export const FinancePage = () => {
    return (
        <ContentLayout className="finance-page">
            <SectionHeader
                title="Finance"
                description="Financial overview and reports"
                icon="dollar-sign"
                actions={
                    <Button kind="secondary" icon={<Download size={16} />}>
                        Export Report
                    </Button>
                }
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-primary-500 text-white border-none py-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm" aria-hidden="true">
                            <DollarSign size={24} className="text-white" />
                        </div>
                        <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded text-white flex items-center gap-1">
                            <TrendingUp size={12} aria-hidden="true" /> +12%
                        </span>
                    </div>
                    <div>
                        <p className="text-primary-100 text-sm font-medium mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-bold">$124,500</h3>
                    </div>
                </Card>

                <Card className="py-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-error-50 rounded-lg text-error-600" aria-hidden="true">
                            <ArrowDownRight size={24} />
                        </div>
                        <span className="text-xs font-medium bg-error-50 text-error-700 px-2 py-1 rounded flex items-center gap-1">
                            <TrendingUp size={12} aria-hidden="true" /> +5%
                        </span>
                    </div>
                    <div>
                        <p className="text-neutral-500 text-sm font-medium mb-1">Expenses</p>
                        <h3 className="text-3xl font-bold text-neutral-900">$42,300</h3>
                    </div>
                </Card>

                <Card className="py-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-warning-50 rounded-lg text-warning-600" aria-hidden="true">
                            <ClockIcon />
                        </div>
                    </div>
                    <div>
                        <p className="text-neutral-500 text-sm font-medium mb-1">Outstanding Rent</p>
                        <h3 className="text-3xl font-bold text-neutral-900">$3,450</h3>
                    </div>
                </Card>
            </div>

            {/* Recent Transactions */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-neutral-900">Recent Transactions</h3>
                    <Button variant="text" size="s">View All</Button>
                </div>

                <Card className="p-0 overflow-hidden">
                    <div className="divide-y divide-neutral-100">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i % 2 === 0 ? 'bg-error-50 text-error-600' : 'bg-success-50 text-success-600'}`} aria-hidden="true">
                                        {i % 2 === 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900">{i % 2 === 0 ? 'Plumbing Repair' : 'Rent Payment - Unit 101'}</p>
                                        <p className="text-xs text-neutral-500">Today, 2:30 PM</p>
                                    </div>
                                </div>
                                <span className={`font-semibold ${i % 2 === 0 ? 'text-neutral-900' : 'text-success-600'}`}>
                                    {i % 2 === 0 ? '-' : '+'}${Math.floor(Math.random() * 2000) + 500}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </ContentLayout>
    );
};

const ClockIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

export default FinancePage;
