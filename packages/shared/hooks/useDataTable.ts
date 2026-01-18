/**
 * useDataTable Hook
 * 
 * Provides table state management including pagination, sorting,
 * column resizing, and row/column drag-and-drop reordering.
 * 
 * @package @foundation/shared
 */
import { useState, useRef, useEffect, useCallback } from 'react';

// Types
export interface DataTableColumn {
    id: string;
    title?: string;
    width?: number;
    sortable?: boolean;
    resizable?: boolean;
    [key: string]: unknown;
}

export interface SortConfig {
    key: string | null;
    direction: 'asc' | 'desc';
}

export interface UseDataTableConfig<T> {
    initialColumns: DataTableColumn[];
    initialData: T[];
    onRowReorder?: (data: T[]) => void;
    onColumnReorder?: (columns: DataTableColumn[]) => void;
    onColumnResize?: (columns: DataTableColumn[]) => void;
    pagination?: boolean;
    itemsPerPage?: number;
}

export interface UseDataTableReturn<T> {
    columns: DataTableColumn[];
    data: T[];
    paginatedData: T[];
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    sortConfig: SortConfig;
    handleSort: (columnId: string) => void;
    resizingCol: string | null;
    startResize: (e: React.MouseEvent, colId: string, currentWidth?: number) => void;
    draggedRowIndex: number | null;
    handleRowDragStart: (e: React.DragEvent, index: number) => void;
    handleRowDragOver: (e: React.DragEvent, index: number) => void;
    handleRowDrop: (e: React.DragEvent, dropIndex: number) => void;
    draggedColIndex: number | null;
    handleColDragStart: (e: React.DragEvent, index: number) => void;
    handleColDragOver: (e: React.DragEvent, index: number) => void;
    handleColDrop: (e: React.DragEvent, dropIndex: number) => void;
}

interface ResizeRef {
    startX: number;
    startWidth: number;
    colId: string | null;
}

/**
 * Hook for managing data table state
 */
export function useDataTable<T extends Record<string, unknown>>({
    initialColumns,
    initialData,
    onRowReorder,
    onColumnReorder,
    onColumnResize,
    pagination = false,
    itemsPerPage = 10,
}: UseDataTableConfig<T>): UseDataTableReturn<T> {
    const [columns, setColumns] = useState<DataTableColumn[]>(initialColumns);
    const [data, setData] = useState<T[]>(initialData);
    const [currentPage, setCurrentPage] = useState(1);
    const [resizingCol, setResizingCol] = useState<string | null>(null);
    const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);
    const [draggedColIndex, setDraggedColIndex] = useState<number | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

    const resizeRef = useRef<ResizeRef>({ startX: 0, startWidth: 0, colId: null });

    // Sync data with initialData
    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    // Pagination Logic
    const safeData = Array.isArray(data) ? data : [];
    const totalPages = pagination ? Math.ceil(safeData.length / itemsPerPage) : 1;
    const paginatedData = pagination
        ? safeData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : safeData;

    // Sorting Logic
    const handleSort = useCallback((columnId: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === columnId && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: columnId, direction });

        const sorted = [...data].sort((a, b) => {
            const aVal = a[columnId];
            const bVal = b[columnId];
            // Handle various types for comparison
            if (aVal === bVal) return 0;
            if (aVal == null) return direction === 'asc' ? -1 : 1;
            if (bVal == null) return direction === 'asc' ? 1 : -1;
            // String/number comparison
            if (aVal < bVal) return direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setData(sorted);
    }, [data, sortConfig]);

    // Column Resizing Logic
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!resizeRef.current.colId) return;
        const diff = e.clientX - resizeRef.current.startX;
        const newWidth = Math.max(80, resizeRef.current.startWidth + diff);

        setColumns((prevCols) =>
            prevCols.map((col) =>
                col.id === resizeRef.current.colId ? { ...col, width: newWidth } : col
            )
        );
    }, []);

    const handleMouseUp = useCallback(() => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        setResizingCol(null);
        if (onColumnResize && resizeRef.current.colId) {
            onColumnResize(columns);
        }
        resizeRef.current = { startX: 0, startWidth: 0, colId: null };
    }, [columns, onColumnResize, handleMouseMove]);

    const startResize = useCallback((e: React.MouseEvent, colId: string, currentWidth?: number) => {
        e.preventDefault();
        e.stopPropagation();
        setResizingCol(colId);
        resizeRef.current = {
            startX: e.clientX,
            startWidth: currentWidth || 150,
            colId,
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove, handleMouseUp]);

    // Row Drag & Drop Logic
    const handleRowDragStart = useCallback((e: React.DragEvent, index: number) => {
        setDraggedRowIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    }, []);

    const handleRowDragOver = useCallback((e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedRowIndex === null || draggedRowIndex === index) return;
    }, [draggedRowIndex]);

    const handleRowDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedRowIndex === null) return;

        const newData = [...data];
        const [movedItem] = newData.splice(draggedRowIndex, 1);
        newData.splice(dropIndex, 0, movedItem);

        setData(newData);
        setDraggedRowIndex(null);
        if (onRowReorder) onRowReorder(newData);
    }, [data, draggedRowIndex, onRowReorder]);

    // Column Drag & Drop Logic
    const handleColDragStart = useCallback((e: React.DragEvent, index: number) => {
        setDraggedColIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    }, []);

    const handleColDragOver = useCallback((e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedColIndex === null || draggedColIndex === index) return;
    }, [draggedColIndex]);

    const handleColDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedColIndex === null) return;

        const newColumns = [...columns];
        const [movedCol] = newColumns.splice(draggedColIndex, 1);
        newColumns.splice(dropIndex, 0, movedCol);

        setColumns(newColumns);
        setDraggedColIndex(null);
        if (onColumnReorder) onColumnReorder(newColumns);
    }, [columns, draggedColIndex, onColumnReorder]);

    return {
        columns,
        data,
        paginatedData,
        totalPages,
        currentPage,
        setCurrentPage,
        sortConfig,
        handleSort,
        resizingCol,
        startResize,
        draggedRowIndex,
        handleRowDragStart,
        handleRowDragOver,
        handleRowDrop,
        draggedColIndex,
        handleColDragStart,
        handleColDragOver,
        handleColDrop,
    };
}

export default useDataTable;
