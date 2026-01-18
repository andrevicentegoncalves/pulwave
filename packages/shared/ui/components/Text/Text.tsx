import React, { forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { textVariants, type TextProps } from './types';
import './styles/_index.scss';

export const Text = forwardRef<HTMLElement, TextProps>(({
    children,
    as: Component = 'span',
    category,
    size,
    weight,
    color,
    align,
    truncate,
    wrap,
    lineClamp,
    className,
    style,
    ...props
}, ref) => {
    const dynamicStyle: React.CSSProperties = {
        ...style,
        ...(lineClamp && {
            '--line-clamp': lineClamp,
            display: '-webkit-box',
            WebkitLineClamp: lineClamp,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
        } as React.CSSProperties),
    };

    return (
        <Component
            ref={ref}
            className={cn(textVariants({ category, size, weight, color, align, truncate, wrap }), className)}
            style={dynamicStyle}
            {...props}
        >
            {children}
        </Component>
    );
});

Text.displayName = 'Text';
