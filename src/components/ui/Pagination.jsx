import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';

/**
 * Pagination Component
 * 
 * @param {number} currentPage - Current active page (1-indexed)
 * @param {number} totalPages - Total number of pages
 * @param {function} onPageChange - Callback when page changes
 * @param {number} siblingCount - Number of page buttons to show on each side of current page
 * @param {boolean} showFirstLast - Show first/last page buttons
 * @param {boolean} showInput - Show page input field
 * @param {string} className - Additional CSS classes
 */
const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    siblingCount = 1,
    showFirstLast = true,
    showInput = false,
    className = ''
}) => {
    const [inputValue, setInputValue] = React.useState(currentPage.toString());

    React.useEffect(() => {
        setInputValue(currentPage.toString());
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange?.(page);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInputSubmit = (e) => {
        e.preventDefault();
        const pageNum = parseInt(inputValue, 10);
        if (!isNaN(pageNum)) {
            handlePageChange(pageNum);
        } else {
            setInputValue(currentPage.toString());
        }
    };

    // Generate page numbers array
    const getPageNumbers = () => {
        const pages = [];
        const leftSibling = Math.max(currentPage - siblingCount, 1);
        const rightSibling = Math.min(currentPage + siblingCount, totalPages);

        // Always show first page
        if (leftSibling > 1) {
            pages.push(1);
            if (leftSibling > 2) {
                pages.push('ellipsis-left');
            }
        }

        // Show sibling pages
        for (let i = leftSibling; i <= rightSibling; i++) {
            pages.push(i);
        }

        // Always show last page
        if (rightSibling < totalPages) {
            if (rightSibling < totalPages - 1) {
                pages.push('ellipsis-right');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    const startItem = (currentPage - 1) * 10 + 1;
    const endItem = Math.min(currentPage * 10, totalPages * 10);
    const totalItems = totalPages * 10;

    return (
        <div className={`pagination ${className}`}>
            <div className="pagination__counter">
                {startItem}-{endItem} of {totalItems}
            </div>

            <div className="pagination__container">
                {/* First Page Button */}
                {showFirstLast && (
                    <button
                        className="pagination__button"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        aria-label="First page"
                    >
                        <ChevronsLeft size={16} />
                    </button>
                )}

                {/* Previous Page Button */}
                <button
                    className="pagination__button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Page Number Buttons */}
                {pageNumbers.map((page, index) => {
                    if (typeof page === 'string' && page.startsWith('ellipsis')) {
                        return (
                            <button
                                key={page}
                                className="pagination__button pagination__button--ellipsis"
                                disabled
                                aria-label="More pages"
                            >
                                <MoreHorizontal size={16} />
                            </button>
                        );
                    }

                    return (
                        <button
                            key={page}
                            className={`pagination__button ${page === currentPage ? 'pagination__button--active' : ''}`}
                            onClick={() => handlePageChange(page)}
                            aria-label={`Page ${page}`}
                            aria-current={page === currentPage ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    );
                })}

                {/* Next Page Button */}
                <button
                    className="pagination__button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                >
                    <ChevronRight size={16} />
                </button>

                {/* Last Page Button */}
                {showFirstLast && (
                    <button
                        className="pagination__button"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        aria-label="Last page"
                    >
                        <ChevronsRight size={16} />
                    </button>
                )}

                {/* Page Input (optional) */}
                {showInput && (
                    <form className="pagination__input" onSubmit={handleInputSubmit}>
                        <span>Go to</span>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputSubmit}
                            className="pagination__input-field"
                            aria-label="Go to page"
                        />
                    </form>
                )}
            </div>
        </div>
    );
};

export default Pagination;
