import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const selectVariants = cva('select', {
    variants: {
        size: {
            xs: 'select--size-xs',
            s: 'select--size-s',
            m: 'select--size-m',
            l: 'select--size-l',
            xl: 'select--size-xl',
        },
        fullWidth: {
            true: 'select--full-width',
        },
        disabled: {
            true: 'select--disabled',
        },
        isOpen: {
            true: 'select--open',
        }
    },
    defaultVariants: {
        size: 'm',
        fullWidth: false,
    },
});

export type SelectVariantProps = VariantProps<typeof selectVariants>;

// ============================================================================ //
//                          BASE SELECT TYPES                                   //
// ============================================================================ //

/**
 * Individual option in a select dropdown
 */
export interface SelectOption<T extends string | number = string | number> {
    /** Unique value for the option */
    value: T;
    /** Display label */
    label: string;
    /** Optional icon to display */
    icon?: ReactNode;
    /** Disabled state */
    disabled?: boolean;
    /** Optional group key for grouped options */
    group?: string;
    /** Additional search terms for filtering */
    searchTerms?: string[];
    /** Recursive children for tree mode */
    children?: SelectOption<T>[];
    /** Whether node can be expanded */
    isExpandable?: boolean;
}

/**
 * Base props shared by all select modes
 */
/**
 * Base props shared by all select modes
 */
export interface BaseSelectProps<T extends string | number> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect' | 'id'> {
    options: SelectOption<T>[];
    placeholder?: string;
    disabled?: boolean;
    error?: boolean | string;
    loading?: boolean;
    /** Full width mode */
    fullWidth?: boolean;
    /** Additional CSS class */
    className?: string;
    /** Label text */
    label?: string;
    /** Size variant */
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
    /** Input name for forms */
    name?: string;
    /** Input id */
    id?: string;
    /** Enable search/filter */
    searchable?: boolean;
    /** Search input placeholder */
    searchPlaceholder?: string;
    /** Custom option renderer */
    renderOption?: (option: SelectOption<T>, isSelected: boolean) => ReactNode;
    /** Custom trigger value renderer */
    renderValue?: (selected: SelectOption<T> | SelectOption<T>[] | null) => ReactNode;
    /** Enable tree mode */
    tree?: boolean;
    /** Check recursively in tree mode */
    recursiveSelection?: boolean;
    /** Callback when node is expanded (for lazy load) */
    onExpand?: (value: T) => void;
    /** Loading nodes for lazy trees */
    loadingNodes?: T[];
    /** Icon to show in trigger before placeholder/value */
    triggerIcon?: ReactNode;
    /** Keep showing trigger icon even when value is selected */
    persistTriggerIcon?: boolean;
    /** Callback for auto-locate action (shows locate button in dropdown) */
    onAutoLocate?: () => void;
    /** Label for auto-locate button */
    autoLocateLabel?: string;
    /** Whether auto-locate is in progress */
    autoLocating?: boolean;
    /** Enable grouped mode (options must have 'group' property) */
    grouped?: boolean;
}

export interface SingleSelectProps<T extends string | number> extends BaseSelectProps<T> {
    multiple?: false;
    value?: T | null;
    onChange: (value: T) => void;

    // Multi-select specific props (disabled in single select)
    showSelectAll?: never;
    showFooter?: never;
    showTagsInTrigger?: never;
}

export interface MultiSelectProps<T extends string | number> extends BaseSelectProps<T> {
    multiple: true;
    value?: T[];
    onChange: (values: T[]) => void;

    /** Multi-select specific: Show "Select All" row */
    showSelectAll?: boolean;
    /** Multi-select specific: Show footer with count */
    showFooter?: boolean;
    /** Multi-select specific: Show tags in trigger (default: true) - set false for compact display */
    showTagsInTrigger?: boolean;
}

export type SelectProps<T extends string | number> = SingleSelectProps<T> | MultiSelectProps<T>;

/**
 * Type guard to check if props are for multi-select mode
 */
export const isMultiSelect = <T extends string | number>(props: SelectProps<T>): props is MultiSelectProps<T> => {
    return props.multiple === true;
};

/**
 * Type guard to check if props are for single-select mode
 */
export const isSingleSelect = <T extends string | number>(props: SelectProps<T>): props is SingleSelectProps<T> => {
    return !props.multiple;
};

// Re-export for easier migration
export type { SelectOption as Option };
export type MultiSelectDropdownProps<T extends string | number = string | number> = MultiSelectProps<T>;
