import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const timePickerVariants = cva('time-picker', {
    variants: {
        size: {
            xs: 'time-picker--xs',
            s: 'time-picker--s',
            m: 'time-picker--m',
            l: 'time-picker--l',
            xl: 'time-picker--xl',
        },
        disabled: {
            true: 'time-picker--disabled',
        },
        error: {
            true: 'time-picker--error',
        },
        isOpen: {
            true: 'time-picker--open',
        }
    },
    defaultVariants: {
        size: 'm',
        disabled: false,
        error: false,
        isOpen: false,
    },
});

export type TimePickerVariantProps = VariantProps<typeof timePickerVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

/**
 * TimePicker format (12/24 hour)
 */
export type TimeFormat = '12h' | '24h';

/**
 * TimePicker size
 */
export type TimePickerSize = 's' | 'm' | 'l';

/**
 * Time value structure
 */
export interface TimeValue {
    hours: number;
    minutes: number;
    seconds?: number;
    period?: 'AM' | 'PM';
}

/**
 * TimePicker component props
 */
export interface TimePickerProps {
    /** Selected time */
    value?: TimeValue | null;
    /** Callback when time changes */
    onChange?: (time: TimeValue | null) => void;
    /** Time format */
    format?: TimeFormat;
    /** Show seconds selector */
    showSeconds?: boolean;
    /** Minute step (5, 10, 15, 30) */
    minuteStep?: number;
    /** Minimum time */
    minTime?: TimeValue;
    /** Maximum time */
    maxTime?: TimeValue;
    /** Placeholder text */
    placeholder?: string;
    /** Size variant */
    size?: TimePickerSize;
    /** Show clear button */
    clearable?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Required field */
    required?: boolean;
    /** Error state */
    error?: boolean;
    /** Error message */
    errorMessage?: string;
    /** Additional CSS class names */
    className?: string;
    /** Label text */
    label?: ReactNode;
}
