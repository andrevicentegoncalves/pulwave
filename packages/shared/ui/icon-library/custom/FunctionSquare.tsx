/**
 * Custom FunctionSquare Icon
 * A function/formula icon in a square for design system documentation
 */
import React, { forwardRef } from 'react';
import type { BaseIconProps } from '../types';

export const FunctionSquare = forwardRef<SVGSVGElement, BaseIconProps>(({
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
        {/* Square container */}
        <rect width="18" height="18" x="3" y="3" rx="2" />
        {/* Function f(x) symbol */}
        <path d="M9 17c2 0 2.8-1 2.8-2.8V10c0-2 1-3.3 3.2-3" />
        <path d="M9 11.2h5" />
    </svg>
));

FunctionSquare.displayName = 'FunctionSquare';
