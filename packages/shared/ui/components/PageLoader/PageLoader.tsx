import { type ReactNode } from 'react';
import { cn } from '@pulwave/utils';
import { Spinner } from '../Spinner';
import {
    pageLoaderVariants,
    pageLoaderMessageVariants,
    type PageLoaderProps
} from './types';
import './styles/_index.scss';

export const PageLoader = ({
    message = 'Loading…',
    fullScreen = true,
    className
}: PageLoaderProps) => {
    return (
        <div className={cn(pageLoaderVariants({ fullScreen }), className)}>
            <Spinner size="xl" />
            {message && (
                <div className={cn(pageLoaderMessageVariants())}>
                    {message}
                </div>
            )}
        </div>
    );
};
