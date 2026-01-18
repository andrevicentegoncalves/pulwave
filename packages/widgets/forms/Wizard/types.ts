import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentType, ReactNode } from 'react';

export const wizardContainerVariants = cva('wizard-container', {
    variants: {},
    defaultVariants: {}
});

export const wizardProgressVariants = cva('wizard-progress', {
    variants: {},
    defaultVariants: {}
});

export const wizardStepVariants = cva('wizard-progress__step', {
    variants: {
        active: {
            true: 'wizard-progress__step--active',
        },
        completed: {
            true: 'wizard-progress__step--completed',
        }
    },
    defaultVariants: {
        active: false,
        completed: false
    }
});

export interface WizardStep {
    title: string;
    icon: ComponentType<any>;
}

export interface WizardProps {
    steps: WizardStep[];
    currentStep: number;
    onNext: () => void;
    onBack: () => void;
    onFinish: () => void;
    loading?: boolean;
    error?: string | null;
    onErrorDismiss?: () => void;
    children: ReactNode;
    className?: string;
}
