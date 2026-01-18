/**
 * AssetsPage - Real Estate App
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
    Box,
    Tag,
    DollarSign,
    Calendar
} from '@pulwave/ui';
import { ContentLayout } from '@pulwave/widgets';

interface Asset {
    id: string;
    name: string;
    category: string;
    value: number;
    purchaseDate: string;
    status: 'good' | 'repair' | 'retired';
}

const MOCK_ASSETS: Asset[] = [
    { id: '1', name: 'Industrial HVAC Unit #4', category: 'Equipment', value: 12500, purchaseDate: '2023-05-10', status: 'good' },
    { id: '2', name: 'Lobby Furniture Set', category: 'Furniture', value: 3500, purchaseDate: '2022-11-20', status: 'repair' },
    { id: '3', name: 'Maintenance Golf Cart', category: 'Vehicle', value: 4200, purchaseDate: '2021-08-15', status: 'good' },
];

export const AssetsPage = () => {
    const [assets] = useState<Asset[]>(MOCK_ASSETS);

    const getStatusColor = (status: Asset['status']) => {
        switch (status) {
            case 'good': return 'success';
            case 'repair': return 'warning';
            case 'retired': return 'neutral';
            default: return 'neutral';
        }
    };

    return (
        <ContentLayout className="assets-page">
            <SectionHeader
                title="Assets"
                description="Track equipment and inventory"
                icon="box"
                actions={
                    <Button kind="primary" leftIcon={<Plus size={16} />}>
                        Add Asset
                    </Button>
                }
            />

            {assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <VisualEffect variant="ring-wave" size="l" className="mb-6" />
                    <h3 className="text-xl font-medium mb-2">No assets tracked</h3>
                    <p className="text-neutral-500 mb-6">Start tracking valuable assets and equipment.</p>
                    <Button kind="primary" leftIcon={<Plus size={16} />}>Add Asset</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assets.map(asset => (
                        <Card key={asset.id}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-neutral-100 text-neutral-600 rounded-lg" aria-hidden="true">
                                    <Box size={24} />
                                </div>
                                <Badge status={getStatusColor(asset.status)} variant="light" size="s">
                                    {asset.status.toUpperCase()}
                                </Badge>
                            </div>

                            <h3 className="text-lg font-semibold text-neutral-900 mb-1">{asset.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
                                <Tag size={14} aria-hidden="true" />
                                {asset.category}
                            </div>

                            <div className="space-y-2 pt-4 border-t border-neutral-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500">Value</span>
                                    <span className="font-medium text-neutral-900">${asset.value.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500">Purchased</span>
                                    <span className="font-medium text-neutral-900">{asset.purchaseDate}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </ContentLayout>
    );
};

export default AssetsPage;
