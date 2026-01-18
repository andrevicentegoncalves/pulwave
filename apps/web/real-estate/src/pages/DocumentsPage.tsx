/**
 * DocumentsPage - Real Estate App
 * @package @pulwave/apps/real-estate
 */
import { useState } from 'react';
import {
    SectionHeader,
    Button,
    Card,
    Select,
    VisualEffect,
    Badge,
    Upload,
    FileText,
    File,
    Download,
    Search
} from '@pulwave/ui';
import { ContentLayout } from '@pulwave/widgets';

interface Document {
    id: string;
    name: string;
    type: 'Lease' | 'Invoice' | 'Report' | 'Contract';
    size: string;
    date: string;
}

const MOCK_DOCS: Document[] = [
    { id: '1', name: 'Lease Agreement - Unit 101', type: 'Lease', size: '2.4 MB', date: '2024-01-15' },
    { id: '2', name: 'Invoice #4023', type: 'Invoice', size: '156 KB', date: '2024-02-01' },
    { id: '3', name: 'Q1 Financial Report', type: 'Report', size: '1.1 MB', date: '2024-04-10' },
];

export const DocumentsPage = () => {
    const [docs] = useState<Document[]>(MOCK_DOCS);
    const [filter, setFilter] = useState('All');

    const getTypeColor = (type: Document['type']) => {
        switch (type) {
            case 'Lease': return 'primary';
            case 'Invoice': return 'warning';
            case 'Report': return 'info';
            case 'Contract': return 'success';
            default: return 'neutral';
        }
    };

    return (
        <ContentLayout className="documents-page">
            <SectionHeader
                title="Documents"
                description="Manage files and contracts"
                icon="file-text"
                actions={
                    <Button kind="primary" icon={<Upload size={16} />}>
                        Upload
                    </Button>
                }
            />

            <div className="mb-6 max-w-xs">
                <Select
                    label="Filter by Type"
                    value={filter}
                    onChange={setFilter}
                    options={[
                        { value: 'All', label: 'All Documents' },
                        { value: 'Lease', label: 'Leases' },
                        { value: 'Invoice', label: 'Invoices' },
                        { value: 'Report', label: 'Reports' },
                    ]}
                    fullWidth
                />
            </div>

            {docs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <VisualEffect variant="ring-wave" size="l" className="mb-6" />
                    <h3 className="text-xl font-medium mb-2">No documents</h3>
                    <p className="text-neutral-500 mb-6">Upload documents to share with tenants or for record keeping.</p>
                    <Button kind="primary" icon={<Upload size={16} />}>Upload Document</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {docs.map(doc => (
                        <Card key={doc.id} className="group hover:scale-[1.01] transition-transform duration-200">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg bg-neutral-50 text-neutral-600`} aria-hidden="true">
                                    <FileText size={24} />
                                </div>
                                <Badge variant="light" status={getTypeColor(doc.type) as any} size="s">
                                    {doc.type}
                                </Badge>
                            </div>

                            <h3 className="font-semibold text-neutral-900 mb-1 truncate" title={doc.name}>{doc.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
                                <span>{doc.size}</span>
                                <span>•</span>
                                <span>{doc.date}</span>
                            </div>

                            <div className="pt-4 border-t border-neutral-100 flex gap-2">
                                <Button kind="secondary" size="s" className="flex-1" icon={<Download size={14} />}>
                                    Download
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </ContentLayout>
    );
};

export default DocumentsPage;
