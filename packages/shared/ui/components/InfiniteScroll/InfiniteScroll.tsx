import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { cn } from '@pulwave/utils';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { Spinner } from '../Spinner/Spinner';
import { Text } from '../Text/Text';
import { infiniteScrollVariants, type InfiniteScrollProps } from './types';
import './styles/_index.scss';

export const InfiniteScroll = ({
    children,
    onLoadMore,
    hasMore,
    loading = false,
    loader = <Spinner size="m" />,
    endMessage,
    root = null,
    rootMargin = '200px',
    className,
    ...props
}: InfiniteScrollProps) => {
    const sentryRef = useRef<HTMLDivElement>(null);
    const entry = useIntersectionObserver(sentryRef as RefObject<Element>, {
        root,
        rootMargin,
        freezeOnceVisible: false,
    });

    useEffect(() => {
        if (entry?.isIntersecting && hasMore && !loading) {
            onLoadMore();
        }
    }, [entry, hasMore, loading, onLoadMore]);

    return (
        <div className={cn(infiniteScrollVariants({ loaderPosition: 'center' }), className)} {...props}>
            {children}

            {loading && (
                <div className="infinite-scroll__loader">
                    {loader}
                </div>
            )}

            {!loading && hasMore && (
                <div ref={sentryRef} style={{ height: 20, width: '100%' }} />
            )}

            {!hasMore && endMessage && (
                <div className="infinite-scroll__end-message">
                    {typeof endMessage === 'string' ? (
                        <Text variant="body-s">{endMessage}</Text>
                    ) : endMessage}
                </div>
            )}
        </div>
    );
};

InfiniteScroll.displayName = 'InfiniteScroll';
