import { cva, type VariantProps } from 'class-variance-authority';

export const numberedListVariants = cva('numbered-list', {
    variants: {},
    defaultVariants: {}
});

export const numberedListItemVariants = cva('numbered-list__item', {
    variants: {},
    defaultVariants: {}
});

export const numberedListNumberVariants = cva('numbered-list__number', {
    variants: {},
    defaultVariants: {}
});

export const numberedListContentVariants = cva('numbered-list__content', {
    variants: {},
    defaultVariants: {}
});

export const numberedListLabelVariants = cva('numbered-list__label', {
    variants: {},
    defaultVariants: {}
});

export const numberedListDescriptionVariants = cva('numbered-list__description', {
    variants: {},
    defaultVariants: {}
});

export interface NumberedListItem {
    name?: string;
    description?: string;
}

export interface NumberedListProps {
    items?: NumberedListItem[];
    children?: React.ReactNode;
    className?: string;
}
