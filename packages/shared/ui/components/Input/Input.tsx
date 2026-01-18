import React, { forwardRef, useId, type ElementType, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@pulwave/utils';
import { inputVariants, inputContainerVariants, type InputProps } from './types';
import './styles/_index.scss';

type PolymorphicRef<C extends ElementType> = React.ComponentPropsWithRef<C>['ref'];

const InputRoot = forwardRef<HTMLInputElement, InputProps>(({
    className,
    size = 'm',
    fullWidth,
    disabled,
    error,
    success,
    label,
    helperText,
    leftIcon,
    rightIcon,
    type = 'text',
    id,
    as: Component = 'input',
    ...props
}, ref) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
        <div className={cn(inputVariants({ fullWidth, disabled, error, success }), className)}>
            {label && (
                <label htmlFor={inputId} className="input__label">
                    {label} {props.required && <span className="input__required-mark">*</span>}
                </label>
            )}

            <div className={cn(inputContainerVariants({ size, hasLeftIcon: !!leftIcon, hasRightIcon: !!rightIcon }))}>
                {leftIcon && <span className="input__icon input__icon--left" aria-hidden="true">{leftIcon}</span>}

                <Component
                    ref={ref as PolymorphicRef<typeof Component>}
                    id={inputId}
                    type={type}
                    disabled={disabled}
                    aria-invalid={error || undefined}
                    aria-describedby={helperId}
                    className="input__field"
                    {...(props as ComponentPropsWithoutRef<typeof Component>)}
                />

                {rightIcon && <span className="input__icon input__icon--right" aria-hidden="true">{rightIcon}</span>}
            </div>

            {helperText && (
                <div id={helperId} className="input__helper" role={error ? 'alert' : undefined}>
                    {helperText}
                </div>
            )}
        </div>
    );
});

InputRoot.displayName = 'Input';

const InputLabel = ({ children, className, htmlFor, required }: { children: React.ReactNode; className?: string; htmlFor?: string; required?: boolean }) => (
    <label htmlFor={htmlFor} className={cn('input__label', className)}>
        {children} {required && <span className="input__required-mark">*</span>}
    </label>
);
InputLabel.displayName = 'Input.Label';

const InputIcon = ({ children, className, direction = 'left' }: { children: React.ReactNode; className?: string; direction?: 'left' | 'right' }) => (
    <span className={cn('input__icon', `input__icon--${direction}`, className)} aria-hidden="true">{children}</span>
);
InputIcon.displayName = 'Input.Icon';

const InputHelper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn('input__helper', className)}>{children}</div>
);
InputHelper.displayName = 'Input.Helper';

export const Input = Object.assign(InputRoot, {
    Label: InputLabel,
    Icon: InputIcon,
    Helper: InputHelper,
});
