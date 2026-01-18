import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const carouselVariants = cva('carousel', {
    variants: {
        variant: {
            default: 'carousel--variant-default',
            hero: 'carousel--variant-hero',
            wallet: 'carousel--variant-wallet',
            'wallet-3d': 'carousel--variant-wallet-3d',
            fullscreen: 'carousel--variant-fullscreen',
        },
        withArrows: {
            true: 'carousel--with-arrows',
        }
    },
    defaultVariants: {
        variant: 'default',
        withArrows: true,
    },
});

export type CarouselVariantProps = VariantProps<typeof carouselVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

export interface CarouselSlide { id: string | number; content: ReactNode; }

export interface CarouselProps extends CarouselVariantProps {
    slides?: CarouselSlide[];
    children?: ReactNode;
    autoPlay?: boolean;
    interval?: number;
    showDots?: boolean;
    showArrows?: boolean;
    loop?: boolean;
    slidesToShow?: number;
    className?: string;
    onChange?: (index: number) => void;
}
