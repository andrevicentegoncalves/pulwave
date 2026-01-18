import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode, HTMLAttributes, AnchorHTMLAttributes, ElementType } from 'react';

export const breadcrumbsVariants = cva('breadcrumbs', {
    variants: {
        size: {
            s: 'breadcrumbs--size-s',
            m: 'breadcrumbs--size-m',
            l: 'breadcrumbs--size-l',
        },
    },
    defaultVariants: {
        size: 'm',
    },
});

export type BreadcrumbsVariants = VariantProps<typeof breadcrumbsVariants>;

/**
 * Breadcrumb item definition (legacy/convenience prop)
 */
export interface BreadcrumbItem {
    label: ReactNode;
    href?: string;
    icon?: ReactNode;
    as?: ElementType; // To support Link components like Next.js Link
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement>, BreadcrumbsVariants {
    items?: BreadcrumbItem[]; // Convenience prop
    children?: ReactNode; // Compound support
    separator?: ReactNode;
    maxItems?: number;
    itemsBeforeCollapse?: number;
    itemsAfterCollapse?: number;
}

export interface BreadcrumbItemProps extends HTMLAttributes<HTMLLIElement> {
    isCurrent?: boolean;
}

export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    as?: ElementType;
    href?: string;
}

export interface BreadcrumbSeparatorProps extends HTMLAttributes<HTMLSpanElement> { }
export interface BreadcrumbEllipsisProps extends HTMLAttributes<HTMLSpanElement> { }
