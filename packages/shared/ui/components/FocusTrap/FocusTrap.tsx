import { useEffect, useRef, useCallback, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@pulwave/utils';
import type { FocusTrapProps } from './types';
import './styles/_index.scss';

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

const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const elements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    return Array.from(elements).filter(el => {
        return el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
    });
};

export const FocusTrap = ({
    active = true,
    initialFocus,
    returnFocus = true,
    allowOutsideClick = false,
    children,
    onEscape,
    onActivate,
    onDeactivate,
    className,
    ...rest
}: FocusTrapProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (active) {
            previouslyFocusedRef.current = document.activeElement as HTMLElement;
            onActivate?.();
        }

        return () => {
            if (!active && previouslyFocusedRef.current && returnFocus) {
                onDeactivate?.();
            }
        };
    }, [active, onActivate, onDeactivate, returnFocus]);

    useEffect(() => {
        if (!active || !containerRef.current) return;

        const setInitialFocus = () => {
            if (initialFocus) {
                if (typeof initialFocus === 'string') {
                    const element = containerRef.current?.querySelector<HTMLElement>(initialFocus);
                    element?.focus();
                } else if (initialFocus instanceof HTMLElement) {
                    initialFocus.focus();
                }
            } else {
                const focusable = getFocusableElements(containerRef.current!);
                if (focusable.length > 0) {
                    focusable[0].focus();
                }
            }
        };

        requestAnimationFrame(setInitialFocus);
    }, [active, initialFocus]);

    useEffect(() => {
        if (!active && returnFocus && previouslyFocusedRef.current) {
            if (typeof returnFocus === 'string') {
                const element = document.querySelector<HTMLElement>(returnFocus);
                element?.focus();
            } else if (returnFocus instanceof HTMLElement) {
                returnFocus.focus();
            } else if (returnFocus === true) {
                previouslyFocusedRef.current?.focus();
            }
        }
    }, [active, returnFocus]);

    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
        if (!active || !containerRef.current) return;

        if (event.key === 'Escape') {
            onEscape?.();
            return;
        }

        if (event.key === 'Tab') {
            const focusable = getFocusableElements(containerRef.current);
            if (focusable.length === 0) return;

            const firstElement = focusable[0];
            const lastElement = focusable[focusable.length - 1];
            const activeElement = document.activeElement;

            if (event.shiftKey) {
                if (activeElement === firstElement || !containerRef.current.contains(activeElement)) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (activeElement === lastElement || !containerRef.current.contains(activeElement)) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }, [active, onEscape]);

    useEffect(() => {
        if (!active || allowOutsideClick === true) return;

        const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
            if (!containerRef.current) return;

            const target = event.target as HTMLElement;
            if (!containerRef.current.contains(target)) {
                if (typeof allowOutsideClick === 'function') {
                    if (!allowOutsideClick(event)) {
                        event.preventDefault();
                        event.stopPropagation();
                        // Return focus to trap
                        const focusable = getFocusableElements(containerRef.current);
                        if (focusable.length > 0) focusable[0].focus();
                    }
                } else {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        };

        document.addEventListener('mousedown', handleOutsideClick, true);
        document.addEventListener('touchstart', handleOutsideClick, true);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick, true);
            document.removeEventListener('touchstart', handleOutsideClick, true);
        };
    }, [active, allowOutsideClick]);

    return (
        <div
            ref={containerRef}
            onKeyDown={handleKeyDown}
            className={cn('focus-trap', className)}
            {...rest}
        >
            {children}
        </div>
    );
};

FocusTrap.displayName = 'FocusTrap';
export default FocusTrap;
