import { useEffect, useState, useRef, RefObject } from 'react';

export interface ResizeObserverEntry {
    width: number;
    height: number;
}

export function useResizeObserver(elementRef: RefObject<HTMLElement>): ResizeObserverEntry {
    const [size, setSize] = useState<ResizeObserverEntry>({ width: 0, height: 0 });

    useEffect(() => {
        const node = elementRef?.current;
        if (!node || typeof ResizeObserver === 'undefined') return;

        const resizeObserver = new ResizeObserver((entries) => {
            if (!Array.isArray(entries) || !entries.length) return;

            const entry = entries[0];
            let width: number;
            let height: number;

            if (entry.borderBoxSize?.length > 0) {
                width = entry.borderBoxSize[0].inlineSize;
                height = entry.borderBoxSize[0].blockSize;
            } else {
                width = entry.contentRect.width;
                height = entry.contentRect.height;
            }

            setSize({ width, height });
        });

        resizeObserver.observe(node);

        return () => resizeObserver.disconnect();
    }, [elementRef]);

    return size;
}
