
import { cva, type VariantProps } from 'class-variance-authority';

export const logoVariants = cva('logo', {
    variants: {
        variant: {
            full: 'logo--full',
            mark: 'logo--mark',
        },
        size: {
            s: 'logo--s',
            m: 'logo--m',
            l: 'logo--l',
        },
        collapsed: {
            true: 'logo--collapsed',
            false: 'logo--expanded',
        },
    },
    defaultVariants: {
        variant: 'full',
        size: 'm',
        collapsed: false,
    },
});

type LogoVariantProps = VariantProps<typeof logoVariants>;

export interface LogoProps extends LogoVariantProps {
    className?: string;
    subtitle?: string;
    title?: string;
    style?: React.CSSProperties;
}
