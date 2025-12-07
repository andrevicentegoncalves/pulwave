import { useState, useRef, useEffect } from 'react';

const useDataTable = ({
    initialColumns,
    initialData,
    onRowReorder,
    onColumnReorder,
    onColumnResize,
    pagination,
    itemsPerPage
}) => {
    const [columns, setColumns] = useState(initialColumns);
    const [data, setData] = useState(initialData);
    const [currentPage, setCurrentPage] = useState(1);
    const [resizingCol, setResizingCol] = useState(null);
    const [draggedRowIndex, setDraggedRowIndex] = useState(null);
    const [draggedColIndex, setDraggedColIndex] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const resizeRef = useRef({ startX: 0, startWidth: 0, colId: null });

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    // Pagination Logic
    const totalPages = pagination ? Math.ceil(data.length / itemsPerPage) : 1;
    const paginatedData = pagination
        ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : data;

    // Sorting Logic
    const handleSort = (columnId) => {
        let direction = 'asc';
        if (sortConfig.key === columnId && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: columnId, direction });

        const sorted = [...data].sort((a, b) => {
            if (a[columnId] < b[columnId]) return direction === 'asc' ? -1 : 1;
            if (a[columnId] > b[columnId]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setData(sorted);
    };

    // Column Resizing Logic
    const startResize = (e, colId, currentWidth) => {
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
    };

    const handleMouseMove = (e) => {
        if (!resizeRef.current.colId) return;
        const diff = e.clientX - resizeRef.current.startX;
        const newWidth = Math.max(80, resizeRef.current.startWidth + diff);

        setColumns((prevCols) =>
            prevCols.map((col) =>
                col.id === resizeRef.current.colId ? { ...col, width: newWidth } : col
            )
        );
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        setResizingCol(null);
        if (onColumnResize && resizeRef.current.colId) {
            onColumnResize(columns);
        }
        resizeRef.current = { startX: 0, startWidth: 0, colId: null };
    };

    // Row Drag & Drop Logic
    const handleRowDragStart = (e, index) => {
        setDraggedRowIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleRowDragOver = (e, index) => {
        e.preventDefault();
        if (draggedRowIndex === null || draggedRowIndex === index) return;
    };

    const handleRowDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedRowIndex === null) return;

        const newData = [...data];
        const [movedItem] = newData.splice(draggedRowIndex, 1);
        newData.splice(dropIndex, 0, movedItem);

        setData(newData);
        setDraggedRowIndex(null);
        if (onRowReorder) onRowReorder(newData);
    };

    // Column Drag & Drop Logic
    const handleColDragStart = (e, index) => {
        setDraggedColIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleColDragOver = (e, index) => {
        e.preventDefault();
        if (draggedColIndex === null || draggedColIndex === index) return;
    };

    const handleColDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedColIndex === null) return;

        const newColumns = [...columns];
        const [movedCol] = newColumns.splice(draggedColIndex, 1);
        newColumns.splice(dropIndex, 0, movedCol);

        setColumns(newColumns);
        setDraggedColIndex(null);
        if (onColumnReorder) onColumnReorder(newColumns);
    };

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
        handleColDrop
    };
};

export default useDataTable;
