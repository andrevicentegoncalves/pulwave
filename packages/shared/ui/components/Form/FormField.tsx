/**
 * FormField Component
 * 
 * Composition of label, input, and helper/error text.
 * 
 * @package @pulwave/ui
 */
import { type ReactNode, type ReactElement, cloneElement, isValidElement } from 'react';
import { cn } from '@pulwave/utils';

export interface FormFieldProps {
    /** Field label */
    label?: string;
    /** Input/control component */
    children: ReactElement | ReactNode;
    /** Helper text shown below input */
    helperText?: string;
    /** Error message (replaces helper text when present) */
    error?: string;
    /** Success message */
    success?: string;
    /** Required indicator */
    required?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** HTML id for input */
    id?: string;
    /** Additional class */
    className?: string;
    /** Hide label visually (still accessible) */
    hideLabel?: boolean;
    /** Label position */
    labelPosition?: 'top' | 'left' | 'right';
}

/**
 * FormField Component
 * 
 * Combines label, input, and helper/error into a consistent form field.
 * 
 * @example
 * <FormField label="Email" required error={errors.email}>
 *     <Input type="email" {...register('email')} />
 * </FormField>
 */
export const FormField = ({
    label,
    children,
    helperText,
    error,
    success,
    required = false,
    disabled = false,
    id,
    className,
    hideLabel = false,
    labelPosition = 'top'
}: FormFieldProps) => {
    const fieldId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const hasError = !!error;
    const hasSuccess = !!success;
    const message = error || success || helperText;

    // Clone child and inject props if it's a valid element
    const enhancedChild = isValidElement(children)
        ? cloneElement(children as ReactElement<{
            id?: string;
            'aria-describedby'?: string;
            'aria-invalid'?: boolean;
            disabled?: boolean;
            error?: boolean;
            success?: boolean;
        }>, {
            id: fieldId,
            'aria-describedby': message && fieldId ? `${fieldId}-message` : undefined,
            'aria-invalid': hasError,
            disabled,
            error: hasError,
            success: hasSuccess,
        })
        : children;

    return (
        <div
            className={cn(
                'form-field',
                `form-field--label-${labelPosition}`,
                {
                    'form-field--error': hasError,
                    'form-field--success': hasSuccess,
                    'form-field--disabled': disabled
                },
                className
            )}
        >
            {label && (
                <label
                    htmlFor={fieldId}
                    className={cn(
                        'form-field__label',
                        { 'visually-hidden': hideLabel }
                    )}
                >
                    {label}
                    {required && <span className="form-field__required" aria-hidden="true">*</span>}
                </label>
            )}

            <div className="form-field__control">
                {enhancedChild}
            </div>

            {message && (
                <div
                    id={fieldId ? `${fieldId}-message` : undefined}
                    className={cn(
                        'form-field__message',
                        {
                            'form-field__message--error': hasError,
                            'form-field__message--success': hasSuccess
                        }
                    )}
                    role={hasError ? 'alert' : undefined}
                >
                    {message}
                </div>
            )}
        </div>
    );
};

FormField.displayName = 'FormField';
