/**
 * CardGrid Types & CVA
 */
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode, CSSProperties } from 'react';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const cardGridVariants = cva('card-grid', {
    variants: {
        /**
         * Gap sizes
         */
        gap: {
            s: 'card-grid--gap-s',
            m: 'card-grid--gap-m',
            l: 'card-grid--gap-l',
            xl: 'card-grid--gap-xl',
        },
        /**
         * Minimum card widths (responsive via CSS grid)
         */
        minCardWidth: {
            narrow: 'card-grid--min-width-narrow',   // 240px
            standard: 'card-grid--min-width-standard', // 280px
            wide: 'card-grid--min-width-wide',       // 320px
        },
    },
    defaultVariants: {
        gap: 'm',
        minCardWidth: 'standard',
    },
});

export type CardGridVariantProps = VariantProps<typeof cardGridVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

export interface CardGridProps extends CardGridVariantProps {
    /** Grid content */
    children?: ReactNode;
    /** Additional CSS class names */
    className?: string;
    /** Inline styles */
    style?: CSSProperties;
}
