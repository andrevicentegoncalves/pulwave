import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '@pulwave/utils';

export function useViewport() {
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth <= BREAKPOINTS.M : false
    );

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= BREAKPOINTS.M);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { isMobile };
}
