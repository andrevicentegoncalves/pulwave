import React, { forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { dividerVariants, type DividerProps } from './types';
import './styles/_index.scss';

const DividerRoot = forwardRef<HTMLDivElement, DividerProps>(({
    orientation,
    variant,
    spacing,
    className,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={cn(dividerVariants({ orientation, variant, spacing }), className)}
            role="separator"
            aria-orientation={orientation || undefined}
            {...props}
        />
    );
});
DividerRoot.displayName = 'Divider';

export const Divider = DividerRoot;
