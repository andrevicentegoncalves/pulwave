import { useState } from 'react';
import { DataList, Avatar, Badge, Button, Icon, Text, CircleFlag, Card, Modal } from '@pulwave/ui';
import { Mail, Phone, Pencil, X } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';
import './DataListDemo.scss';

type Lead = {
    id: string;
    name: string;
    role: string;
    bio: string;
    status: string;
    avatar: string;
    country: string;
    email: string;
};

export const DataListRichDemo = () => {
    const [items] = useState<Lead[]>([
        {
            id: '1',
            name: 'Aakruti Rastogi',
            role: 'Senior Software Engineer',
            bio: 'Leading the frontend migration team. Passionate about UI/UX and accessibility. Loves hiking and photography in her free time.',
            status: 'Warm',
            avatar: 'https://i.pravatar.cc/150?u=aakruti',
            country: 'in',
            email: 'aakruti@example.com'
        },
        {
            id: '2',
            name: 'John Smith',
            role: 'Product Owner',
            bio: 'Responsible for the roadmap and feature prioritization. 10+ years of experience in SaaS products.',
            status: 'Hot',
            avatar: 'https://i.pravatar.cc/150?u=john',
            country: 'us',
            email: 'john.smith@example.com'
        },
        {
            id: '3',
            name: 'Sarah Conner',
            role: 'DevOps Specialist',
            bio: 'Ensuring 99.99% uptime. Expert in Kubernetes and CI/CD pipelines. Currently learning Rust.',
            status: 'Cold',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
            country: 'gb',
            email: 'sarah.c@example.com'
        },
    ]);

    const [selectedItem, setSelectedItem] = useState<Lead | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Hot': return 'error';
            case 'Warm': return 'warning';
            case 'Cold': return 'info';
            default: return 'neutral';
        }
    };

    const handleItemClick = (item: Lead) => {
        setSelectedItem(item);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
    };

    const handleActionClick = (e: React.MouseEvent, action: string, item: Lead) => {
        e.stopPropagation();
        console.log(`${action} clicked for ${item.name}`);
    };

    return (
        <>
            <DemoCard title="Rich Content DataList" description="DataList with extended content. Click to see full details.">
                <Card className="demo-card-container">
                    <Card.Header>
                        <Text variant="h3">Leads</Text>
                    </Card.Header>
                    <Card.Body>
                        <DataList
                            data={items}
                            keyExtractor={(item) => item.id}
                            renderItem={(item) => (
                                <>
                                    <DataList.Content onClick={() => handleItemClick(item)}>
                                        {/* Row 1: Avatar + Name/Role */}
                                        <div className="demo-list-item__row-primary">
                                            <div className="demo-list-item__avatar">
                                                <Avatar src={item.avatar} alt={item.name} size="l" />
                                            </div>
                                            <div className="demo-list-item__details">
                                                <Text variant="body-strong">{item.name}</Text>
                                                <Text variant="small" color="muted">{item.role}</Text>
                                            </div>
                                        </div>

                                        {/* Row 2: Flag + Badge */}
                                        <div className="demo-list-item__row-meta">
                                            <div className="demo-list-item__flag">
                                                <CircleFlag countryCode={item.country} size="m" />
                                            </div>
                                            <div className="demo-list-item__status">
                                                <Badge status={getStatusColor(item.status)} variant="light" size="m">
                                                    <Badge.Text>{item.status}</Badge.Text>
                                                </Badge>
                                            </div>
                                        </div>
                                    </DataList.Content>

                                    {/* Row 3: Actions */}
                                    <DataList.Actions>
                                        <Button variant="ghost" size="s" aria-label="Email" onClick={(e) => handleActionClick(e, 'email', item)}>
                                            <Icon><Mail /></Icon>
                                        </Button>
                                        <Button variant="ghost" size="s" aria-label="Call" onClick={(e) => handleActionClick(e, 'call', item)}>
                                            <Icon><Phone /></Icon>
                                        </Button>
                                        <Button variant="ghost" size="s" aria-label="Edit" onClick={(e) => handleActionClick(e, 'edit', item)}>
                                            <Icon><Pencil /></Icon>
                                        </Button>
                                    </DataList.Actions>
                                </>
                            )}
                        />
                    </Card.Body>
                </Card>
            </DemoCard>

            {/* Detail Modal */}
            <Modal isOpen={!!selectedItem} onClose={handleCloseModal} size="m">
                {selectedItem && (
                    <>
                        <Modal.Header>
                            <Text variant="h3">Lead Details</Text>
                            <Button variant="ghost" size="s" onClick={handleCloseModal} aria-label="Close">
                                <Icon><X /></Icon>
                            </Button>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="demo-list-modal__header">
                                <div className="demo-list-modal__avatar">
                                    <Avatar src={selectedItem.avatar} alt={selectedItem.name} size="xl" />
                                </div>
                                <div className="demo-list-modal__title">
                                    <Text variant="h2">{selectedItem.name}</Text>
                                    <Text variant="body" color="muted">{selectedItem.role}</Text>
                                </div>
                            </div>

                            <div className="demo-list-modal__details">
                                <div className="demo-list-modal__row">
                                    <Text variant="small" className="demo-list-modal__label">Status</Text>
                                    <Badge status={getStatusColor(selectedItem.status)} variant="light" size="m">
                                        <Badge.Text>{selectedItem.status}</Badge.Text>
                                    </Badge>
                                </div>

                                <div className="demo-list-modal__row">
                                    <Text variant="small" className="demo-list-modal__label">Country</Text>
                                    <CircleFlag countryCode={selectedItem.country} size="m" />
                                </div>

                                <div className="demo-list-modal__row">
                                    <Text variant="small" className="demo-list-modal__label">Email</Text>
                                    <Text variant="body">{selectedItem.email}</Text>
                                </div>

                                <div style={{ marginTop: 'var(--spacing-4)' }}>
                                    <Text variant="small" color="muted" style={{ marginBottom: 'var(--spacing-2)', display: 'block' }}>Bio</Text>
                                    <Text variant="body">{selectedItem.bio}</Text>
                                </div>
                            </div>

                            <div className="demo-list-modal__actions">
                                <Button variant="filled" size="m" onClick={(e) => { handleActionClick(e, 'email', selectedItem); }}>
                                    <Icon><Mail /></Icon>
                                    Send Email
                                </Button>
                                <Button variant="outlined" size="m" onClick={(e) => { handleActionClick(e, 'call', selectedItem); }}>
                                    <Icon><Phone /></Icon>
                                    Call
                                </Button>
                            </div>
                        </Modal.Body>
                    </>
                )}
            </Modal>
        </>
    );
};
