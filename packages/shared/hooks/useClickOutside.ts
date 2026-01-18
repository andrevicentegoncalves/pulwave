/**
 * useClickOutside Hook
 * 
 * Detects clicks outside of a specified element.
 * Commonly used for closing dropdowns, modals, and popovers.
 * 
 * @package @foundation
 * 
 * @example
 * ```tsx
 * const MyDropdown = () => {
 *     const [isOpen, setIsOpen] = useState(false);
 *     const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
 *     
 *     return (
 *         <div ref={ref}>
 *             <button onClick={() => setIsOpen(true)}>Open</button>
 *             {isOpen && <div>Dropdown content</div>}
 *         </div>
 *     );
 * };
 * ```
 */
import { useRef, useEffect, useCallback } from 'react';

export interface UseClickOutsideOptions {
    /** Whether the hook is active */
    enabled?: boolean;
    /** Event type to listen for */
    eventType?: 'mousedown' | 'mouseup' | 'click';
    /** Whether to use capture phase */
    capture?: boolean;
}

/**
 * Hook to detect clicks outside of an element
 * 
 * @param handler - Callback when click outside is detected
 * @param options - Optional configuration
 * @returns Ref to attach to the element
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
    handler: (event: MouseEvent | TouchEvent) => void,
    options: UseClickOutsideOptions = {}
) {
    const {
        enabled = true,
        eventType = 'mousedown',
        capture = true
    } = options;

    const ref = useRef<T>(null);
    const handlerRef = useRef(handler);

    // Keep handler ref updated
    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    const listener = useCallback((event: MouseEvent | TouchEvent) => {
        const element = ref.current;

        // Do nothing if clicking ref's element or its descendants
        if (!element || element.contains(event.target as Node)) {
            return;
        }

        handlerRef.current(event);
    }, []);

    useEffect(() => {
        if (!enabled) return;

        document.addEventListener(eventType, listener, capture);
        document.addEventListener('touchstart', listener, capture);

        return () => {
            document.removeEventListener(eventType, listener, capture);
            document.removeEventListener('touchstart', listener, capture);
        };
    }, [enabled, eventType, capture, listener]);

    return ref;
}

export default useClickOutside;
