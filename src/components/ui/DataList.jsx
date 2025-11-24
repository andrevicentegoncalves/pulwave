import React, { useState, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

const DataList = ({
    data: initialData,
    renderItem,
    onReorder,
    className = '',
}) => {
    const [data, setData] = useState(initialData);
    const [draggedIndex, setDraggedIndex] = useState(null);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        // Optional: set drag image
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex === null) return;

        const newData = [...data];
        const [movedItem] = newData.splice(draggedIndex, 1);
        newData.splice(dropIndex, 0, movedItem);

        setData(newData);
        setDraggedIndex(null);
        if (onReorder) onReorder(newData);
    };

    return (
        <div className={`data-list-container ${className}`}>
            {data.map((item, index) => (
                <div
                    key={item.id || index}
                    className={`data-list-item ${onReorder ? 'draggable' : ''} ${draggedIndex === index ? 'dragging' : ''} ${item.selected ? 'selected' : ''}`}
                    draggable={!!onReorder}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                >
                    {onReorder && (
                        <div className="drag-handle">
                            <GripVertical size={16} />
                        </div>
                    )}
                    <div className="list-item-content">
                        {renderItem(item, index)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DataList;
