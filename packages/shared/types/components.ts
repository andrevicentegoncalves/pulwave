import type { ReactNode, CSSProperties } from 'react';

/**
 * Component-related type definitions
 */

/**
 * Base props that most components accept
 */
export interface BaseComponentProps {
    /** Additional CSS class names */
    className?: string;
    /** Inline styles (use sparingly) */
    style?: CSSProperties;
    /** Children elements */
    children?: ReactNode;
    /** Test ID for testing */
    testId?: string;
}

/**
 * Common size variants (abbreviated T-shirt sizes)
 */
export type Size = 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl';

/**
 * Common color variants
 */
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

/**
 * Component state variants
 */
export type StateVariant = 'default' | 'hover' | 'active' | 'focus' | 'disabled';

/**
 * Orientation options
 */
export type Orientation = 'horizontal' | 'vertical';

/**
 * Alignment options
 */
export type Alignment = 'start' | 'center' | 'end' | 'stretch';

/**
 * Justify options
 */
export type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

/**
 * Position options
 */
export type Position = 'top' | 'right' | 'bottom' | 'left' | 'center';

/**
 * Spacing scale based on design tokens
 */
export type SpacingScale = number | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * Props for polymorphic components
 */
export type PolymorphicProps<E extends React.ElementType, P = object> = P &
    Omit<React.ComponentPropsWithoutRef<E>, keyof P> & {
        as?: E;
    };

/**
 * Ref forwarding for polymorphic components
 */
export type PolymorphicRef<E extends React.ElementType> = React.ComponentPropsWithRef<E>['ref'];
