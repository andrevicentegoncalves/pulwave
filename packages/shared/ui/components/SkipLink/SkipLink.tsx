import { type ReactNode } from 'react';
import { cn } from '@pulwave/utils';
import { skipLinkVariants, type SkipLinkProps } from './types';
import './styles/_index.scss';

export const SkipLink = ({
    targetId = 'main-content',
    children = 'Skip to main content',
    className,
    ...props
}: SkipLinkProps) => {
    return (
        <a
            href={`#${targetId}`}
            className={cn(skipLinkVariants(), className)}
            {...props}
        >
            {children}
        </a>
    );
};

SkipLink.displayName = 'SkipLink';

export default SkipLink;
