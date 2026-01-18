import { cva, type VariantProps } from 'class-variance-authority';

export const columnChipsVariants = cva('column-chips', {
    variants: {
        empty: {
            true: 'column-chips--empty',
        }
    },
    defaultVariants: {
        empty: false,
    },
});

export type ColumnChipsVariants = VariantProps<typeof columnChipsVariants>;

export type ColumnChipsSize = 'xs' | 's' | 'm';
export type ColumnChipsVariant = 'solid' | 'light' | 'outline';

export interface ColumnChipsProps extends ColumnChipsVariants {
    /** Data object: { table_name: ['column1', 'column2'] } */
    data?: Record<string, string[]>;
    /** Remove table handler */
    onRemove?: (table: string) => void;
    /** Remove column handler */
    onRemoveColumn?: (table: string, column: string) => void;
    /** Max tables to show */
    maxTablesShown?: number;
    /** Max columns per table */
    maxColumnsShown?: number;
    /** Badge size */
    size?: ColumnChipsSize;
    /** Badge variant */
    variant?: ColumnChipsVariant;
    /** Show remove buttons */
    editable?: boolean;
    /** Empty text */
    emptyText?: string;
    /** Additional class */
    className?: string;
}
