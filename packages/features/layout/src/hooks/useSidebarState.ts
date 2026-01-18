import { useState, useCallback, useEffect } from 'react';
import { useViewport } from './useViewport';

export interface UseSidebarStateOptions {
    storageKey?: string;
    defaultExpanded?: boolean;
}

export function useSidebarState({
    storageKey = 'pulwave_sidebar_expanded',
    defaultExpanded = true
}: UseSidebarStateOptions = {}) {
    const { isMobile } = useViewport();

    const [isExpanded, setIsExpanded] = useState(() => {
        if (typeof window === 'undefined') return defaultExpanded;
        const saved = localStorage.getItem(storageKey);
        return saved !== null ? JSON.parse(saved) : defaultExpanded;
    });

    const toggleSidebar = useCallback(() => {
        setIsExpanded((prev: boolean) => {
            const newState = !prev;
            localStorage.setItem(storageKey, JSON.stringify(newState));
            return newState;
        });
    }, [storageKey]);

    // Force collapse on mobile if transitioned from desktop
    useEffect(() => {
        if (isMobile && isExpanded) {
            setIsExpanded(false);
        }
    }, [isMobile]);

    return {
        isExpanded,
        toggleSidebar,
        setIsExpanded
    };
}
