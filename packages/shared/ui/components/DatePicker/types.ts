import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const datePickerVariants = cva('date-picker', {
    variants: {
        size: {
            xs: 'date-picker--xs',
            s: 'date-picker--s',
            m: 'date-picker--m',
            l: 'date-picker--l',
            xl: 'date-picker--xl',
        },
        disabled: {
            true: 'date-picker--disabled',
        },
        error: { // Mapping 'error' prop
            true: 'date-picker--error',
        },
        isOpen: {
            true: 'date-picker--open',
        }
    },
    defaultVariants: {
        size: 'm',
        disabled: false,
        error: false,
        isOpen: false,
    },
});

export type DatePickerVariantProps = VariantProps<typeof datePickerVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

/**
 * DatePicker view mode
 */
export type DatePickerView = 'days' | 'months' | 'years';

/**
 * DatePicker size
 */
export type DatePickerSize = 's' | 'm' | 'l';

/**
 * DatePicker component props
 */
export interface DatePickerProps {
    /** Selected date */
    value?: Date | null;
    /** Callback when date changes */
    onChange?: (date: Date | null) => void;
    /** Minimum selectable date */
    minDate?: Date;
    /** Maximum selectable date */
    maxDate?: Date;
    /** Disabled specific dates */
    disabledDates?: Date[];
    /** Placeholder text */
    placeholder?: string;
    /** Size variant */
    size?: DatePickerSize;
    /** Date format for display */
    format?: string;
    /** Show clear button */
    clearable?: boolean;
    /** Show today button */
    showToday?: boolean;
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
    /** First day of week (0 = Sunday, 1 = Monday) */
    firstDayOfWeek?: 0 | 1;
    /** Locale for formatting */
    locale?: string;
}
