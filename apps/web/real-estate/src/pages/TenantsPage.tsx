/**
 * TenantsPage - Real Estate App
 * @package @pulwave/apps/real-estate
 */
import { useState } from 'react';
import {
    SectionHeader,
    Button,
    Card,
    Badge,
    VisualEffect,
    Icon,
    Avatar,
    Plus,
    Users,
    Search,
    MoreHorizontal,
    Phone,
    Mail
} from '@pulwave/ui';
import { ContentLayout } from '@pulwave/widgets';

interface Tenant {
    id: string;
    name: string;
    unit: string;
    status: 'active' | 'pending' | 'former';
    email: string;
    phone: string;
    avatar?: string;
}

const MOCK_TENANTS: Tenant[] = [
    { id: '1', name: 'Alice Freeman', unit: '101', status: 'active', email: 'alice@example.com', phone: '(555) 123-4567' },
    { id: '2', name: 'Bob Smith', unit: '102', status: 'pending', email: 'bob@example.com', phone: '(555) 987-6543' },
    { id: '3', name: 'Charlie Brown', unit: '205', status: 'active', email: 'charlie@example.com', phone: '(555) 456-7890' },
];

export const TenantsPage = () => {
    const [tenants] = useState<Tenant[]>(MOCK_TENANTS);

    const getStatusVariant = (status: Tenant['status']) => {
        switch (status) {
            case 'active': return 'success';
            case 'pending': return 'warning';
            case 'former': return 'neutral';
            default: return 'neutral';
        }
    };

    return (
        <ContentLayout className="tenants-page">
            <SectionHeader
                title="Tenants"
                description="Manage residential and commercial tenants"
                icon="users"
                actions={
                    <Button kind="primary" leftIcon={<Plus size={16} />}>
                        Add Tenant
                    </Button>
                }
            />

            {tenants.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <VisualEffect variant="ring-wave" size="l" className="mb-6" />
                    <h3 className="text-xl font-medium mb-2">No tenants found</h3>
                    <p className="text-neutral-500 mb-6">Add tenants to assign them to units and manage leases.</p>
                    <Button kind="primary" leftIcon={<Plus size={16} />}>Add Tenant</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {tenants.map(t => (
                        <Card key={t.id} variant="elevated">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-3 items-center">
                                    <Avatar size="m" src={t.avatar} fallback={t.name[0]} />
                                    <div>
                                        <h3 className="font-semibold text-neutral-900">{t.name}</h3>
                                        <p className="text-sm text-neutral-500">Unit {t.unit}</p>
                                    </div>
                                </div>
                                <Badge status={getStatusVariant(t.status)} variant="light" size="s">
                                    {t.status}
                                </Badge>
                            </div>

                            <div className="flex flex-col gap-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                    <Mail size={14} className="text-neutral-400" aria-hidden="true" />
                                    {t.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                    <Phone size={14} className="text-neutral-400" aria-hidden="true" />
                                    {t.phone}
                                </div>
                            </div>

                            <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                                <Button variant="text" size="s">Details</Button>
                                <Button kind="secondary" size="s">Message</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </ContentLayout>
    );
};

export default TenantsPage;
