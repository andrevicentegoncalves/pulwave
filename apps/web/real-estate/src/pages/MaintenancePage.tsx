/**
 * MaintenancePage - Real Estate App
 * @package @pulwave/apps/real-estate
 */
import { useState } from 'react';
import {
    SectionHeader,
    Button,
    Card,
    Badge,
    VisualEffect,
    Tabs,
    TabPanel,
    Plus,
    Wrench,
    Clock,
    CheckCircle,
    AlertTriangle
} from '@pulwave/ui';
import { ContentLayout } from '@pulwave/widgets';

interface MaintenanceRequest {
    id: string;
    title: string;
    unit: string;
    status: 'open' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    date: string;
}

const MOCK_REQUESTS: MaintenanceRequest[] = [
    { id: '1', title: 'Leaking Faucet', unit: '101', status: 'open', priority: 'medium', date: '2 hours ago' },
    { id: '2', title: 'Broken AC Unit', unit: 'PH-01', status: 'in_progress', priority: 'urgent', date: '1 day ago' },
    { id: '3', title: 'Light Bulb Replacement', unit: 'Lobby', status: 'completed', priority: 'low', date: '3 days ago' },
];

export const MaintenancePage = () => {
    const [requests] = useState<MaintenanceRequest[]>(MOCK_REQUESTS);
    const [activeTab, setActiveTab] = useState(0);

    const getPriorityColor = (priority: MaintenanceRequest['priority']) => {
        switch (priority) {
            case 'urgent': return 'error';
            case 'high': return 'warning';
            case 'medium': return 'info';
            case 'low': return 'neutral';
        }
    };

    const getStatusIcon = (status: MaintenanceRequest['status']) => {
        switch (status) {
            case 'open': return <AlertTriangle size={16} />;
            case 'in_progress': return <Clock size={16} />;
            case 'completed': return <CheckCircle size={16} />;
        }
    };

    return (
        <ContentLayout className="maintenance-page">
            <SectionHeader
                title="Maintenance"
                description="Track and manage service requests"
                icon="wrench"
                actions={
                    <Button kind="primary" icon={<Plus size={16} />}>
                        New Request
                    </Button>
                }
            />

            <div className="mb-6">
                <Tabs defaultTab={activeTab} onChange={setActiveTab} variant="pills">
                    <TabPanel label="All Requests" />
                    <TabPanel label="Open" />
                    <TabPanel label="In Progress" />
                    <TabPanel label="Completed" />
                </Tabs>
            </div>

            {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <VisualEffect variant="ring-wave" size="l" className="mb-6" />
                    <h3 className="text-xl font-medium mb-2">No maintenance requests</h3>
                    <p className="text-neutral-500 mb-6">Create a request to start tracking maintenance work.</p>
                    <Button kind="primary" leftIcon={<Plus size={16} />}>New Request</Button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {requests.map(r => (
                        <Card key={r.id} className="hover:border-primary-200 transition-colors cursor-pointer">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg bg-neutral-100 text-neutral-600`} aria-hidden="true">
                                        {getStatusIcon(r.status)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900">{r.title}</h3>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-neutral-500">
                                            <span>Unit {r.unit}</span>
                                            <span>•</span>
                                            <span>{r.date}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Badge variant="light" status={getPriorityColor(r.priority)}>
                                        {r.priority.toUpperCase()}
                                    </Badge>
                                    <div className={`px-2 py-1 rounded text-xs font-medium uppercase bg-neutral-100 text-neutral-600`}>
                                        {r.status.replace('_', ' ')}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </ContentLayout>
    );
};

export default MaintenancePage;
