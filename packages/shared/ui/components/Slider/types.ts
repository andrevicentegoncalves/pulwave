import { cva, type VariantProps } from 'class-variance-authority';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const sliderVariants = cva('slider', {
    variants: {
        size: {
            s: 'slider--s',
            m: 'slider--m',
            l: 'slider--l',
        },
        color: {
            primary: 'slider--primary',
            secondary: 'slider--secondary',
            neutral: 'slider--neutral',
            success: 'slider--success',
            warning: 'slider--warning',
            error: 'slider--error',
        },
        disabled: {
            true: 'slider--disabled',
        },
        isDragging: {
            true: 'slider--dragging',
        }
    },
    defaultVariants: {
        size: 'm',
        color: 'primary',
        disabled: false,
        isDragging: false,
    },
});

export type SliderVariantProps = VariantProps<typeof sliderVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

export type SliderSize = 's' | 'm' | 'l';
export type SliderColor = 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error';

export interface SliderMark { value: number; label?: string; }

export interface SliderProps {
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    onChange?: (value: number) => void;
    onChangeEnd?: (value: number) => void;
    disabled?: boolean;
    size?: SliderSize;
    color?: SliderColor;
    showValue?: boolean;
    showTooltip?: boolean;
    marks?: SliderMark[];
    label?: string;
    className?: string;
}
