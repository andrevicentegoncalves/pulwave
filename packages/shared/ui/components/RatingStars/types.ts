import { cva, type VariantProps } from 'class-variance-authority';

export const ratingStarsVariants = cva('rating-stars', {
    variants: {
        size: {
            s: 'rating-stars--s',
            m: 'rating-stars--m',
            l: 'rating-stars--l',
        },
        color: {
            primary: 'rating-stars--primary',
            warning: 'rating-stars--warning',
            success: 'rating-stars--success',
            error: 'rating-stars--error',
            info: 'rating-stars--info',
        },
    },
    defaultVariants: {
        size: 'm',
        color: 'warning',
    },
});

export type RatingStarsSize = 's' | 'm' | 'l';
export type RatingStarsColor = 'primary' | 'warning' | 'success' | 'error' | 'info';

export interface RatingStarsProps extends VariantProps<typeof ratingStarsVariants> {
    value: number;
    max?: number;
    showNumeric?: boolean;
    className?: string;
}
