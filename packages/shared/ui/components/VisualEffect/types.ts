import { cva, type VariantProps } from 'class-variance-authority';
import type { SVGProps } from 'react';

export const visualEffectVariants = cva('visual-effect', {
    variants: {
        variant: {
            'sidebar-wave': 'visual-effect--sidebar-wave',
            'pulse-wave': 'visual-effect--pulse-wave',
            'ring-wave': 'visual-effect--ring-wave',
        },
        size: {
            s: 'visual-effect--ring-wave--s',
            m: 'visual-effect--ring-wave--m',
            l: 'visual-effect--ring-wave--l',
            xl: 'visual-effect--ring-wave--xl',
        }
    },
    defaultVariants: {
        variant: 'sidebar-wave',
    },
});

export type VisualEffectVariants = VariantProps<typeof visualEffectVariants>;
export type VisualEffectVariant = NonNullable<VisualEffectVariants['variant']>;
export type VisualEffectSize = NonNullable<VisualEffectVariants['size']>;

export interface VisualEffectProps extends Omit<SVGProps<SVGSVGElement>, 'size'>, VisualEffectVariants {
    className?: string;
}
