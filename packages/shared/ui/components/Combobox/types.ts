import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const comboboxVariants = cva('combobox', {
    variants: {
        size: {
            xs: 'combobox--xs',
            s: 'combobox--s',
            m: 'combobox--m',
            l: 'combobox--l',
            xl: 'combobox--xl',
        },
        disabled: {
            true: 'combobox--disabled',
        },
        hasError: {
            true: 'combobox--error',
        },
        isOpen: {
            true: 'combobox--open',
        },
        multiple: {
            true: 'combobox--multiple',
        }
    },
    defaultVariants: {
        size: 'm',
        disabled: false,
        hasError: false,
        isOpen: false,
        multiple: false,
    },
});

export type ComboboxVariantProps = VariantProps<typeof comboboxVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

/**
 * Option type for Combobox
 */
export interface ComboboxOption<T = string> {
    /** Unique value */
    value: T;
    /** Display label */
    label: string;
    /** Optional icon */
    icon?: ReactNode;
    /** Disabled state */
    disabled?: boolean;
    /** Optional description */
    description?: string;
}

/**
 * Combobox size options
 */
export type ComboboxSize = 'xs' | 's' | 'm' | 'l';

/**
 * Base props shared by both modes
 */
interface ComboboxBaseProps<T> {
    /** Available options */
    options: ComboboxOption<T>[];
    /** Async search handler */
    onSearch?: (query: string) => void | Promise<void>;
    /** Placeholder text */
    placeholder?: string;
    /** Input size */
    size?: ComboboxSize;
    /** Disabled state */
    disabled?: boolean;
    /** Loading state */
    loading?: boolean;
    /** Error state */
    hasError?: boolean;
    /** Allow closing on selection (default: true for single, false for multi) */
    closeOnSelect?: boolean;
    /** Allow clearing selection */
    clearable?: boolean;
    /** Allow creating new options */
    creatable?: boolean;
    /** Callback when creating new option */
    onCreate?: (inputValue: string) => void;
    /** Custom filter function */
    filterFn?: (option: ComboboxOption<T>, query: string) => boolean;
    /** Empty state message */
    emptyMessage?: string;
    /** Create option message */
    createMessage?: (inputValue: string) => string;
    /** Additional CSS class */
    className?: string;
    /** Input name */
    name?: string;
    /** Auto-focus input */
    autoFocus?: boolean;
    /** Enable virtualization for large lists */
    virtualized?: boolean;
}

/**
 * Single selection props
 */
interface SingleComboboxProps<T> extends ComboboxBaseProps<T> {
    /** Multiple selection mode */
    multiple?: false;
    /** Selected value */
    value?: T;
    /** Change handler */
    onChange?: (value: T | undefined) => void;
}

/**
 * Multiple selection props
 */
interface MultiComboboxProps<T> extends ComboboxBaseProps<T> {
    /** Multiple selection mode */
    multiple: true;
    /** Selected values */
    value?: T[];
    /** Change handler */
    onChange?: (value: T[]) => void;
    /** Max visible tags before collapse (not yet implemented) */
    maxVisibleTags?: number;
}

/**
 * Unified Combobox props
 */
export type ComboboxProps<T = string> = SingleComboboxProps<T> | MultiComboboxProps<T>;
