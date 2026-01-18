import React, { forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { stackVariants, type StackProps } from './types';
import './styles/_index.scss';

export const Stack = forwardRef<HTMLElement, StackProps>(({
    children,
    as: Component = 'div',
    direction = 'column',
    align,
    justify,
    wrap,
    gap = 0,
    reverse,
    fullWidth,
    fullHeight,
    padding,
    className,
    style,
    ...props
}, ref) => {
    // Handle reverse shorthand
    const computedDirection = reverse
        ? (direction === 'row' ? 'row-reverse' : 'column-reverse')
        : direction;

    // Handle custom gap via style if not a known variant (simplified check or pass through)
    // For now assuming gap is one of the variants or handled by style if strict
    // But let's support arbitrary gap via style if it's passed as number/string not in variants?
    // The variants type check handles string unions. If gap is number, we need to map or use style.

    // Better to stick to class variants for consistency, but enable style override.
    const isCustomGap = typeof gap === 'number' && ![0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32].includes(gap);
    const gapStyle = isCustomGap ? { gap: typeof gap === 'number' ? `var(--spacing-${gap})` : gap } : {};

    // Padding style
    const paddingStyle = padding ? { padding: typeof padding === 'number' ? `var(--spacing-${padding})` : padding } : {};

    const computedStyle = {
        ...gapStyle,
        ...paddingStyle,
        ...style
    };

    return (
        <Component
            ref={ref}
            className={cn(
                stackVariants({
                    direction: computedDirection as 'row' | 'column' | 'row-reverse' | 'column-reverse',
                    align,
                    justify,
                    wrap: wrap as boolean | 'reverse' | undefined,
                    gap: isCustomGap ? undefined : (gap as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32)
                }),
                fullWidth && 'stack--full-width',
                fullHeight && 'stack--full-height',
                className
            )}
            style={computedStyle}
            {...props}
        >
            {children}
        </Component>
    );
});

Stack.displayName = 'Stack';
