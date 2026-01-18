import { type ReactNode } from 'react';
import { cn } from '@pulwave/utils';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from '../../icon-library';
import { paginationVariants, type PaginationProps } from './types';
import './styles/_index.scss';

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
    showFirstLast = false,
    className,
    ...props
}: PaginationProps) => {
    const usePaginationRange = () => {
        const totalPageNumbers = siblingCount + 5;

        if (totalPageNumbers >= totalPages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, 'DOTS', totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
            return [firstPageIndex, 'DOTS', ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
            return [firstPageIndex, 'DOTS', ...middleRange, 'DOTS', lastPageIndex];
        }

        return [];
    };

    const paginationRange = usePaginationRange();

    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const onFirst = () => {
        if (currentPage > 1) onPageChange(1);
    };

    const onLast = () => {
        if (currentPage < totalPages) onPageChange(totalPages);
    };

    return (
        <nav
            className={cn(paginationVariants(), className)}
            aria-label="Pagination"
            {...props}
        >
            {showFirstLast && (
                <button
                    className="pagination__button pagination__button--icon"
                    onClick={onFirst}
                    disabled={currentPage === 1}
                    aria-label="First Page"
                >
                    <ChevronsLeft size={16} aria-hidden="true" />
                </button>
            )}

            <button
                className="pagination__button pagination__button--icon"
                onClick={onPrevious}
                disabled={currentPage === 1}
                aria-label="Previous Page"
            >
                <ChevronLeft size={16} aria-hidden="true" />
            </button>

            {paginationRange.map((pageNumber, index) => {
                if (pageNumber === 'DOTS') {
                    return (
                        <span key={`dots-${index}`} className="pagination__ellipsis" aria-hidden="true">
                            <MoreHorizontal size={16} />
                        </span>
                    );
                }

                return (
                    <button
                        key={pageNumber}
                        className={cn(
                            'pagination__button',
                            pageNumber === currentPage && 'pagination__button--active'
                        )}
                        onClick={() => onPageChange(pageNumber as number)}
                        aria-current={pageNumber === currentPage ? 'page' : undefined}
                    >
                        {pageNumber}
                    </button>
                );
            })}

            <button
                className="pagination__button pagination__button--icon"
                onClick={onNext}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
            >
                <ChevronRight size={16} aria-hidden="true" />
            </button>

            {showFirstLast && (
                <button
                    className="pagination__button pagination__button--icon"
                    onClick={onLast}
                    disabled={currentPage === totalPages}
                    aria-label="Last Page"
                >
                    <ChevronsRight size={16} aria-hidden="true" />
                </button>
            )}
        </nav>
    );
};
Pagination.displayName = 'Pagination';
