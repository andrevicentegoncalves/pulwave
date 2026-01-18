/**
 * useFocusTrap Hook
 * 
 * Provides focus trapping functionality as a hook for more flexible usage.
 * 
 * @package @ui
 */
import { useRef, useEffect, useCallback } from 'react';

interface UseFocusTrapOptions {
    /** Whether the focus trap is active */
    active?: boolean;
    /** 
     * Selector or element to initially focus when trap activates.
     */
    initialFocus?: string | HTMLElement | null;
    /** 
     * Whether to return focus to previously focused element when deactivating 
     */
    returnFocus?: boolean;
    /** Callback when escape key is pressed */
    onEscape?: () => void;
}

// Focusable element selectors
const FOCUSABLE_SELECTORS = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
].join(',');

/**
 * Get all focusable elements within a container
 */
const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const elements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    return Array.from(elements).filter(el => {
        return el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
    });
};

/**
 * useFocusTrap
 * 
 * Hook to trap focus within a container element.
 * 
 * @example
 * ```tsx
 * const MyModal = ({ isOpen, onClose }) => {
 *     const { containerRef, handleKeyDown } = useFocusTrap({
 *         active: isOpen,
 *         onEscape: onClose,
 *         returnFocus: true
 *     });
 * 
 *     return (
 *         <div ref={containerRef} onKeyDown={handleKeyDown}>
 *             <button>First</button>
 *             <button>Second</button>
 *             <button onClick={onClose}>Close</button>
 *         </div>
 *     );
 * };
 * ```
 */
export const useFocusTrap = <T extends HTMLElement = HTMLDivElement>({
    active = true,
    initialFocus,
    returnFocus = true,
    onEscape
}: UseFocusTrapOptions = {}) => {
    const containerRef = useRef<T>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);

    // Store previously focused element when activating
    useEffect(() => {
        if (active) {
            previouslyFocusedRef.current = document.activeElement as HTMLElement;
        }
    }, [active]);

    // Set initial focus when trap activates
    useEffect(() => {
        if (!active || !containerRef.current) return;

        const setInitialFocus = () => {
            if (!containerRef.current) return;

            if (initialFocus) {
                if (typeof initialFocus === 'string') {
                    const element = containerRef.current.querySelector<HTMLElement>(initialFocus);
                    element?.focus();
                } else if (initialFocus instanceof HTMLElement) {
                    initialFocus.focus();
                }
            } else {
                // Focus first focusable element
                const focusable = getFocusableElements(containerRef.current);
                if (focusable.length > 0) {
                    focusable[0].focus();
                }
            }
        };

        requestAnimationFrame(setInitialFocus);
    }, [active, initialFocus]);

    // Return focus when deactivating
    useEffect(() => {
        return () => {
            if (returnFocus && previouslyFocusedRef.current) {
                previouslyFocusedRef.current.focus();
            }
        };
    }, [returnFocus]);

    // Handle keyboard events
    const handleKeyDown = useCallback((event: React.KeyboardEvent<T>) => {
        if (!active || !containerRef.current) return;

        // Handle Escape key
        if (event.key === 'Escape') {
            onEscape?.();
            return;
        }

        // Handle Tab key for focus trapping
        if (event.key === 'Tab') {
            const focusable = getFocusableElements(containerRef.current);
            if (focusable.length === 0) return;

            const firstElement = focusable[0];
            const lastElement = focusable[focusable.length - 1];
            const activeElement = document.activeElement;

            if (event.shiftKey) {
                // Shift + Tab: Go backwards
                if (activeElement === firstElement || !containerRef.current.contains(activeElement)) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab: Go forwards
                if (activeElement === lastElement || !containerRef.current.contains(activeElement)) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }, [active, onEscape]);

    // Function to programmatically focus first element
    const focusFirst = useCallback(() => {
        if (!containerRef.current) return;
        const focusable = getFocusableElements(containerRef.current);
        if (focusable.length > 0) {
            focusable[0].focus();
        }
    }, []);

    // Function to programmatically focus last element
    const focusLast = useCallback(() => {
        if (!containerRef.current) return;
        const focusable = getFocusableElements(containerRef.current);
        if (focusable.length > 0) {
            focusable[focusable.length - 1].focus();
        }
    }, []);

    return {
        containerRef,
        handleKeyDown,
        focusFirst,
        focusLast
    };
};

export default useFocusTrap;
