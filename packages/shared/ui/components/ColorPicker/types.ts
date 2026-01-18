import { cva, type VariantProps } from 'class-variance-authority';

export const colorPickerVariants = cva('color-picker', {
    variants: {
        size: {
            s: 'color-picker--s',
            m: 'color-picker--m',
            l: 'color-picker--l',
        },
        disabled: {
            true: 'color-picker--disabled',
        },
    },
    defaultVariants: {
        size: 'm',
        disabled: false,
    },
});

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

export interface ColorPickerProps extends VariantProps<typeof colorPickerVariants> {
    value: string;
    onChange: (value: string) => void;
    format?: ColorFormat;
    label?: string;
    className?: string;
    placeholder?: string;
}
