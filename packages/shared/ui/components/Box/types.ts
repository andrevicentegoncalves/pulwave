import type { ElementType, HTMLAttributes, CSSProperties, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { SpacingScale } from '@pulwave/utils';

/**
 * Box spacing props using design token scale
 */
type SpacingValue = SpacingScale | 'auto';

// CVA for Box
export const boxVariants = cva('box', {
    variants: {
        variant: {
            default: '',
            card: 'box--card',
            glass: 'box--glass',
            outlined: 'box--outlined',
        },
        interactive: {
            true: 'box--interactive',
            false: '',
        },
    },
    defaultVariants: {
        variant: 'default',
        interactive: false,
    },
});

export type BoxVariants = VariantProps<typeof boxVariants>;

export interface BoxProps extends HTMLAttributes<HTMLElement>, BoxVariants {
    /** Rendered HTML element */
    as?: ElementType;
    /** Children elements */
    children?: ReactNode;
    /** Additional CSS class names */
    className?: string;

    // Spacing props
    /** Padding on all sides */
    padding?: SpacingValue;
    /** Horizontal padding */
    paddingX?: SpacingValue;
    /** Vertical padding */
    paddingY?: SpacingValue;
    /** Top padding */
    paddingTop?: SpacingValue;
    /** Right padding */
    paddingRight?: SpacingValue;
    /** Bottom padding */
    paddingBottom?: SpacingValue;
    /** Left padding */
    paddingLeft?: SpacingValue;
    /** Margin on all sides */
    margin?: SpacingValue | number;
    /** Horizontal margin */
    marginX?: number | 'auto';
    /** Vertical margin */
    marginY?: number | 'auto';
    /** Top margin */
    marginTop?: number | 'auto';
    /** Right margin */
    marginRight?: number | 'auto';
    /** Bottom margin */
    marginBottom?: number | 'auto';
    /** Left margin */
    marginLeft?: number | 'auto';

    // Layout props
    /** Display mode */
    display?: CSSProperties['display'];
    /** Width */
    width?: string | number;
    /** Height */
    height?: string | number;
    /** Min width */
    minWidth?: string | number;
    /** Max width */
    maxWidth?: string | number;
    /** Min height */
    minHeight?: string | number;
    /** Max height */
    maxHeight?: string | number;

    // Visual props
    /** Background color token name */
    background?: string;
    /** Border radius token name */
    borderRadius?: 'none' | 's' | 'm' | 'l' | 'xl' | 'full' | 'pill';
    /** Border */
    border?: string;
    /** Box shadow token name */
    shadow?: 'none' | 'xs' | 's' | 'm' | 'l' | 'xl';
    /** Overflow behavior */
    overflow?: CSSProperties['overflow'];
    /** Position */
    position?: CSSProperties['position'];

    /** Inline styles (use sparingly) */
    style?: CSSProperties;
    /** Test ID for testing */
    testId?: string;
}
