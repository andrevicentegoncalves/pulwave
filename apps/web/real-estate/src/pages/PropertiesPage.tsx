/**
 * PropertiesPage - Real Estate App
 * @package @pulwave/apps/real-estate
 */
import { Suspense } from 'react';
import {
    SectionHeader,
    Button,
    Card,
    Skeleton,
    VisualEffect,
    Icon,
    Badge,
    Plus,
    Building2,
    MapPin,
    Home
} from '@pulwave/ui';
import { ContentLayout } from '@pulwave/widgets';

import { usePropertiesSuspense } from '@pulwave/entity-property';
import '../styles/property/_index.scss';

interface Property {
    id: string;
    name: string;
    address: string;
    units: number;
    status: 'Active' | 'Maintenance' | 'Vacant';
    image?: string;
}

/** Skeleton fallback for Suspense */
const PropertiesListSkeleton = () => (
    <div className="properties-grid">
        {[1, 2, 3].map(i => (
            <Card key={i}>
                <div className="p-4 flex gap-4">
                    <Skeleton variant="rectangular" width={60} height={60} />
                    <div className="flex-1">
                        <Skeleton variant="text" width="60%" className="mb-2" />
                        <Skeleton variant="text" width="40%" />
                    </div>
                </div>
            </Card>
        ))}
    </div>
);

/** Properties list component (suspended) */
const PropertiesList = () => {
    const { properties } = usePropertiesSuspense();

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Active': return 'success';
            case 'Maintenance': return 'warning';
            case 'Vacant': return 'neutral';
            default: return 'neutral';
        }
    };

    if (properties.length === 0) {
        return (
            <div className="properties-page__empty">
                <VisualEffect variant="ring-wave" size="l" className="mb-6" />
                <h3 className="text-xl font-medium mb-2">No properties yet</h3>
                <p className="mb-6 max-w-md">Add your first property to start tracking units, tenants, and maintenance requests.</p>
                <Button kind="primary" leftIcon={<Plus size={16} />}>Add Your First Property</Button>
            </div>
        );
    }

    return (
        <div className="properties-grid">
            {properties.map(p => (
                <Card key={p.id} className="property-card h-full">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-primary-50 rounded-lg text-primary-600" aria-hidden="true">
                                <Building2 size={24} />
                            </div>
                            <Badge status={getStatusVariant(p.status)} variant="light" size="s">
                                {p.status}
                            </Badge>
                        </div>

                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">{p.name}</h3>
                        <div className="flex items-center text-sm text-neutral-500 mb-4 gap-2">
                            <MapPin size={14} aria-hidden="true" />
                            {p.address}
                        </div>

                        <div className="mt-auto pt-4 border-t border-neutral-100 flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2 text-neutral-600">
                                <Home size={16} aria-hidden="true" />
                                <span className="font-medium">{p.units} Units</span>
                            </div>
                            <Button variant="text" size="s">View Details</Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

/** Main page component with Suspense boundary */
export const PropertiesPage = () => {
    return (
        <ContentLayout className="properties-page">
            {/* Page shell - shows immediately */}
            <SectionHeader
                title="Properties"
                description="Manage your real estate assets"
                icon="building"
                actions={
                    <Button kind="primary" leftIcon={<Plus size={16} />}>
                        Add Property
                    </Button>
                }
            />

            {/* Data-dependent content - suspended until loaded */}
            <Suspense fallback={<PropertiesListSkeleton />}>
                <PropertiesList />
            </Suspense>
        </ContentLayout>
    );
};

export default PropertiesPage;
