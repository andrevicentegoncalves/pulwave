import { cva, type VariantProps } from 'class-variance-authority';

export const circleFlagVariants = cva('circle-flag', {
    variants: {
        size: {
            s: 'circle-flag--s',
            ms: 'circle-flag--ms',
            m: 'circle-flag--m',
            l: 'circle-flag--l',
        },
    },
    defaultVariants: {
        size: 'm',
    },
});

export type CircleFlagSize = 's' | 'ms' | 'm' | 'l';

export interface CircleFlagProps extends VariantProps<typeof circleFlagVariants> {
    countryCode?: string;
    className?: string;
}
