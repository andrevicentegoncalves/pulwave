import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const treeViewVariants = cva('tree-view', {
    variants: {
        density: {
            compact: 'tree-view--compact',
            normal: '',
        }
    },
    defaultVariants: {
        density: 'normal',
    },
});

export type TreeViewVariantProps = VariantProps<typeof treeViewVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

export interface TreeNode {
    id: string;
    label: string;
    icon?: ReactNode;
    badge?: ReactNode;
    children?: TreeNode[];
}

export interface TreeViewProps extends TreeViewVariantProps {
    data?: TreeNode[];
    onSelect?: (node: TreeNode) => void;
    selectedId?: string;
    expandAll?: boolean;
    showIcons?: boolean;
    className?: string;
}
