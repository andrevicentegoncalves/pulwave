import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

export const groupRowVariants = cva('group-row', {
    variants: {
        isSingle: {
            true: 'group-row--single',
            false: '',
        },
        expanded: {
            true: 'group-row--expanded',
            false: '',
        }
    },
    defaultVariants: {
        isSingle: false,
        expanded: false,
    }
});

export const groupRowHeaderVariants = cva('group-row__header', {
    variants: {
        level: {
            top: 'group-row__header--top-level',
            nested: 'group-row__header--nested',
        }
    },
    defaultVariants: {
        level: 'top',
    }
});

export interface GroupRowItem {
    id?: string | number;
    [key: string]: unknown;
}

export interface GroupRowProps {
    title: string;
    icon?: ReactNode;
    items?: GroupRowItem[];
    children?: ReactNode;
    localeKey?: string;
    textKey?: string;
    allPublished?: boolean;
    totalLocales?: number;
    onEdit?: (item: GroupRowItem) => void;
    onDelete?: (item: GroupRowItem) => void;
    renderItem?: (item: GroupRowItem, idx: number) => ReactNode;
    defaultExpanded?: boolean;
    isChild?: boolean;
    className?: string;
    count?: number;
    countLabel?: string;
    forceGroup?: boolean;
    depth?: number;
    isLoading?: boolean;
    onToggle?: (isExpanded: boolean) => void;
}
