import { cva, type VariantProps } from 'class-variance-authority';
import type { CSSProperties } from 'react';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const transferListVariants = cva('transfer-list', {
    variants: {
        disabled: {
            true: 'transfer-list--disabled',
        }
    },
    defaultVariants: {
        disabled: false,
    },
});

export type TransferListVariantProps = VariantProps<typeof transferListVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

export interface TransferItem {
    key: string;
    title?: string;
    description?: string;
    disabled?: boolean;
    [key: string]: unknown;
}

export interface TransferListProps {
    /** Data source for items */
    dataSource: TransferItem[];
    /** Keys of items currently in the right/target list */
    targetKeys: string[];
    /** Callback when items move between lists */
    onChange: (nextTargetKeys: string[], direction: 'left' | 'right', moveKeys: string[]) => void;
    /** Custom render function for list items */
    render?: (item: TransferItem) => React.ReactNode;
    /** Header titles for [left, right] lists */
    titles?: [string, string];
    /** Placeholder for search inputs */
    searchPlaceholder?: string;
    /** Whether lists are searchable */
    showSearch?: boolean;
    /** Class name for the container */
    className?: string;
    /** Style object for the container */
    style?: CSSProperties;
    /** Disabled state for the entire component */
    disabled?: boolean;
    /** Height of the list body */
    listHeight?: number;
}
