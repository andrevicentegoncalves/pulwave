import { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const infiniteScrollVariants = cva('infinite-scroll', {
    variants: {
        loaderPosition: {
            center: 'infinite-scroll--loader-center',
            start: 'infinite-scroll--loader-start',
            end: 'infinite-scroll--loader-end',
        }
    },
    defaultVariants: {
        loaderPosition: 'center',
    },
});

export type InfiniteScrollVariantProps = VariantProps<typeof infiniteScrollVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

export interface InfiniteScrollProps extends HTMLAttributes<HTMLDivElement>, InfiniteScrollVariantProps {
    /**
     * callback to load more items
     */
    onLoadMore: () => void;
    /**
     * whether there are more items to load
     */
    hasMore: boolean;
    /**
     * whether items are currently loading
     */
    loading?: boolean;
    /**
     * custom loader component
     */
    loader?: ReactNode;
    /**
     * message to show when there are no more items
     */
    endMessage?: ReactNode;
    /**
     * Root element for intersection observer (defaults to viewport)
     */
    root?: Element | null;
    /**
     * Margin around root (defaults to 200px)
     */
    rootMargin?: string;
}
