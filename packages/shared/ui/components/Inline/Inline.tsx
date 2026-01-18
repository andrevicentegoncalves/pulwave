import React, { createElement, forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { inlineVariants, type InlineProps } from './types';
import './styles/_index.scss';

export const Inline = forwardRef<HTMLElement, InlineProps>(
    (
        {
            as = 'div',
            children,
            className,
            gap = 0,
            align,
            justify,
            wrap,
            reverse,
            padding,
            width,
            style,
            testId,
            alignY: _alignY, // Filter out
            ...rest
        },
        ref
    ) => {
        // We keep numeric gap and misc styles inline for flexibility, 
        // as they map to token values dynamically
        const computedStyle: React.CSSProperties = {
            gap: gap ? `var(--scale-${gap})` : undefined,
            padding: padding ? `var(--scale-${padding})` : undefined,
            width: typeof width === 'number' ? `${width}px` : width,
            ...style,
        };

        return createElement(
            as,
            {
                ref,
                className: cn(inlineVariants({ align, justify, wrap, reverse }), className),
                style: computedStyle,
                'data-testid': testId,
                ...rest,
            },
            children
        );
    }
);

Inline.displayName = 'Inline';
