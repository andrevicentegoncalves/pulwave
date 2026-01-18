import { cva, type VariantProps } from 'class-variance-authority';

export const pageLoaderVariants = cva('page-loader', {
    variants: {
        fullScreen: {
            true: 'page-loader--fullscreen',
            false: '',
        }
    },
    defaultVariants: {
        fullScreen: true,
    }
});

export const pageLoaderMessageVariants = cva('page-loader__message', {
    variants: {},
    defaultVariants: {}
});

export type PageLoaderVariants = VariantProps<typeof pageLoaderVariants>;

export interface PageLoaderProps extends PageLoaderVariants {
    /** Optional message to display below the spinner */
    message?: string;
    /** Optional custom class name */
    className?: string;
}
