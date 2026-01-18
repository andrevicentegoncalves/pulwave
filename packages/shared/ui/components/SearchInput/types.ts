import { cva, type VariantProps } from 'class-variance-authority';
import type { InputProps } from '../Input/types';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const searchInputVariants = cva('search-input', {
    variants: {
        size: {
            s: 'search-input--size-s',
            m: 'search-input--size-m',
            l: 'search-input--size-l',
        },
        fullWidth: {
            true: 'search-input--full-width',
        },
    },
    defaultVariants: {
        size: 'm',
        fullWidth: false,
    },
});

export const searchClearVariants = cva('search-input__clear', {
    variants: {
        size: {
            s: 'search-input__clear--size-s',
            m: 'search-input__clear--size-m',
            l: 'search-input__clear--size-l',
        }
    },
    defaultVariants: {
        size: 'm'
    }
});

export type SearchInputVariantProps = VariantProps<typeof searchInputVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon' | 'type'>, SearchInputVariantProps {
    /** Callback when clear button is clicked */
    onClear?: () => void;
}
