import { cva, type VariantProps } from 'class-variance-authority';

export const iconVariants = cva('icon', {
    variants: {
        size: {
            xs: 'icon--xs',
            s: 'icon--s',
            m: 'icon--m',
            l: 'icon--l',
            xl: 'icon--xl',
        }
    },
    defaultVariants: {
        size: 'm',
    },
});

export type IconProps = VariantProps<typeof iconVariants> & {
    children?: React.ReactNode;
    className?: string;
    name?: string;
    /** The icon component to render */
    icon?: React.ElementType;
    /** Optional color for the icon */
    color?: string;
} & React.HTMLAttributes<HTMLSpanElement>;
