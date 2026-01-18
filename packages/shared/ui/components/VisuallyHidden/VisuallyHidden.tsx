import React, { forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { visuallyHiddenVariants, type VisuallyHiddenProps } from './types';
import './styles/_index.scss';

export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
    ({ children, focusable = false, className, style, ...rest }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(visuallyHiddenVariants({ focusable }), className)}
                style={style}
                {...rest}
            >
                {children}
            </span>
        );
    }
);

VisuallyHidden.displayName = 'VisuallyHidden';
