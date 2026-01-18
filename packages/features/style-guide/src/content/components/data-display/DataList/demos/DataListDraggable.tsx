import { useState } from 'react';
import { DataList, Avatar, Badge, Button, Icon, Text, CircleFlag, Card, Modal } from '@pulwave/ui';
import { Bookmark, Pencil, Trash, X } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';
import './DataListDemo.scss';

type TeamMember = {
    id: string;
    name: string;
    role: string;
    status: string;
    avatar: string;
    country: string;
};

const codeUsage = `// See DataListDraggable.tsx for full implementation`;

export const DataListDraggableDemo = () => {
    const [items, setItems] = useState<TeamMember[]>([
        { id: '1', name: 'John Doe', role: 'Software Engineer', status: 'Available', avatar: 'https://i.pravatar.cc/150?u=1', country: 'us' },
        { id: '2', name: 'Jean Dupont', role: 'Product Manager', status: 'Away', avatar: 'https://i.pravatar.cc/150?u=2', country: 'fr' },
        { id: '3', name: 'Max Mustermann', role: 'UX Designer', status: 'In Meeting', avatar: 'https://i.pravatar.cc/150?u=3', country: 'de' },
        { id: '4', name: 'Juan Pérez', role: 'QA Specialist', status: 'Offline', avatar: 'https://i.pravatar.cc/150?u=4', country: 'es' },
        { id: '5', name: 'Zhang San', role: 'DevOps Engineer', status: 'Available', avatar: 'https://i.pravatar.cc/150?u=5', country: 'cn' },
        { id: '6', name: 'Ivan Ivanov', role: 'Frontend Developer', status: 'Busy', avatar: 'https://i.pravatar.cc/150?u=6', country: 'ru' },
    ]);

    const [selectedItem, setSelectedItem] = useState<TeamMember | null>(null);

    const handleReorder = (newOrder: TeamMember[]) => {
        setItems(newOrder);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Available': return 'success';
            case 'Away': return 'warning';
            case 'In Meeting': return 'info';
            case 'Busy': return 'error';
            case 'Offline': return 'neutral';
            default: return 'neutral';
        }
    };

    const handleItemClick = (item: TeamMember) => {
        setSelectedItem(item);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
    };

    const handleActionClick = (e: React.MouseEvent, action: string, item: TeamMember) => {
        e.stopPropagation(); // Prevent modal from opening
        console.log(`${action} clicked for ${item.name}`);
    };

    return (
        <>
            <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Draggable DataList" description="Reorder items using drag and drop handles. Click on an item to see details.">
                <Card className="demo-card-container">
                    <Card.Header>
                        <Text variant="h3">Draggable Data List</Text>
                    </Card.Header>
                    <Card.Body>
                        <DataList
                            data={items}
                            keyExtractor={(item) => item.id}
                            draggable
                            onReorder={handleReorder}
                            renderItem={(item) => (
                                <>
                                    <DataList.Handle />
                                    <DataList.Content onClick={() => handleItemClick(item)}>
                                        {/* Row 1: Avatar + Name/Role */}
                                        <div className="demo-list-item__row-primary">
                                            <div className="demo-list-item__avatar">
                                                <Avatar src={item.avatar} alt={item.name} size="m" />
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
                                        <Button variant="ghost" size="s" aria-label="Bookmark" onClick={(e) => handleActionClick(e, 'bookmark', item)}>
                                            <Icon><Bookmark /></Icon>
                                        </Button>
                                        <Button variant="ghost" size="s" aria-label="Edit" onClick={(e) => handleActionClick(e, 'edit', item)}>
                                            <Icon><Pencil /></Icon>
                                        </Button>
                                        <Button variant="ghost" size="s" aria-label="Delete" onClick={(e) => handleActionClick(e, 'delete', item)}>
                                            <Icon><Trash /></Icon>
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
                            <Text variant="h3">Member Details</Text>
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
                                    <Text variant="small" className="demo-list-modal__label">ID</Text>
                                    <Text variant="body">{selectedItem.id}</Text>
                                </div>
                            </div>

                            <div className="demo-list-modal__actions">
                                <Button variant="filled" size="m" onClick={(e) => { handleActionClick(e, 'edit', selectedItem); handleCloseModal(); }}>
                                    <Icon><Pencil /></Icon>
                                    Edit
                                </Button>
                                <Button variant="outlined" size="m" onClick={(e) => { handleActionClick(e, 'bookmark', selectedItem); }}>
                                    <Icon><Bookmark /></Icon>
                                    Bookmark
                                </Button>
                                <Button variant="ghost" kind="error" size="m" onClick={(e) => { handleActionClick(e, 'delete', selectedItem); handleCloseModal(); }}>
                                    <Icon><Trash /></Icon>
                                    Delete
                                </Button>
                            </div>
                        </Modal.Body>
                    </>
                )}
            </Modal>
        </>
    );
};
