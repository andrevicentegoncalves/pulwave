import React from 'react';
import { cn } from '@pulwave/utils';
import { Check, AlertCircle } from '../../icon-library';
import { stepperVariants, type StepperProps, type StepState, type StepperVariants } from './types';
import './styles/_index.scss';


// Logic for handling state should ideally be in a Context if we want flexible composition,
// or we keep the main Stepper as the controller.
// Since we want `Stepper.Item` to be usable, let's create subcomponents but keep `Stepper` as the high-level API.

const StepperStep = ({
    state,
    disabled,
    isClickable,
    index,
    icon,
    title,
    description,
    isLast,
    onClick,
    size = 'm'
}: {
    state: StepState;
    disabled?: boolean;
    isClickable?: boolean;
    index: number;
    icon?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    isLast?: boolean;
    onClick?: () => void;
    size?: StepperVariants['size'];
}) => {
    const renderStepIcon = () => {
        if (icon) return icon;

        switch (state) {
            case 'completed':
                return <Check size={size === 's' ? 12 : 16} />;
            case 'error':
                return <AlertCircle size={size === 's' ? 12 : 16} />;
            default:
                return <span>{index + 1}</span>;
        }
    };

    return (
        <div
            className={cn(
                'stepper__step',
                `stepper__step--state-${state}`,
                disabled && 'stepper__step--disabled',
                isClickable && 'stepper__step--clickable'
            )}
            role="listitem"
            aria-current={state === 'active' ? 'step' : undefined}
        >
            <button
                type="button"
                className="stepper__indicator"
                onClick={onClick}
                disabled={!isClickable}
                tabIndex={isClickable ? 0 : -1}
                aria-label={`Step ${index + 1}: ${typeof title === 'string' ? title : ''}`}
            >
                <span className="stepper__circle">
                    {renderStepIcon()}
                </span>
            </button>

            <div className="stepper__content">
                <span className="stepper__title">{title}</span>
                {description && (
                    <span className="stepper__description">{description}</span>
                )}
            </div>

            {!isLast && <div className="stepper__connector" />}
        </div>
    );
};
StepperStep.displayName = 'Stepper.Step';

export const StepperRoot = ({
    steps,
    activeStep,
    onStepClick,
    orientation = 'horizontal',
    size = 'm',
    clickable = false,
    className,
    ...props
}: StepperProps) => {

    const getStepState = (index: number): StepState => {
        if (steps[index]?.state) return steps[index].state!;
        if (index < activeStep) return 'completed';
        if (index === activeStep) return 'active';
        return 'pending';
    };

    const handleStepClick = (index: number) => {
        if (!clickable || steps[index]?.disabled) return;
        onStepClick?.(index);
    };

    return (
        <div
            className={cn(stepperVariants({ orientation, size }), className)}
            role="list"
            {...props}
        >
            {steps.map((step, index) => {
                const state = getStepState(index);
                const isStepClickable = clickable && !step.disabled && state !== 'pending';
                const isLast = index === steps.length - 1;

                return (
                    <StepperStep
                        key={step.id}
                        state={state}
                        disabled={step.disabled}
                        isClickable={isStepClickable}
                        index={index}
                        icon={step.icon}
                        title={step.title}
                        description={step.description}
                        isLast={isLast}
                        onClick={() => handleStepClick(index)}
                        size={size}
                    />
                );
            })}
        </div>
    );
};

StepperRoot.displayName = 'Stepper';

export const Stepper = Object.assign(StepperRoot, {
    Step: StepperStep,
});

