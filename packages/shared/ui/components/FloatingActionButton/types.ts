/**
 * FloatingActionButton Variants
 * CVA configuration for FloatingActionButton component
 */
import { cva, type VariantProps } from 'class-variance-authority';

export const fabContainerVariants = cva('fab-container', {
    variants: {
        /**
         * Position of the FAB on screen
         */
        position: {
            'bottom-right': 'fab-container--bottom-right',
            'bottom-left': 'fab-container--bottom-left',
            'bottom-center': 'fab-container--bottom-center',
        },
        /**
         * Expanded state (speed dial open)
         */
        expanded: {
            true: 'fab-container--expanded',
            false: '',
        },
        /**
         * Positioning strategy
         */
        strategy: {
            fixed: 'fab-container--fixed',
            absolute: 'fab-container--absolute',
        },
    },
    defaultVariants: {
        position: 'bottom-right',
        expanded: false,
        strategy: 'fixed',
    },
});

export const fabButtonVariants = cva('fab', {
    variants: {
        /**
         * Extended FAB with label
         */
        extended: {
            true: 'fab--extended',
            false: '',
        },
        /**
         * Active/expanded state
         */
        active: {
            true: 'fab--active',
            false: '',
        },
        /**
         * Size variant
         */
        size: {
            s: 'fab--s',
            m: 'fab--m',
            l: 'fab--l',
        },
    },
    defaultVariants: {
        extended: false,
        active: false,
        size: 'm',
    },
});

export type FABContainerVariantProps = VariantProps<typeof fabContainerVariants>;
export type FABButtonVariantProps = VariantProps<typeof fabButtonVariants>;
