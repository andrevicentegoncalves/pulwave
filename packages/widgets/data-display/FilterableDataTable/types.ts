import { cva, type VariantProps } from 'class-variance-authority';
import { type DataTableProps } from '@pulwave/ui';

export const filterableDataTableVariants = cva('filterable-data-table', {
    variants: {},
    defaultVariants: {}
});

export const filterableDataTableHeaderVariants = cva('filterable-data-table__header', {
    variants: {},
    defaultVariants: {}
});

export const filterableDataTableTitleVariants = cva('filterable-data-table__title', {
    variants: {},
    defaultVariants: {}
});

export const filterableDataTableControlsWrapperVariants = cva('filterable-data-table__controls-wrapper', {
    variants: {
        justify: {
            start: 'justify-start', // Use utility or specific class if defined in SCSS
            end: 'justify-end',
            between: 'justify-between'
        }
    },
    defaultVariants: {
        justify: 'start',
    }
});

export const filterableDataTableSearchVariants = cva('filterable-data-table__search', {
    variants: {},
    defaultVariants: {}
});


export interface FilterableDataTableProps<T extends Record<string, unknown>> extends Omit<DataTableProps<T>, 'className'> {
    /** Callback for search input change */
    onSearch?: (term: string) => void;
    /** Current search value (if controlled) */
    searchValue?: string;
    /** Custom filter controls to display next to search */
    filterControls?: React.ReactNode;
    /** Title of the table/section */
    title?: string;
    /** Actions to display on the far right (like Export) */
    actions?: React.ReactNode;
    /** Pagination component */
    pagination?: React.ReactNode;
}
