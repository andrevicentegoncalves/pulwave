import { useState, useEffect } from 'react';
import { breakpoints, type Breakpoint } from '../tokens/breakpoints';

/**
 * Hook to detect if a media query matches
 * Mobile-first: checks if viewport is at or above the given breakpoint
 * 
 * @param breakpoint - The breakpoint key or custom media query string
 * @returns boolean indicating if the media query matches
 * 
 * @example
 * const isMobile = !useMediaQuery('md'); // Below medium breakpoint
 * const isDesktop = useMediaQuery('lg'); // At or above large breakpoint
 */
export function useMediaQuery(breakpoint: Breakpoint | string): boolean {
    const query = typeof breakpoint === 'string' && breakpoint in breakpoints
        ? `(min-width: ${breakpoints[breakpoint as Breakpoint]}px)`
        : breakpoint;

    const [matches, setMatches] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(query).matches;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia(query);
        setMatches(mediaQuery.matches);

        const handler = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [query]);

    return matches;
}
