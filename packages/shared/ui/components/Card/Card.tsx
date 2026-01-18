import React, { forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { cardVariants, type CardProps } from './types';
import './styles/_index.scss';

const CardRoot = forwardRef<HTMLDivElement, CardProps>(({
    variant,
    padding,
    hoverable,
    noHoverTransform,
    className,
    children,
    header,
    footer,
    as: Component = 'div',
    ...props
}, ref) => {
    return (
        <Component
            ref={ref as React.Ref<Element>}
            className={cn(cardVariants({ variant, padding, hoverable }), className)}
            {...props}
        >
            {header && (
                typeof header === 'string' ? <CardHeader>{header}</CardHeader> : header
            )}
            {children}
            {footer && (
                typeof footer === 'string' ? <CardFooter>{footer}</CardFooter> : footer
            )}
        </Component>
    );
});
CardRoot.displayName = 'Card';

const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn('card__header', className)}>{children}</div>
);
CardHeader.displayName = 'Card.Header';

const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn('card__content', className)}>{children}</div>
);
CardContent.displayName = 'Card.Content';

const CardFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn('card__footer', className)}>{children}</div>
);
CardFooter.displayName = 'Card.Footer';

export const Card = Object.assign(CardRoot, {
    Header: CardHeader,
    Content: CardContent,
    Body: CardContent, // Alias for compatibility
    Footer: CardFooter,
});
