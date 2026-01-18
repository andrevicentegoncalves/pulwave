export type AnnouncePriority = 'polite' | 'assertive';

export interface AnnounceMessage {
    id: string;
    message: string;
    priority: AnnouncePriority;
}

export interface AnnounceContextValue {
    announce: (message: string, priority?: AnnouncePriority) => void;
}

export interface LiveRegionProps {
    children?: React.ReactNode;
}
