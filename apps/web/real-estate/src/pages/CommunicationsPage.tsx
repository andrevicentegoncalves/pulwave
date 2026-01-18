/**
 * CommunicationsPage - Real Estate App
 * @package @pulwave/apps/real-estate
 */
import { useState } from 'react';
import {
    SectionHeader,
    Button,
    Card,
    Tabs,
    TabPanel,
    Badge,
    Input,
    VisualEffect,
    Avatar,
    PenSquare,
    Search,
    Mail,
    MessageSquare,
    Bell,
    Filter
} from '@pulwave/ui';
import { ContentLayout } from '@pulwave/widgets';

interface Message {
    id: string;
    sender: string;
    avatar?: string;
    subject: string;
    preview: string;
    date: string;
    read: boolean;
    tag?: { label: string; status: 'info' | 'warning' | 'curious' | 'neutral' };
}

const MOCK_MESSAGES: Message[] = [
    {
        id: '1',
        sender: 'Sarah Jenkins',
        subject: 'Maintenance Request: Leaking Faucet',
        preview: 'Hi, I noticed the kitchen faucet is dripping continuously…',
        date: '10:30 AM',
        read: false,
        tag: { label: 'Maintenance', status: 'warning' }
    },
    {
        id: '2',
        sender: 'Management Team',
        subject: 'Community Event This Saturday',
        preview: 'Join us for a summer BBQ in the courtyard this Saturday…',
        date: 'Yesterday',
        read: true,
        tag: { label: 'Announcement', status: 'info' }
    },
    {
        id: '3',
        sender: 'John Doe',
        subject: 'Lease Renewal Question',
        preview: 'I was wondering if we could discuss the terms for…',
        date: '2 days ago',
        read: true,
        tag: { label: 'Lease', status: 'curious' } // 'curious' maps to 'primary' usually or we use specific status
    }
];

export const CommunicationsPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [search, setSearch] = useState('');

    const MessageItem = ({ msg }: { msg: Message }) => (
        <button
            type="button"
            className={`p-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors flex gap-4 ${!msg.read ? 'bg-primary-50/30' : ''} cursor-pointer w-full text-left`}
            aria-label={`${msg.read ? '' : 'Unread: '}${msg.subject} from ${msg.sender}, ${msg.date}`}
        >
            <Avatar src={msg.avatar} fallback={msg.sender[0]} size="m" />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <span className={`font-medium ${!msg.read ? 'text-neutral-900' : 'text-neutral-700'}`}>
                        {msg.sender}
                    </span>
                    <span className="text-xs text-neutral-500 whitespace-nowrap ml-2">
                        {msg.date}
                    </span>
                </div>
                <h4 className={`text-sm mb-1 ${!msg.read ? 'font-semibold text-neutral-900' : 'font-medium text-neutral-800'}`}>
                    {msg.subject}
                </h4>
                <p className="text-sm text-neutral-500 truncate">
                    {msg.preview}
                </p>
            </div>
            {msg.tag && (
                <div className="flex flex-col items-end gap-2">
                    <Badge variant="light" status={msg.tag.status as any} size="s">
                        {msg.tag.label}
                    </Badge>
                    {!msg.read && (
                        <div className="w-2 h-2 rounded-full bg-primary-500 mt-2" aria-hidden="true" />
                    )}
                </div>
            )}
        </button>
    );

    return (
        <ContentLayout className="communications-page">
            <SectionHeader
                title="Communications"
                description="Inbox and announcements"
                icon="message-square"
                actions={
                    <Button kind="primary" icon={<PenSquare size={16} aria-hidden="true" />}>
                        Compose
                    </Button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
                {/* Sidebar / List */}
                <div className="lg:col-span-4 flex flex-col h-full gap-4">
                    <Card className="flex flex-col h-full overflow-hidden p-0" variant="elevated">
                        <div className="p-4 border-b border-neutral-100 flex flex-col gap-4">
                            <Input
                                placeholder="Search messages…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                leftIcon={<Search size={16} className="text-neutral-400" />}
                                className="w-full"
                            />
                            <div className="flex gap-2">
                                <Tabs defaultTab={activeTab} onChange={setActiveTab} variant="pills">
                                    <TabPanel label="Inbox" />
                                    <TabPanel label="Sent" />
                                    <TabPanel label="Archived" />
                                </Tabs>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {MOCK_MESSAGES.map(msg => (
                                <MessageItem key={msg.id} msg={msg} />
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Main Content / Empty State */}
                <div className="lg:col-span-8 hidden lg:flex h-full">
                    <Card className="w-full h-full flex items-center justify-center p-0 bg-neutral-50/50 border-dashed">
                        <div className="text-center p-8 max-w-md">
                            <div className="mb-6 flex justify-center">
                                <VisualEffect variant="ring-wave" size="l" />
                            </div>
                            <h3 className="text-xl font-medium text-neutral-900 mb-2">Select a message</h3>
                            <p className="text-neutral-500 mb-6">
                                Choose a message from the list to view conversation details or start a new message.
                            </p>
                            <Button variant="secondary" icon={<PenSquare size={16} aria-hidden="true" />}>
                                New Message
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </ContentLayout>
    );
};

export default CommunicationsPage;
