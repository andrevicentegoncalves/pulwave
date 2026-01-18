import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentType } from 'react';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const sectionHeaderVariants = cva('section-header', {
    variants: {
        size: {
            m: 'section-header--m',
            l: 'section-header--l',
            xl: 'section-header--xl',
        },
    },
    defaultVariants: {
        size: 'l',
    },
});

export const sectionHeaderIconVariants = cva('section-header__icon', {
    variants: {},
    defaultVariants: {}
});

export type SectionHeaderVariantProps = VariantProps<typeof sectionHeaderVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

export interface SectionHeaderProps extends SectionHeaderVariantProps {
    icon?: string | ComponentType;
    title: string;
    className?: string;
    description?: string;
    actions?: React.ReactNode;
}
