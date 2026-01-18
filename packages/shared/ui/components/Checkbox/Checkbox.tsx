import React, { useRef, useEffect } from 'react';
import { cn } from '@pulwave/utils';
import {
    checkboxVariants,
    checkboxContainerVariants,
    checkboxInputVariants,
    checkboxLabelVariants,
    checkboxHelperVariants,
    type CheckboxProps,
    type CheckboxSize
} from './types';
import './styles/_index.scss';

const CheckboxRoot = ({
    label, name, id, checked, defaultChecked, indeterminate = false, disabled = false,
    required = false, size = 'm', isSquare = false, colorVariant = 'primary',
    helperText, error, onChange, className, readOnly = false, ...rest
}: CheckboxProps) => {
    const checkboxId = id || name;
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const isControlled = checked !== undefined;

    return (
        <div className={cn(checkboxVariants({ size, colorVariant }), className)}>
            <div className={cn(checkboxContainerVariants({ size }))}>
                <input
                    ref={inputRef}
                    type="checkbox"
                    id={checkboxId}
                    name={name}
                    {...(isControlled ? { checked } : { defaultChecked })}
                    disabled={disabled}
                    required={required}
                    readOnly={readOnly}
                    onChange={readOnly ? undefined : onChange}
                    className={cn(checkboxInputVariants({
                        size,
                        round: !isSquare,
                        error: !!error,
                        indeterminate
                    }))}
                    aria-invalid={!!error}
                    aria-describedby={(error || helperText) ? `${checkboxId}-helper` : undefined}
                    {...rest}
                />
                {label && (
                    <label
                        htmlFor={checkboxId}
                        className={cn(checkboxLabelVariants({ size, disabled }))}
                    >
                        {label}
                        {required && <span className="checkbox__required" aria-label="required">*</span>}
                    </label>
                )}
            </div>
            {(helperText || error) && (
                <div
                    id={`${checkboxId}-helper`}
                    className={cn(checkboxHelperVariants({ size, error: !!error }))}
                    role={error ? 'alert' : undefined}
                >
                    {error || helperText}
                </div>
            )}
        </div>
    );
};
CheckboxRoot.displayName = 'Checkbox';

// Compound Sub-components
const CheckboxLabel = ({ children, className, size = 'm', disabled }: {
    children: React.ReactNode;
    className?: string;
    size?: CheckboxSize;
    disabled?: boolean;
}) => {
    return (
        <span className={cn(checkboxLabelVariants({ size, disabled }), className)}>
            {children}
        </span>
    );
};
CheckboxLabel.displayName = 'Checkbox.Label';

const CheckboxHelper = ({ children, className, error, size = 'm' }: {
    children: React.ReactNode;
    className?: string;
    error?: boolean;
    size?: CheckboxSize;
}) => (
    <div className={cn(checkboxHelperVariants({ size, error }), className)}>
        {children}
    </div>
);
CheckboxHelper.displayName = 'Checkbox.Helper';

// Export with compound sub-components
export const Checkbox = Object.assign(CheckboxRoot, {
    Label: CheckboxLabel,
    Helper: CheckboxHelper,
});
