import React, { useState } from 'react';
import { DataTable, DataList, Badge, Avatar } from '../../../../components/ui';
import { Edit2 } from 'lucide-react';

const DataDisplaySection = () => {
    // Dummy data - realistic file management data
    const columns = [
        {
            id: 'thumbnail',
            title: '',
            width: 80,
            locked: true,
            sortable: false
        },
        {
            id: 'name',
            title: 'Name',
            width: 200,
            locked: false,
            sortable: true
        },
        {
            id: 'category',
            title: 'Category',
            width: 120,
            locked: false,
            sortable: true
        },
        {
            id: 'format',
            title: 'Format',
            width: 80,
            locked: false,
            sortable: true
        },
        {
            id: 'size',
            title: 'Size (KB)',
            width: 100,
            locked: false,
            sortable: true
        },
        {
            id: 'modified',
            title: 'Modified',
            width: 120,
            locked: false,
            sortable: true
        },
        {
            id: 'status',
            title: 'Status',
            width: 100,
            locked: false,
            sortable: true
        },
        {
            id: 'downloads',
            title: 'Downloads',
            width: 100,
            locked: false,
            sortable: true
        },
        {
            id: 'actions',
            title: 'Actions',
            width: 80,
            locked: false,
            sortable: false
        }
    ];

    const data = [
        {
            id: 1,
            thumbnail: 'https://placehold.co/60x40/e3f2fd/1976d2/png?text=DOC',
            name: 'Annual Report 2024',
            category: 'Financial',
            format: 'PDF',
            size: 1024,
            modified: '2024-03-15',
            status: 'Published',
            downloads: 42
        },
        {
            id: 2,
            thumbnail: 'https://placehold.co/60x40/f3e5f5/7b1fa2/png?text=IMG',
            name: 'Marketing Assets',
            category: 'Marketing',
            format: 'ZIP',
            size: 2048,
            modified: '2024-03-14',
            status: 'Published',
            downloads: 78
        },
        {
            id: 3,
            thumbnail: 'https://placehold.co/60x40/fff3e0/f57c00/png?text=VID',
            name: 'Product Demo',
            category: 'Marketing',
            format: 'MP4',
            size: 15360,
            modified: '2024-03-13',
            status: 'Draft',
            downloads: 12
        },
        {
            id: 4,
            thumbnail: 'https://placehold.co/60x40/e8f5e9/388e3c/png?text=XLS',
            name: 'Sales Data Q1',
            category: 'Analytics',
            format: 'XLSX',
            size: 512,
            modified: '2024-03-12',
            status: 'Published',
            downloads: 156
        },
        {
            id: 5,
            thumbnail: 'https://placehold.co/60x40/fce4ec/c2185b/png?text=PPT',
            name: 'Team Presentation',
            category: 'Operations',
            format: 'PPTX',
            size: 3072,
            modified: '2024-03-11',
            status: 'Published',
            downloads: 23
        },
        {
            id: 6,
            thumbnail: 'https://placehold.co/60x40/f1f8e9/689f38/png?text=PDF',
            name: 'User Manual',
            category: 'Documentation',
            format: 'PDF',
            size: 768,
            modified: '2024-03-10',
            status: 'Published',
            downloads: 91
        },
        {
            id: 7,
            thumbnail: 'https://placehold.co/60x40/ede7f6/512da8/png?text=IMG',
            name: 'Brand Guidelines',
            category: 'Marketing',
            format: 'PNG',
            size: 420,
            modified: '2024-03-09',
            status: 'Published',
            downloads: 67
        },
        {
            id: 8,
            thumbnail: 'https://placehold.co/60x40/fff9c4/f9a825/png?text=TXT',
            name: 'Meeting Notes',
            category: 'Operations',
            format: 'TXT',
            size: 24,
            modified: '2024-03-08',
            status: 'Draft',
            downloads: 0
        },
        {
            id: 9,
            thumbnail: 'https://placehold.co/60x40/ffebee/c62828/png?text=XLS',
            name: 'Budget Forecast',
            category: 'Financial',
            format: 'XLSX',
            size: 640,
            modified: '2024-03-07',
            status: 'Published',
            downloads: 33
        },
        {
            id: 10,
            thumbnail: 'https://placehold.co/60x40/e1f5fe/0277bd/png?text=DOC',
            name: 'Project Proposal',
            category: 'Projects',
            format: 'DOCX',
            size: 896,
            modified: '2024-03-06',
            status: 'Published',
            downloads: 54
        },
        {
            id: 11,
            thumbnail: 'https://placehold.co/60x40/fef5e7/ff9800/png?text=PDF',
            name: 'Strategy Document',
            category: 'Projects',
            format: 'PDF',
            size: 1280,
            modified: '2024-03-05',
            status: 'Draft',
            downloads: 8
        },
        {
            id: 12,
            thumbnail: 'https://placehold.co/60x40/e0f2f1/00897b/png?text=VID',
            name: 'Training Video',
            category: 'Operations',
            format: 'MP4',
            size: 20480,
            modified: '2024-03-04',
            status: 'Published',
            downloads: 145
        },
        {
            id: 13,
            thumbnail: 'https://placehold.co/60x40/e8eaf6/3949ab/png?text=PPT',
            name: 'Investor Deck',
            category: 'Financial',
            format: 'PPTX',
            size: 1792,
            modified: '2024-03-03',
            status: 'Published',
            downloads: 108
        }
    ];

    const listData = [
        {
            id: 1,
            name: 'Wade Warren',
            email: 'wade@acme.com',
            phone: '(+33)6 55 52 72 55',
            address: 'Financial District, New York',
            status: 'Online',
            avatar: 'https://i.pravatar.cc/150?img=12'
        },
        {
            id: 2,
            name: 'Marvin McKinney',
            email: 'marvin@acme.com',
            phone: '(+33)6 55 59 32 88',
            address: 'Northeast, Washington D.C.',
            status: 'Offline',
            avatar: 'https://i.pravatar.cc/150?img=33'
        },
        {
            id: 3,
            name: 'Floyd Miles',
            email: 'miles@acme.com',
            phone: '(+33)6 55 51 05 09',
            address: 'Chinatown, New York',
            status: 'Online',
            avatar: 'https://i.pravatar.cc/150?img=68'
        },
        {
            id: 4,
            name: 'Jacob Jones',
            email: 'khawkins@acme.com',
            phone: '(+33)6 55 53 19 16',
            address: 'Hell\'s Kitchen, New York',
            status: 'Offline',
            avatar: 'https://i.pravatar.cc/150?img=14',
            selected: true
        },
        {
            id: 5,
            name: 'Courtney Henry',
            email: 'henry@acme.com',
            phone: '(+33)7 45 55 87 71',
            address: 'Upper West Side, New York',
            status: 'Offline',
            avatar: 'https://i.pravatar.cc/150?img=45'
        },
    ];

    return (
        <section className="style-guide-section">
            <h2>Data Display</h2>

            <h3>Data Table</h3>
            <p className="section-description">
                Full-featured table with thumbnails, sorting, pagination, column resizing, and column/row reordering.
                <strong> Drag column headers to reorder columns.</strong> Swipe horizontally on mobile.
            </p>
            <div className="component-demo">
                <DataTable
                    columns={columns}
                    data={data}
                    pagination={true}
                    itemsPerPage={10}
                    onRowReorder={(newData) => console.log('Rows reordered:', newData)}
                    onColumnReorder={(newCols) => console.log('Columns reordered:', newCols)}
                    onColumnResize={(cols) => console.log('Columns resized:', cols)}
                />
            </div>

            <h3>Data List</h3>
            <p className="section-description">
                Modern list view with avatars, status indicators, and selection states. Perfect for customer lists, user management, or any  data that needs a clean, scannable layout.
            </p>
            <div className="component-demo">
                <DataList
                    data={listData}
                    onReorder={(newData) => console.log('List Reordered:', newData)}
                    renderItem={(item) => (
                        <>
                            <Avatar
                                src={item.avatar}
                                alt={item.name}
                                size="m"
                            />
                            <div className="list-item-main">
                                <h4 className="list-item-title">{item.name}</h4>
                                <div className="list-item-meta">
                                    <span>{item.email}</span>
                                    <span>•</span>
                                    <span>{item.phone}</span>
                                    <span>•</span>
                                    <span>{item.address}</span>
                                </div>
                            </div>
                            <div className="list-item-status">
                                <Badge
                                    type={item.status === 'Online' ? 'success' : 'neutral'}
                                    variant="light"
                                    size="s"
                                >
                                    <span className={`status-indicator status-indicator--${item.status === 'Online' ? 'online' : 'offline'}`}></span>
                                    {item.status}
                                </Badge>
                            </div>
                        </>
                    )}
                />
            </div>
        </section>
    );
};

export default DataDisplaySection;
