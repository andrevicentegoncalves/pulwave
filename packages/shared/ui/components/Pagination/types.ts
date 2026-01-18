
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const paginationVariants = cva('pagination', {
    variants: {},
    defaultVariants: {},
});

export interface PaginationProps extends VariantProps<typeof paginationVariants> {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    showFirstLast?: boolean;
    className?: string;
}
