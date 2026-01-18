import { type ReactNode } from 'react';
import { ExternalLink } from '../../icon-library';
import { linkVariants, type LinkProps } from './types';
import { cn } from '@pulwave/utils';
import './styles/_index.scss';


export const Link = ({
    children,
    href,
    to,
    variant,
    size,
    external = false,
    underline,
    className,
    disabled = false,
    target,
    rel,
    ...props
}: LinkProps) => {
    // Determine if external (opens in new tab)
    const isExternal = external || target === '_blank';
    const finalTarget = isExternal ? '_blank' : target;
    const finalRel = isExternal ? 'noopener noreferrer' : rel;

    // Use href or to
    const destination = href || to || '#';

    if (disabled) {
        return (
            <span
                className={cn(linkVariants({ variant, size, underline, disabled }), className)}
                aria-disabled="true"
            >
                {children}
                {isExternal && <ExternalLink size={12} className="link__external-icon" aria-hidden="true" />}
            </span>
        );
    }

    return (
        <a
            href={destination}
            className={cn(linkVariants({ variant, size, underline, disabled }), className)}
            target={finalTarget}
            rel={finalRel}
            {...props}
        >
            {children}
            {isExternal && <ExternalLink size={12} className="link__external-icon" aria-hidden="true" />}
        </a>
    );
};

Link.displayName = 'Link';
