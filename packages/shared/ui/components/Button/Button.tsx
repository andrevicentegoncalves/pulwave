import React, { forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { buttonVariants, type ButtonProps } from './types';
import './styles/_index.scss';

const ButtonRoot = forwardRef<HTMLButtonElement, ButtonProps>(({
    kind,
    variant,
    size,
    shape,
    fullWidth,
    loading,
    className,
    children,
    disabled,
    leftIcon,
    rightIcon,
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            className={cn(buttonVariants({ kind, variant, size, shape, fullWidth: !!fullWidth, loading: !!loading }), className)}
            disabled={disabled || loading}
            aria-disabled={disabled || loading}
            aria-busy={loading}
            {...props}
        >
            {loading && (
                <span className="button__spinner" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin" aria-hidden="true">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                </span>
            )}

            {leftIcon && !loading && <span className="button__icon" aria-hidden="true">{leftIcon}</span>}
            <span className="button__label">{children}</span>
            {rightIcon && !loading && <span className="button__icon" aria-hidden="true">{rightIcon}</span>}
        </button>
    );
});
ButtonRoot.displayName = 'Button';

const ButtonIcon = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={cn('button__icon', className)}>{children}</span>
);
ButtonIcon.displayName = 'Button.Icon';

export const Button = Object.assign(ButtonRoot, {
    Icon: ButtonIcon,
});
