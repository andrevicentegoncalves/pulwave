import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, Edit2, GripVertical } from 'lucide-react';
import Pagination from './Pagination';

const DataTable = ({
    columns: initialColumns,
    data: initialData,
    onRowReorder,
    onColumnReorder,
    onColumnResize,
    pagination = false,
    itemsPerPage = 10,
    className = '',
}) => {
    const [columns, setColumns] = useState(initialColumns);
    const [data, setData] = useState(initialData);
    const [currentPage, setCurrentPage] = useState(1);
    const [resizingCol, setResizingCol] = useState(null);
    const [draggedRowIndex, setDraggedRowIndex] = useState(null);
    const [draggedColIndex, setDraggedColIndex] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const tableRef = useRef(null);
    const resizeRef = useRef({ startX: 0, startWidth: 0, colId: null });

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    // Pagination
    const totalPages = pagination ? Math.ceil(data.length / itemsPerPage) : 1;
    const paginatedData = pagination
        ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : data;

    // Sorting
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

    // Column Resizing
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

    // Row Drag & Drop
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

    // Column Drag & Drop
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

    return (
        <div className={`data-table-container ${className}`}>
            <div className="table-scroll-wrapper">
                <table ref={tableRef}>
                    <thead>
                        <tr>
                            {onRowReorder && <th className="drag-handle-header"></th>}

                            {columns.map((col, colIndex) => (
                                <th
                                    key={col.id}
                                    style={{ width: col.width }}
                                    className={`${col.locked ? 'sticky-col' : ''} ${col.sortable ? 'sortable' : ''}`}
                                    onClick={() => col.sortable && handleSort(col.id)}
                                    draggable={!col.locked}
                                    onDragStart={(e) => !col.locked && handleColDragStart(e, colIndex)}
                                    onDragOver={(e) => !col.locked && handleColDragOver(e, colIndex)}
                                    onDrop={(e) => !col.locked && handleColDrop(e, colIndex)}
                                >
                                    <div className="th-content">
                                        <span>{col.title}</span>
                                        {col.sortable && (
                                            <span className="sort-icon">
                                                {sortConfig.key === col.id ? (
                                                    sortConfig.direction === 'asc' ?
                                                        <ChevronUp size={12} /> :
                                                        <ChevronDown size={12} />
                                                ) : (
                                                    <ChevronDown size={12} style={{ opacity: 0.3 }} />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    {!col.locked && (
                                        <div
                                            className={`resize-handle ${resizingCol === col.id ? 'resizing' : ''}`}
                                            onMouseDown={(e) => startResize(e, col.id, col.width)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, index) => (
                            <tr
                                key={row.id || index}
                                draggable={!!onRowReorder}
                                onDragStart={(e) => handleRowDragStart(e, index)}
                                onDragOver={(e) => handleRowDragOver(e, index)}
                                onDrop={(e) => handleRowDrop(e, index)}
                                className={draggedRowIndex === index ? 'dragging' : (onRowReorder ? 'draggable' : '')}
                            >
                                {onRowReorder && (
                                    <td className="drag-handle-cell">
                                        <GripVertical size={14} />
                                    </td>
                                )}

                                {columns.map((col) => (
                                    <td
                                        key={`${row.id}-${col.id}`}
                                        className={`${col.locked ? 'sticky-col' : ''} ${col.type || ''}`}
                                    >
                                        {col.render ? col.render(row[col.id], row) : row[col.id]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <div className="table-footer">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        showFirstLast={true}
                        showInput={false}
                    />

                    {/* Progress bar */}
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${(data.filter(item => item.downloads > 0).length / data.length) * 100}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
