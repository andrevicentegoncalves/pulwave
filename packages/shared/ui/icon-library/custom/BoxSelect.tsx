/**
 * Custom BoxSelect Icon
 * A box/area selection icon for design system documentation
 */
import React, { forwardRef } from 'react';
import type { BaseIconProps } from '../types';

export const BoxSelect = forwardRef<SVGSVGElement, BaseIconProps>(({
    size = 24,
    color = 'currentColor',
    strokeWidth = 2,
    ...props
}, ref) => (
    <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        {/* Corner brackets for selection box */}
        <path d="M5 3H3v2" />
        <path d="M19 3h2v2" />
        <path d="M21 19v2h-2" />
        <path d="M5 21H3v-2" />
        {/* Dashed selection lines */}
        <path d="M9 3h1" />
        <path d="M14 3h1" />
        <path d="M9 21h1" />
        <path d="M14 21h1" />
        <path d="M3 9v1" />
        <path d="M3 14v1" />
        <path d="M21 9v1" />
        <path d="M21 14v1" />
    </svg>
));

BoxSelect.displayName = 'BoxSelect';
