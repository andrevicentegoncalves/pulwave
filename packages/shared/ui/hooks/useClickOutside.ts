import { useEffect, RefObject } from 'react';

type EventType = MouseEvent | TouchEvent;

export function useClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    handler: (event: EventType) => void,
    eventType: 'mousedown' | 'mouseup' = 'mousedown'
): void {
    useEffect(() => {
        const listener = (event: EventType) => {
            const el = ref?.current;

            // Do nothing if clicking ref's element or descendent elements
            if (!el || el.contains(event.target as Node)) {
                return;
            }

            handler(event);
        };

        document.addEventListener(eventType, listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener(eventType, listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler, eventType]);
}
