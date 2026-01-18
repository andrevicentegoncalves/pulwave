
import React, { useState, useId } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@pulwave/utils';
import { dataListVariants, type DataListProps, type DataListItemState } from './types';
import { Checkbox } from '../Checkbox';
import './styles/_index.scss';


// Sortable Item Wrapper
interface SortableItemProps<T> {
    id: string;
    item: T;
    index: number;
    renderItem: (item: T, state: DataListItemState, index: number) => React.ReactNode;
    isSelected: boolean;
    draggable: boolean;
}

function SortableItem<T>({ id, item, index, renderItem, isSelected, draggable }: SortableItemProps<T>) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id, disabled: !draggable });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // State object for renderProp
    const state: DataListItemState = {
        isDragging,
        isSelected,
        isHovered: false, // Could be enhanced with onMouseEnter
    };

    // If draggable, we wrap the content or provide handle logic (handled in renderItem ideally or wrapper)
    // Here we wrap the whole item in the li ref
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...(draggable ? attributes : {})}
            {...(draggable ? listeners : {})}
            className={cn(
                'data-list__item',
                isDragging && 'data-list__item--state-dragging',
                isSelected && 'data-list__item--state-selected'
            )}
            role="listitem"
        >
            {renderItem(item, state, index)}
        </div>
    );
}

/**
 * DataList
 * 
 * Enterprise-grade list component with Drag & Drop and Selection support.
 */
export const DataList = <T,>({
    data = [],
    keyExtractor,
    renderItem,
    selectable = 'none',
    draggable = false,
    onReorder,
    onSelectionChange,
    selectedIds = [], // controlled usually, or internal
    variant = 'default',
    className,
    ariaLabel = 'Data List',
}: DataListProps<T>) => {
    // Sensors for Dnd
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = data.findIndex((item) => keyExtractor(item) === active.id);
            const newIndex = data.findIndex((item) => keyExtractor(item) === over.id);

            if (onReorder) {
                onReorder(arrayMove(data, oldIndex, newIndex));
            }
        }
    };

    const isSelected = (id: string) => selectedIds.includes(id);

    return (
        <div
            className={cn(dataListVariants({ variant }), className)}
            role="list"
            aria-label={ariaLabel}
        >
            {draggable ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={data.map(keyExtractor)}
                        strategy={verticalListSortingStrategy}
                    >
                        {data.map((item, index) => {
                            const id = keyExtractor(item);
                            const selected = isSelected(id);
                            return (
                                <SortableItem
                                    key={id}
                                    id={id}
                                    item={item}
                                    index={index}
                                    renderItem={(item, state, idx) => (
                                        <>
                                            {selectable !== 'none' && (
                                                <div className="data-list__selection" onClick={(e) => e.stopPropagation()} role="presentation">
                                                    <Checkbox
                                                        checked={selected}
                                                        onChange={() => {
                                                            if (selectable === 'single') {
                                                                onSelectionChange?.([id]);
                                                            } else {
                                                                const newIds = selected
                                                                    ? selectedIds.filter(i => i !== id)
                                                                    : [...selectedIds, id];
                                                                onSelectionChange?.(newIds);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            {renderItem(item, state, idx)}
                                        </>
                                    )}
                                    isSelected={selected}
                                    draggable={draggable}
                                />
                            );
                        })}
                    </SortableContext>
                </DndContext>
            ) : (
                data.map((item, index) => {
                    const id = keyExtractor(item);
                    const selected = isSelected(id);
                    const handleSelection = () => {
                        if (selectable !== 'none') {
                            if (selectable === 'single') {
                                onSelectionChange?.([id]);
                            } else {
                                const newIds = selected
                                    ? selectedIds.filter(i => i !== id)
                                    : [...selectedIds, id];
                                onSelectionChange?.(newIds);
                            }
                        }
                    };
                    return (
                        <div
                            key={id}
                            className={cn(
                                'data-list__item',
                                selected && 'data-list__item--state-selected'
                            )}
                            role="listitem"
                            tabIndex={selectable !== 'none' ? 0 : undefined}
                            onClick={handleSelection}
                            onKeyDown={(e) => {
                                if (selectable !== 'none' && (e.key === 'Enter' || e.key === ' ')) {
                                    e.preventDefault();
                                    handleSelection();
                                }
                            }}
                        >
                            {selectable !== 'none' && (
                                <div className="data-list__selection">
                                    <Checkbox
                                        checked={selected}
                                        readOnly
                                        className="data-list__selection-checkbox"
                                    />
                                </div>
                            )}
                            {renderItem(item, {
                                isDragging: false,
                                isSelected: selected,
                                isHovered: false
                            }, index)}
                        </div>
                    );
                })
            )}
        </div>
    );
};

DataList.displayName = 'DataList';

// Subcomponents for easy composition
DataList.Handle = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('data-list__handle', className)} {...props}>
        {/* Default Grip Icon or allow children */}
        {props.children || (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M4 3h8v2H4zM4 7h8v2H4zM4 11h8v2H4z" />
            </svg>
        )}
    </div>
);

DataList.Content = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('data-list__content', className)} {...props}>
        {children}
    </div>
);

DataList.Actions = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('data-list__actions', className)} {...props}>
        {children}
    </div>
);
