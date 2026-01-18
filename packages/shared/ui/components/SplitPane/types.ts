import type { ReactNode, CSSProperties } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

export const splitPaneVariants = cva('split-pane', {
    variants: {
        direction: {
            horizontal: 'split-pane--direction-horizontal',
            vertical: 'split-pane--direction-vertical',
        }
    },
    defaultVariants: {
        direction: 'horizontal',
    },
});

export const splitPanePanelVariants = cva('split-pane__panel', {
    variants: {},
    defaultVariants: {}
});

export const splitPaneHandleVariants = cva('split-pane__handle', {
    variants: {},
    defaultVariants: {}
});

export const splitPaneHandleBarVariants = cva('split-pane__handle-bar', {
    variants: {},
    defaultVariants: {}
});

export const splitPaneHandleIconVariants = cva('split-pane__handle-icon', {
    variants: {},
    defaultVariants: {}
});

export interface SplitPaneProps extends VariantProps<typeof splitPaneVariants> {
    /**
     * The content of the two panels
     */
    children: [ReactNode, ReactNode];

    /**
     * Direction of the split
     * @default 'horizontal'
     */
    direction?: 'horizontal' | 'vertical';

    /**
     * Initial size of the first panel (in %, e.g., 20)
     * @default 50
     */
    defaultSize?: number;

    /**
     * Minimum size of the first panel (in %)
     * @default 0
     */
    minSize?: number;

    /**
     * Maximum size of the first panel (in %)
     * @default 100
     */
    maxSize?: number;

    /**
     * className for the container
     */
    className?: string;

    /**
    * Style object for the container
    */
    style?: CSSProperties;
}
