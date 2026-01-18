import type { ReactNode, CSSProperties, ElementType } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

export const inlineVariants = cva('inline', {
    variants: {
        align: {
            start: 'inline--align-start',
            center: 'inline--align-center',
            end: 'inline--align-end',
            stretch: 'inline--align-stretch',
            baseline: 'inline--align-baseline',
        },
        justify: {
            start: 'inline--justify-start',
            center: 'inline--justify-center',
            end: 'inline--justify-end',
            between: 'inline--justify-between',
            around: 'inline--justify-around',
            evenly: 'inline--justify-evenly',
        },
        wrap: {
            true: 'inline--wrap',
            false: 'inline--nowrap',
        },
        reverse: {
            true: 'inline--reverse',
            false: '',
        }
    },
    defaultVariants: {
        align: 'center',
        justify: 'start',
        wrap: true,
        reverse: false,
    },
});

export type InlineVariantProps = VariantProps<typeof inlineVariants>;

export interface InlineProps extends InlineVariantProps {
    as?: ElementType;
    children: ReactNode;
    className?: string;
    gap?: number;
    padding?: number;
    width?: string | number;
    style?: CSSProperties;
    testId?: string;
    // Deprecated props that should be filtered out or mapped
    /** @deprecated Use `align` instead */
    alignY?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
}
