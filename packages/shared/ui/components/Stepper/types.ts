import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode, HTMLAttributes } from 'react';

export const stepperVariants = cva('stepper', {
    variants: {
        orientation: {
            horizontal: 'stepper--orientation-horizontal',
            vertical: 'stepper--orientation-vertical',
        },
        size: {
            s: 'stepper--size-s',
            m: 'stepper--size-m',
            l: 'stepper--size-l',
        },
    },
    defaultVariants: {
        orientation: 'horizontal',
        size: 'm',
    },
});

export type StepperVariants = VariantProps<typeof stepperVariants>;

/**
 * Stepper step state
 */
export type StepState = 'pending' | 'active' | 'completed' | 'error';

/**
 * Individual step definition
 */
export interface StepperStep {
    id: string;
    title: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    state?: StepState;
    disabled?: boolean;
}

export interface StepperProps extends HTMLAttributes<HTMLElement>, StepperVariants {
    steps: StepperStep[];
    activeStep: number;
    onStepClick?: (stepIndex: number) => void;
    clickable?: boolean;
    className?: string; // Explicitly included though HTMLAttributes has it, for clarity
}
