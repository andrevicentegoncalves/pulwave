import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

export const labelVariants = cva('label', {
    variants: {
        size: {
            s: 'label--s',
            m: 'label--m',
            l: 'label--l',
        },
        disabled: {
            true: 'label--disabled',
        }
    },
    defaultVariants: {
        size: 'm',
        disabled: false,
    },
});

export type LabelVariants = VariantProps<typeof labelVariants>;
export type LabelSize = NonNullable<LabelVariants['size']>;

export interface LabelProps extends LabelVariants {
    /** Label content */
    children: ReactNode;
    /** Associated form element ID */
    htmlFor?: string;
    /** Size variant */
    size?: LabelSize;
    /** Whether the field is required */
    required?: boolean;
    /** Whether the field is optional (shows "(optional)" text) */
    optional?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Additional CSS class names */
    className?: string;
    /** Helper/description text */
    description?: string;
}
