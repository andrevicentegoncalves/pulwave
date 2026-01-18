import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

export const bulkActionBarVariants = cva('bulk-action-bar', {
    variants: {},
    defaultVariants: {}
});

export const bulkActionBarContentVariants = cva('bulk-action-bar__content', {
    variants: {},
    defaultVariants: {}
});

export const bulkActionBarLayoutVariants = cva('bulk-action-bar__layout', {
    variants: {},
    defaultVariants: {}
});

export const bulkActionBarSelectionInfoVariants = cva('bulk-action-bar__selection-info', {
    variants: {},
    defaultVariants: {}
});

export const bulkActionBarCountVariants = cva('bulk-action-bar__count', {
    variants: {},
    defaultVariants: {}
});

export const bulkActionBarLabelVariants = cva('bulk-action-bar__label', {
    variants: {},
    defaultVariants: {}
});

export const bulkActionBarDividerVariants = cva('bulk-action-bar__divider', {
    variants: {},
    defaultVariants: {}
});

export const bulkActionBarClearBtnVariants = cva('bulk-action-bar__clear-btn', {
    variants: {},
    defaultVariants: {}
});

export const bulkActionBarActionsVariants = cva('bulk-action-bar__actions', {
    variants: {},
    defaultVariants: {}
});


export interface BulkActionBarProps {
    /** Whether the action bar is open/visible */
    open: boolean;
    /** Number of items selected */
    selectedCount: number;
    /** Total number of items (optional, for context) */
    totalCount?: number;
    /** Callback to clear selection */
    onClearSelection: () => void;
    /** Actions to display (Buttons, etc.) */
    actions: ReactNode;
    /** Whether to use a portal to render at document body end (default: true) */
    usePortal?: boolean;
    /** Additional class name */
    className?: string;
}
