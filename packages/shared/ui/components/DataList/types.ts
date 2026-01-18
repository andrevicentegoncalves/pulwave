import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const dataListVariants = cva('data-list', {
    variants: {
        variant: {
            default: '',
            compact: 'data-list--compact',
            cards: 'data-list--cards',
        }
    },
    defaultVariants: {
        variant: 'default',
    },
});

export type DataListVariantProps = VariantProps<typeof dataListVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

export interface DataListItemState {
    isDragging: boolean;
    isSelected: boolean;
    isHovered: boolean;
}

export interface DataListProps<T> extends DataListVariantProps {
    /** Array of data items to render */
    data: T[];
    /** render prop for each item */
    renderItem: (item: T, state: DataListItemState, index: number) => ReactNode;
    /** Unique key extractor for items */
    keyExtractor: (item: T) => string;
    /** Selection mode */
    selectable?: 'none' | 'single' | 'multiple';
    /** Enable drag and drop reordering */
    draggable?: boolean;
    /** Callback when order changes */
    onReorder?: (newOrder: T[]) => void;
    /** Callback when selection changes */
    onSelectionChange?: (selectedIds: string[]) => void;
    /** currently selected IDs (controlled) */
    selectedIds?: string[];
    /** Custom class name */
    className?: string;
    /** ARIA label */
    ariaLabel?: string;
}
