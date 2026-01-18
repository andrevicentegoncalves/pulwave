import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import {
    badgeVariants,
    badgeIconVariants,
    badgeTextVariants,
    badgeCloseVariants,
    type BadgeProps
} from './types';
import { Tooltip } from '../Tooltip';
import './styles/_index.scss';  // Modular BEM styles

/**
 * Badge Component (Compound + CVA)
 */
const BadgeRoot = forwardRef<HTMLSpanElement, BadgeProps>(({
    className,
    variant = 'medium',
    status: propStatus = 'neutral',
    type,
    size = 'm',
    clickable,
    onClick,
    children,
    icon,
    removable,
    onRemove,
    circle,
    ...props
}, ref) => {
    const status = type || propStatus;
    const isClickable = clickable || !!onClick;
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const checkOverflow = () => {
            if (textRef.current) {
                setIsOverflowing(textRef.current.scrollWidth > textRef.current.clientWidth);
            }
        };
        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [children]);

    const badgeContent = (
        <span
            ref={ref}
            className={cn(
                badgeVariants({ variant, status, size, clickable: isClickable }),
                circle && 'badge--circle',
                className
            )}
            onClick={onClick}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            {...props}
        >
            {icon && (
                <span className={cn(badgeIconVariants())} aria-hidden="true">
                    {icon}
                </span>
            )}

            <span ref={textRef} className={cn(badgeTextVariants())}>
                {children}
            </span>

            {removable && (
                <button
                    className={cn(badgeCloseVariants())}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove?.();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            onRemove?.();
                        }
                    }}
                    aria-label="Remove badge"
                    tabIndex={0}
                >
                    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            )}
        </span>
    );

    if (isOverflowing && typeof children === 'string') {
        return (
            <Tooltip content={children} direction="top" size="s" wrapperClassName="tooltip-wrapper--shrink">
                {badgeContent}
            </Tooltip>
        );
    }

    return badgeContent;
});

BadgeRoot.displayName = 'Badge';

// Subcomponents
const BadgeIcon = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <span className={cn(badgeIconVariants(), className)}>{children}</span>
);
BadgeIcon.displayName = 'Badge.Icon';

const BadgeText = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <span className={cn(badgeTextVariants(), className)}>{children}</span>
);
BadgeText.displayName = 'Badge.Text';

export const Badge = Object.assign(BadgeRoot, {
    Icon: BadgeIcon,
    Text: BadgeText,
});
