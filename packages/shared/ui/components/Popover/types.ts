import type { ReactNode, RefObject } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
export const popoverVariants = cva('popover', {
    variants: {
        placement: {
            top: 'popover--top',
            'top-start': 'popover--top-start',
            'top-end': 'popover--top-end',
            bottom: 'popover--bottom',
            'bottom-start': 'popover--bottom-start',
            'bottom-end': 'popover--bottom-end',
            left: 'popover--left',
            'left-start': 'popover--left-start',
            'left-end': 'popover--left-end',
            right: 'popover--right',
            'right-start': 'popover--right-start',
            'right-end': 'popover--right-end',
        },
        withArrow: {
            true: 'popover--with-arrow',
        },
    },
    defaultVariants: {
        placement: 'bottom',
    },
});

export type PopoverVariants = VariantProps<typeof popoverVariants>;

/**
 * Popover placement options
 */
export type PopoverPlacement =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end';

/**
 * Popover trigger types
 */
export type PopoverTrigger = 'click' | 'hover' | 'focus' | 'manual';

/**
 * Popover component props
 */
export interface PopoverProps extends PopoverVariants {
    /** Whether the popover is open (controlled mode) */
    isOpen?: boolean;
    /** Default open state (uncontrolled mode) */
    defaultOpen?: boolean;
    /** Callback when popover opens/closes */
    onOpenChange?: (isOpen: boolean) => void;
    /** Trigger element for the popover */
    trigger: ReactNode;
    /** Popover content */
    children: ReactNode;
    /** Popover placement relative to trigger */
    placement?: PopoverPlacement;
    /** What triggers the popover */
    triggerType?: PopoverTrigger;
    /** Show arrow pointing to trigger */
    showArrow?: boolean;
    /** Offset from trigger element in pixels */
    offset?: number;
    /** Close on click outside */
    closeOnClickOutside?: boolean;
    /** Close when pressing Escape key */
    closeOnEscape?: boolean;
    /** Delay before showing (hover trigger only) */
    openDelay?: number;
    /** Delay before hiding (hover trigger only) */
    closeDelay?: number;
    /** Additional CSS class names for popover content */
    className?: string;
    /** Additional CSS class names for trigger wrapper */
    triggerClassName?: string;
    /** Reference to an external element to anchor to */
    anchorRef?: RefObject<HTMLElement>;
}
