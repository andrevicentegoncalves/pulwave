import React, { useRef } from 'react';
import clsx from 'clsx';
import { ChevronUp, ChevronDown, GripVertical } from './iconLibrary';
import Pagination from './Pagination';
import ScrollArea from './ScrollArea';
import useDataTable from '../../hooks/useDataTable';

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
    const tableRef = useRef(null);

    const {
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
        handleColDragStart,
        handleColDragOver,
        handleColDrop
    } = useDataTable({
        initialColumns,
        initialData,
        onRowReorder,
        onColumnReorder,
        onColumnResize,
        pagination,
        itemsPerPage
    });

    return (
        <div className={clsx('data-table-container', className)}>
            <ScrollArea className="table-scroll-wrapper" orientation="horizontal">
                <table ref={tableRef}>
                    <thead>
                        <tr>
                            {onRowReorder && <th className="drag-handle-header"></th>}

                            {columns.map((col, colIndex) => (
                                <th
                                    key={col.id}
                                    style={{ width: col.width }}
                                    className={clsx({
                                        'sticky-col': col.locked,
                                        'sortable': col.sortable
                                    })}
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
                                                    <ChevronDown size={12} className="opacity-30" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    {!col.locked && (
                                        <div
                                            className={clsx('resize-handle', { 'resizing': resizingCol === col.id })}
                                            onMouseDown={(e) => startResize(e, col.id, col.width)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, index) => {
                            const rowKey = row.id || `row-${index}`;
                            return (
                                <tr
                                    key={rowKey}
                                    draggable={!!onRowReorder}
                                    onDragStart={(e) => handleRowDragStart(e, index)}
                                    onDragOver={(e) => handleRowDragOver(e, index)}
                                    onDrop={(e) => handleRowDrop(e, index)}
                                    className={clsx({
                                        'dragging': draggedRowIndex === index,
                                        'draggable': onRowReorder && draggedRowIndex !== index
                                    })}
                                >
                                    {onRowReorder && (
                                        <td className="drag-handle-cell">
                                            <GripVertical size={14} />
                                        </td>
                                    )}

                                    {columns.map((col) => (
                                        <td
                                            key={`${rowKey}-${col.id}`}
                                            className={clsx(col.type, { 'sticky-col': col.locked })}
                                        >
                                            {col.render ? col.render(row[col.id], row) : row[col.id]}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </ScrollArea>

            {
                pagination && (
                    <div className="table-footer">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            showFirstLast={true}
                            showInput={false}
                        />
                    </div>
                )
            }
        </div >
    );
};

export default DataTable;
