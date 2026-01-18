import { cva, type VariantProps } from 'class-variance-authority';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const segmentedControlVariants = cva('segmented-control', {
    variants: {
        size: {
            s: 'segmented-control--s',
            m: 'segmented-control--m',
            l: 'segmented-control--l',
        },
        fullWidth: {
            true: 'segmented-control--full-width',
        }
    },
    defaultVariants: {
        size: 'm',
        fullWidth: false,
    },
});

export type SegmentedControlVariantProps = VariantProps<typeof segmentedControlVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

export interface SegmentedControlOption {
    label: string;
    value: string;
    disabled?: boolean;
}

export interface SegmentedControlProps extends SegmentedControlVariantProps {
    /** Options to display */
    options: SegmentedControlOption[];
    /** Current value */
    value: string;
    /** Callback when value changes */
    onChange: (value: string) => void;
    /** Accessibility name for the group */
    name?: string;
    /** Additional class name */
    className?: string;
}
