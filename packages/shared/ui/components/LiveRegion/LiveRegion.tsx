import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { VisuallyHidden } from '../VisuallyHidden';
import type { AnnounceContextValue, AnnounceMessage, AnnouncePriority, LiveRegionProps } from './types';
import './styles/_index.scss';

const AnnounceContext = createContext<AnnounceContextValue | null>(null);

export const useAnnounceContext = () => {
    const context = useContext(AnnounceContext);
    if (!context) {
        throw new Error('useAnnounceContext must be used within a LiveRegion (or PulwaveProvider)');
    }
    return context;
};

export const LiveRegion = ({ children }: LiveRegionProps) => {
    const [messages, setMessages] = useState<AnnounceMessage[]>([]);
    const timeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

    const announce = useCallback((message: string, priority: AnnouncePriority = 'polite') => {
        const id = Math.random().toString(36).substr(2, 9);

        // Add message to state
        setMessages((prev) => [...prev, { id, message, priority }]);

        // Clear message after 3 seconds (enough time for screen reader to register)
        // We don't remove it immediately to ensure it's in the DOM long enough
        const timeoutId = setTimeout(() => {
            setMessages((prev) => prev.filter((m) => m.id !== id));
            delete timeoutRef.current[id];
        }, 5000); // 5 seconds to be safe

        timeoutRef.current[id] = timeoutId;
    }, []);

    // Cleanup timeouts
    useEffect(() => {
        return () => {
            Object.values(timeoutRef.current).forEach(clearTimeout);
        };
    }, []);

    const politeMessages = messages.filter(m => m.priority === 'polite');
    const assertiveMessages = messages.filter(m => m.priority === 'assertive');

    return (
        <AnnounceContext.Provider value={{ announce }}>
            {children}
            <VisuallyHidden>
                <div role="status" aria-live="polite" aria-atomic="true">
                    {politeMessages.map((msg) => (
                        <div key={msg.id}>{msg.message}</div>
                    ))}
                </div>
                <div role="alert" aria-live="assertive" aria-atomic="true">
                    {assertiveMessages.map((msg) => (
                        <div key={msg.id}>{msg.message}</div>
                    ))}
                </div>
            </VisuallyHidden>
        </AnnounceContext.Provider>
    );
};

LiveRegion.displayName = 'LiveRegion';
