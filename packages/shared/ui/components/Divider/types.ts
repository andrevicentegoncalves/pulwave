import { cva, type VariantProps } from 'class-variance-authority';

export const dividerVariants = cva('divider', {
    variants: {
        orientation: {
            horizontal: 'divider--horizontal',
            vertical: 'divider--vertical',
        },
        variant: {
            default: 'divider--default',
            subtle: 'divider--subtle',
        },
        spacing: {
            none: 'divider--spacing-none',
            s: 'divider--spacing-s',
            m: 'divider--spacing-m',
            l: 'divider--spacing-l',
            default: 'divider--spacing-m', // Alias
        }
    },
    defaultVariants: {
        orientation: 'horizontal',
        variant: 'default',
        spacing: 'none',
    }
});

export type DividerProps = VariantProps<typeof dividerVariants> & React.HTMLAttributes<HTMLDivElement>;
