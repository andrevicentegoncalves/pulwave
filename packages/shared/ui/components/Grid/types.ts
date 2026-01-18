import type { ElementType, HTMLAttributes, CSSProperties } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { SpacingScale } from '@pulwave/utils';

export const gridVariants = cva('grid', {
    variants: {
        flow: {
            row: 'grid--flow-row',
            column: 'grid--flow-column',
            'row dense': 'grid--flow-row-dense',
            'column dense': 'grid--flow-column-dense',
        },
        align: {
            start: 'grid--align-start',
            center: 'grid--align-center',
            end: 'grid--align-end',
            stretch: 'grid--align-stretch',
        },
        justify: {
            start: 'grid--justify-start',
            center: 'grid--justify-center',
            end: 'grid--justify-end',
            stretch: 'grid--justify-stretch',
        },
        alignContent: {
            start: 'grid--content-start',
            center: 'grid--content-center',
            end: 'grid--content-end',
            stretch: 'grid--content-stretch',
            between: 'grid--content-between',
            around: 'grid--content-around',
            evenly: 'grid--content-evenly',
        },
        justifyContent: {
            start: 'grid--justify-content-start',
            center: 'grid--justify-content-center',
            end: 'grid--justify-content-end',
            stretch: 'grid--justify-content-stretch',
            between: 'grid--justify-content-between',
            around: 'grid--justify-content-around',
            evenly: 'grid--justify-content-evenly',
        },
        gap: {
            0: 'grid--gap-0',
            1: 'grid--gap-1',
            2: 'grid--gap-2',
            3: 'grid--gap-3',
            4: 'grid--gap-4',
            5: 'grid--gap-5',
            6: 'grid--gap-6',
            8: 'grid--gap-8',
            10: 'grid--gap-10',
            12: 'grid--gap-12',
            16: 'grid--gap-16',
            20: 'grid--gap-20',
            24: 'grid--gap-24',
            32: 'grid--gap-32',
        },
        columnGap: {
            0: 'grid--col-gap-0',
            1: 'grid--col-gap-1',
            2: 'grid--col-gap-2',
            3: 'grid--col-gap-3',
            4: 'grid--col-gap-4',
            6: 'grid--col-gap-6',
            8: 'grid--col-gap-8',
        },
        rowGap: {
            0: 'grid--row-gap-0',
            1: 'grid--row-gap-1',
            2: 'grid--row-gap-2',
            3: 'grid--row-gap-3',
            4: 'grid--row-gap-4',
            6: 'grid--row-gap-6',
            8: 'grid--row-gap-8',
        }
    },
    defaultVariants: {
        flow: 'row',
    },
});

export type GridVariants = VariantProps<typeof gridVariants>;

export interface GridProps extends HTMLAttributes<HTMLElement>, Omit<GridVariants, 'gap' | 'columnGap' | 'rowGap'> {
    as?: ElementType;
    columns?: number | string;
    rows?: number | string;
    minColumnWidth?: string | number;

    // Gap overrides (allow numeric/string)
    gap?: GridVariants['gap'] | SpacingScale;
    columnGap?: GridVariants['columnGap'] | SpacingScale;
    rowGap?: GridVariants['rowGap'] | SpacingScale;

    padding?: SpacingScale;
    width?: string | number;
    testId?: string;
}
