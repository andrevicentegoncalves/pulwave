import React, { forwardRef } from 'react';
// Import explicit registry instead of namespace import for better tree-shaking
import { ICON_REGISTRY } from '../../icon-library';
import { cn } from '@pulwave/utils';
import { iconVariants, type IconProps } from './types';
import './styles/_index.scss';

const IconRoot = forwardRef<HTMLSpanElement, IconProps>(({
    size,
    className,
    children,
    name,
    icon: IconComp,
    color,
    style,
    ...props
}, ref) => {
    const LucideIcon = name ? ICON_REGISTRY[name] : undefined;
    const ComponentToRender = IconComp || LucideIcon;

    return (
        <span
            ref={ref}
            className={cn(iconVariants({ size }), className)}
            aria-hidden="true"
            style={{ color, ...style }}
            {...props}
        >
            {ComponentToRender ? <ComponentToRender /> : children}
        </span>
    );
});
IconRoot.displayName = 'Icon';

export const Icon = IconRoot;
