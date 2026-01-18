import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Root CVA
export const accordionVariants = cva('accordion', {
    variants: {
        variant: {
            primary: 'accordion--variant-primary',
            neutral: 'accordion--variant-neutral',
        },
    },
    defaultVariants: {
        variant: 'primary',
    },
});

export const accordionItemVariants = cva('accordion__item', {
    variants: {
        expanded: { true: 'accordion__item--state-expanded' },
        disabled: { true: 'accordion__item--state-disabled' }
    },
    defaultVariants: {
        expanded: false,
        disabled: false
    }
});

export const accordionHeaderVariants = cva('accordion__header', {
    variants: {},
    defaultVariants: {}
});

export const accordionPanelVariants = cva('accordion__panel', {
    variants: {},
    defaultVariants: {}
});

export const accordionIconVariants = cva('accordion__icon', {
    variants: {},
    defaultVariants: {}
});

export const accordionChevronVariants = cva('accordion__chevron', {
    variants: {
        expanded: { true: 'accordion__chevron--state-expanded' }
    },
    defaultVariants: {
        expanded: false
    }
});

export type AccordionVariant = 'primary' | 'neutral';

export interface AccordionItemData { id: string; title: string; content: ReactNode; icon?: ReactNode; badge?: ReactNode; disabled?: boolean; }

export interface AccordionProps {
    items?: AccordionItemData[];
    children?: ReactNode;
    allowMultiple?: boolean;
    defaultExpanded?: string[];
    variant?: AccordionVariant;
    className?: string;
}

export interface AccordionItemProps {
    id: string;
    title: string;
    children: ReactNode;
    icon?: ReactNode;
    badge?: ReactNode;
    disabled?: boolean;
    isExpanded?: boolean;
    onToggle?: () => void;
}
