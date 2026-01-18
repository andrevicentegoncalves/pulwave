/**
 * CondominiumsPage - Real Estate App
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
    Building,
    MapPin,
    Users
} from '@pulwave/ui';
import { ContentLayout } from '@pulwave/widgets';

interface Condominium {
    id: string;
    name: string;
    address: string;
    units: number;
    manager: string;
    status: 'active' | 'maintenance';
}

const MOCK_CONDOS: Condominium[] = [
    { id: '1', name: 'Sunset Towers', address: '88 Sunset Blvd', units: 120, manager: 'John Doe', status: 'active' },
    { id: '2', name: 'Ocean View Heights', address: '42 Coastal Way', units: 45, manager: 'Jane Smith', status: 'maintenance' },
];

export const CondominiumsPage = () => {
    const [condos] = useState<Condominium[]>(MOCK_CONDOS);

    return (
        <ContentLayout className="condominiums-page">
            <SectionHeader
                title="Condominiums"
                description="Manage multi-unit properties"
                icon="building-2"
                actions={
                    <Button kind="primary" leftIcon={<Plus size={16} />}>
                        Add Condominium
                    </Button>
                }
            />

            {condos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <VisualEffect variant="ring-wave" size="l" className="mb-6" />
                    <h3 className="text-xl font-medium mb-2">No condominiums</h3>
                    <p className="text-neutral-500 mb-6">Add a condominium complex to manage units and common areas.</p>
                    <Button kind="primary" leftIcon={<Plus size={16} />}>Add Condominium</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {condos.map(c => (
                        <Card key={c.id}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-primary-50 rounded-lg text-primary-600" aria-hidden="true">
                                    <Building size={24} />
                                </div>
                                <Badge status={c.status === 'active' ? 'success' : 'warning'} variant="light" size="s">
                                    {c.status}
                                </Badge>
                            </div>

                            <h3 className="text-lg font-semibold text-neutral-900 mb-1">{c.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
                                <MapPin size={14} aria-hidden="true" />
                                {c.address}
                            </div>

                            <div className="pt-4 border-t border-neutral-100 grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-neutral-500 uppercase">Units</span>
                                    <p className="font-semibold text-neutral-900">{c.units}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-neutral-500 uppercase">Manager</span>
                                    <p className="font-semibold text-neutral-900">{c.manager}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </ContentLayout>
    );
};

export default CondominiumsPage;
