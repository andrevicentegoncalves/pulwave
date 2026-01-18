import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

export const searchFilterVariants = cva('search-and-filter', {
    variants: {},
    defaultVariants: {}
});

export const searchFilterPlaceholderWrapperVariants = cva('search-and-filter__placeholder-wrapper', {
    variants: {
        isExpanded: {
            true: 'search-and-filter__placeholder-wrapper--is-expanded',
            false: '',
        }
    },
    defaultVariants: {
        isExpanded: false,
    }
});

export interface ActiveFilter {
    label: string;
    onRemove?: () => void;
}

export interface SearchFilterProps {
    /** Search placeholder */
    placeholder?: string;
    /** Search callback */
    onSearch?: (term: string) => void;
    /** Reset callback */
    onReset?: () => void;
    /** Controlled expanded state */
    isExpanded?: boolean;
    /** Active filter badges */
    activeFilters?: (ActiveFilter | string)[];
    /** Filter controls (shown when expanded) */
    children?: ReactNode;
    /** Additional class name */
    className?: string;
}
