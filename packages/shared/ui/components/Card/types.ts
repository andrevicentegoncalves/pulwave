import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva('card', {
    variants: {
        variant: {
            default: 'card--default', // Outlined usually?
            elevated: 'card--elevated',
            outlined: 'card--outlined',
            plain: 'card--plain',
        },
        padding: {
            none: 'card--padding-none',
            xs: 'card--padding-xs',
            s: 'card--padding-s',
            m: 'card--padding-m',
            md: 'card--padding-m',
            l: 'card--padding-l',
            xl: 'card--padding-xl',
        },
        hoverable: {
            true: 'card--hoverable',
        }
    },
    defaultVariants: {
        variant: 'default',
        padding: 's',
        hoverable: false,
    },
});

export type CardProps = VariantProps<typeof cardVariants> & {
    children?: React.ReactNode;
    className?: string;
    /** Header content (legacy prop) */
    header?: React.ReactNode;
    /** Footer content (legacy prop) */
    footer?: React.ReactNode;
    /** Polymorphic rendering as a different element */
    as?: React.ElementType;
    // Support noHoverTransform alias if needed, or just use hoverable={false}
    noHoverTransform?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;
