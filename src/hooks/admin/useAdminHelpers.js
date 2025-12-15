import { useState, useCallback } from 'react';

/**
 * useModalState - Reusable hook for modal open/close state management
 * Reduces boilerplate for modal state across admin pages
 * 
 * @param {any} initialData - Optional initial data for the modal
 * @returns {{ isOpen, data, open, close, setData }}
 * 
 * @example
 * const editModal = useModalState();
 * // Open with data: editModal.open(record);
 * // Close: editModal.close();
 * // Access: editModal.isOpen, editModal.data
 */
export const useModalState = (initialData = null) => {
    const [state, setState] = useState({ isOpen: false, data: initialData });

    const open = useCallback((data = null) => {
        setState({ isOpen: true, data });
    }, []);

    const close = useCallback(() => {
        setState({ isOpen: false, data: null });
    }, []);

    const setData = useCallback((data) => {
        setState(prev => ({ ...prev, data }));
    }, []);

    return {
        isOpen: state.isOpen,
        data: state.data,
        open,
        close,
        setData,
    };
};

/**
 * usePaginatedList - Reusable hook for paginated list state management
 * Handles page, pageSize with localStorage persistence, and search debouncing
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.storageKey - LocalStorage key for pageSize persistence
 * @param {number} options.defaultPageSize - Default page size (default: 10)
 * @returns {{ page, setPage, pageSize, setPageSize, handlePageSizeChange }}
 * 
 * @example
 * const pagination = usePaginatedList({ storageKey: 'admin_users_pageSize' });
 * // pagination.page, pagination.pageSize
 * // <Select onChange={pagination.handlePageSizeChange} />
 */
export const usePaginatedList = (options = {}) => {
    const { storageKey, defaultPageSize = 10 } = options;

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(() => {
        if (storageKey) {
            const saved = localStorage.getItem(storageKey);
            return saved ? parseInt(saved, 10) : defaultPageSize;
        }
        return defaultPageSize;
    });

    const handlePageSizeChange = useCallback((e) => {
        const newSize = parseInt(e.target.value, 10);
        setPageSize(newSize);
        if (storageKey) {
            localStorage.setItem(storageKey, newSize.toString());
        }
        setPage(1); // Reset to first page
    }, [storageKey]);

    const resetPage = useCallback(() => {
        setPage(1);
    }, []);

    return {
        page,
        setPage,
        pageSize,
        setPageSize,
        handlePageSizeChange,
        resetPage,
    };
};

/**
 * useDebouncedSearch - Hook for debounced search input
 * 
 * @param {string} initialValue - Initial search value
 * @param {number} delay - Debounce delay in ms (default: 500)
 * @returns {{ search, debouncedSearch, setSearch, clearSearch }}
 */
import { useEffect } from 'react';

export const useDebouncedSearch = (initialValue = '', delay = 500) => {
    const [search, setSearch] = useState(initialValue);
    const [debouncedSearch, setDebouncedSearch] = useState(initialValue);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, delay);
        return () => clearTimeout(handler);
    }, [search, delay]);

    const clearSearch = useCallback(() => {
        setSearch('');
        setDebouncedSearch('');
    }, []);

    return {
        search,
        debouncedSearch,
        setSearch,
        clearSearch,
    };
};

export default { useModalState, usePaginatedList, useDebouncedSearch };
