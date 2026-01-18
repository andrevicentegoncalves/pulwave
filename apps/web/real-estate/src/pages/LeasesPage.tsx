/**
 * LeasesPage - Real Estate App
 * @package @pulwave/apps/real-estate
 */
import { useState } from 'react';
import {
    SectionHeader,
    Button,
    Card,
    Badge,
    VisualEffect,
    Plus,
    FileText,
    Calendar,
    DollarSign,
    User
} from '@pulwave/ui';
import { ContentLayout } from '@pulwave/widgets';

interface Lease {
    id: string;
    tenant: string;
    unit: string;
    startDate: string;
    endDate: string;
    rent: number;
    status: 'active' | 'expiring' | 'expired' | 'future';
}

const MOCK_LEASES: Lease[] = [
    { id: '1', tenant: 'Alice Freeman', unit: '101', startDate: '2025-01-01', endDate: '2025-12-31', rent: 2400, status: 'active' },
    { id: '2', tenant: 'Charlie Brown', unit: '205', startDate: '2024-06-01', endDate: '2025-05-31', rent: 1850, status: 'active' },
    { id: '3', tenant: 'Bob Smith', unit: '102', startDate: '2024-03-01', endDate: '2025-02-28', rent: 2100, status: 'expiring' },
];

export const LeasesPage = () => {
    const [leases] = useState<Lease[]>(MOCK_LEASES);

    const getStatusColor = (status: Lease['status']) => {
        switch (status) {
            case 'active': return 'success';
            case 'expiring': return 'warning';
            case 'expired': return 'error';
            case 'future': return 'info';
            default: return 'neutral';
        }
    };

    return (
        <ContentLayout className="leases-page">
            <SectionHeader
                title="Leases"
                description="Contract management and renewals"
                icon="file-text"
                actions={
                    <Button kind="primary" leftIcon={<Plus size={16} />}>
                        New Lease
                    </Button>
                }
            />

            {leases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <VisualEffect variant="ring-wave" size="l" className="mb-6" />
                    <h3 className="text-xl font-medium mb-2">No active leases</h3>
                    <p className="text-neutral-500 mb-6">Create a lease to track terms and generate invoices.</p>
                    <Button kind="primary" leftIcon={<Plus size={16} />}>New Lease</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leases.map(l => (
                        <Card key={l.id} className="relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <Badge variant="heavy" status={getStatusColor(l.status)} size="s">
                                    {l.status}
                                </Badge>
                            </div>

                            <div className="p-1 mb-4">
                                <div className="text-sm text-neutral-500 uppercase font-semibold mb-1">Unit {l.unit}</div>
                                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                                    <DollarSign size={18} className="text-neutral-400" aria-hidden="true" />
                                    {l.rent.toLocaleString()}/mo
                                </h3>
                            </div>

                            <div className="space-y-3 py-4 border-t border-neutral-100">
                                <div className="flex items-center gap-3 text-sm text-neutral-600">
                                    <User size={16} className="text-neutral-400" aria-hidden="true" />
                                    <span className="font-medium text-neutral-900">{l.tenant}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-neutral-600">
                                    <Calendar size={16} className="text-neutral-400" aria-hidden="true" />
                                    <span>{l.startDate} — {l.endDate}</span>
                                </div>
                            </div>

                            <div className="pt-4 mt-2 border-t border-neutral-100 w-full">
                                <Button kind="secondary" className="w-full">View Agreement</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </ContentLayout>
    );
};

export default LeasesPage;
