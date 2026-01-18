/**
 * DraggableMenu Component
 *
 * Drag-and-drop enabled menu for NestedSidebarShell
 * Uses HTML5 Drag & Drop API
 *
 * @package @pulwave/pages-shell
 */
import { useState, useCallback, useEffect } from 'react';
import { cn } from '@pulwave/utils';
import type { MenuItem } from './NestedSidebarShell';

interface DraggableMenuProps {
    items: MenuItem[];
    activeItem?: string;
    onItemClick?: (path: string) => void;
    isCollapsed?: boolean;
    enableDragDrop?: boolean;
    onReorder?: (items: MenuItem[]) => void;
}

export const DraggableMenu = ({
    items,
    activeItem,
    onItemClick,
    isCollapsed = false,
    enableDragDrop = false,
    onReorder,
}: DraggableMenuProps) => {
    const [draggedItem, setDraggedItem] = useState<MenuItem | null>(null);
    const [dragOverItem, setDragOverItem] = useState<MenuItem | null>(null);
    const [localItems, setLocalItems] = useState(items);

    // Update local items when props change
    useEffect(() => {
        setLocalItems(items);
    }, [items]);

    const handleDragStart = useCallback((e: React.DragEvent, item: MenuItem) => {
        if (!enableDragDrop) return;
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
    }, [enableDragDrop]);

    const handleDragOver = useCallback((e: React.DragEvent, item: MenuItem) => {
        if (!enableDragDrop || !draggedItem) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverItem(item);
    }, [enableDragDrop, draggedItem]);

    const handleDragLeave = useCallback(() => {
        setDragOverItem(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, targetItem: MenuItem) => {
        if (!enableDragDrop || !draggedItem || !onReorder) return;
        e.preventDefault();

        // Create new array with reordered items
        const newItems = [...localItems];
        const draggedIndex = newItems.findIndex(item => item.id === draggedItem.id);
        const targetIndex = newItems.findIndex(item => item.id === targetItem.id);

        if (draggedIndex !== -1 && targetIndex !== -1) {
            // Remove dragged item and insert at new position
            const [removed] = newItems.splice(draggedIndex, 1);
            newItems.splice(targetIndex, 0, removed);

            setLocalItems(newItems);
            onReorder(newItems);
        }

        setDraggedItem(null);
        setDragOverItem(null);
    }, [enableDragDrop, draggedItem, localItems, onReorder]);

    const handleDragEnd = useCallback(() => {
        setDraggedItem(null);
        setDragOverItem(null);
    }, []);

    const renderMenuItem = (item: MenuItem, index: number) => {
        const isActive = activeItem === item.path || activeItem === item.id;
        const isDragging = draggedItem?.id === item.id;
        const isDragOver = dragOverItem?.id === item.id;
        const Icon = item.icon;

        return (
            <div
                key={item.id}
                draggable={enableDragDrop}
                onDragStart={(e) => handleDragStart(e, item)}
                onDragOver={(e) => handleDragOver(e, item)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, item)}
                onDragEnd={handleDragEnd}
                className={cn(
                    'draggable-menu__item',
                    isActive && 'draggable-menu__item--active',
                    isDragging && 'draggable-menu__item--dragging',
                    isDragOver && 'draggable-menu__item--drag-over',
                    isCollapsed && 'draggable-menu__item--collapsed',
                    enableDragDrop && 'draggable-menu__item--draggable'
                )}
                onClick={() => item.path && onItemClick?.(item.path)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        item.path && onItemClick?.(item.path);
                    }
                }}
            >
                {enableDragDrop && (
                    <div className="draggable-menu__drag-handle" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <circle cx="4" cy="4" r="1.5" />
                            <circle cx="4" cy="8" r="1.5" />
                            <circle cx="4" cy="12" r="1.5" />
                            <circle cx="8" cy="4" r="1.5" />
                            <circle cx="8" cy="8" r="1.5" />
                            <circle cx="8" cy="12" r="1.5" />
                        </svg>
                    </div>
                )}
                {Icon && (
                    <div className="draggable-menu__icon" aria-hidden="true">
                        <Icon size={20} />
                    </div>
                )}
                {!isCollapsed && (
                    <span className="draggable-menu__label">{item.label}</span>
                )}
            </div>
        );
    };

    return (
        <div className="draggable-menu">
            {localItems.map((item, index) => renderMenuItem(item, index))}
        </div>
    );
};

DraggableMenu.displayName = 'DraggableMenu';
