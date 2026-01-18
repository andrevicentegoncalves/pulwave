/**
 * Box Component
 * 
 * A foundational layout primitive that provides styling props
 * for spacing, colors, and layout without writing custom CSS.
 * 
 * Now with Premium Variants (Card, Glass).
 */
import React, { createElement, forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { boxVariants, type BoxProps } from './types';
import './styles/_index.scss';

// Helper to convert spacing value to CSS variable
const spacingToCss = (value: number | 'auto' | undefined): string | undefined => {
    if (value === undefined) return undefined;
    if (value === 'auto') return 'auto';
    return `var(--scale-${value})`;
};

export const Box = forwardRef<HTMLElement, BoxProps>(
    (
        {
            as = 'div',
            children,
            className,
            // Variants
            variant = 'default',
            interactive = false,
            // Spacing
            padding,
            paddingX,
            paddingY,
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
            margin,
            marginX,
            marginY,
            marginTop,
            marginRight,
            marginBottom,
            marginLeft,
            // Layout
            display,
            width,
            height,
            minWidth,
            maxWidth,
            minHeight,
            maxHeight,
            // Visual
            background,
            borderRadius,
            border,
            shadow,
            overflow,
            position,
            // Other
            style,
            testId,
            ...rest
        },
        ref
    ) => {
        // Build inline styles from props for dynamic values (spacing, etc)
        // We keep inline styles for infinite spacing values to avoid 1000 classes
        const computedStyle: React.CSSProperties = {
            // Padding
            padding: spacingToCss(padding),
            paddingTop: spacingToCss(paddingTop ?? paddingY),
            paddingRight: spacingToCss(paddingRight ?? paddingX),
            paddingBottom: spacingToCss(paddingBottom ?? paddingY),
            paddingLeft: spacingToCss(paddingLeft ?? paddingX),
            // Margin
            margin: spacingToCss(margin),
            marginTop: spacingToCss(marginTop ?? marginY),
            marginRight: spacingToCss(marginRight ?? marginX),
            marginBottom: spacingToCss(marginBottom ?? marginY),
            marginLeft: spacingToCss(marginLeft ?? marginX),
            // Layout
            display,
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
            minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth,
            maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
            minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
            maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
            // Visual
            backgroundColor: background ? (background.startsWith('var(') ? background : `var(--color-${background})`) : undefined,
            borderRadius: borderRadius ? `var(--border-radius-${borderRadius})` : undefined,
            border,
            boxShadow: shadow && shadow !== 'none' ? `var(--shadow-${shadow})` : undefined,
            overflow,
            position,
            // Merge with passed style
            ...style,
        };

        // Filter out undefined values
        const filteredStyle = Object.fromEntries(
            Object.entries(computedStyle).filter(([_, v]) => v !== undefined)
        ) as React.CSSProperties;

        return createElement(
            as,
            {
                ref,
                className: cn(
                    boxVariants({ variant, interactive }),
                    className
                ),
                style: Object.keys(filteredStyle).length > 0 ? filteredStyle : undefined,
                'data-testid': testId,
                ...rest,
            },
            children
        );
    }
);

Box.displayName = 'Box';
