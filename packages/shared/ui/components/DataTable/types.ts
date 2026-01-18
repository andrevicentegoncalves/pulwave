
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const dataTableVariants = cva('data-table', {
    variants: {
        density: {
            compact: 'data-table--compact',
            normal: 'data-table--normal',
            relaxed: 'data-table--relaxed',
        }
    },
    defaultVariants: {
        density: 'normal',
    },
});

export interface DataTableColumn<T = Record<string, unknown>> {
    key?: string;
    id?: string;
    header?: React.ReactNode;
    title?: React.ReactNode; // For backward compatibility
    render?: (value: unknown, row: T) => React.ReactNode;
    width?: string | number;
    sortable?: boolean;
    className?: string;
}

export interface DataTableColumnProps<T = Record<string, unknown>> extends DataTableColumn<T> {
    children?: React.ReactNode; // Not strictly needed for logic but for JSX structure
}

export interface DataTableProps<T = Record<string, unknown>> extends VariantProps<typeof dataTableVariants> {
    data: T[];
    columns?: DataTableColumn<T>[];
    children?: React.ReactNode;
    keyField?: string;
    loading?: boolean;
    emptyMessage?: React.ReactNode;
    onRowClick?: (row: T) => void;
    className?: string;
}
