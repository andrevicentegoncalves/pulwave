/**
 * UserInfo Variants
 * CVA configuration for UserInfo component
 */
import { cva, type VariantProps } from 'class-variance-authority';

export const userInfoVariants = cva('user-info', {
    variants: {
        /**
         * Layout orientation
         */
        orientation: {
            horizontal: 'user-info--horizontal',
            vertical: 'user-info--vertical',
        },
        /**
         * Size variant
         */
        size: {
            s: 'user-info--s',
            m: 'user-info--m',
            l: 'user-info--l',
        },
    },
    defaultVariants: {
        orientation: 'horizontal',
        size: 'm',
    },
});

export type UserInfoVariantProps = VariantProps<typeof userInfoVariants>;
