import React, { forwardRef, useId } from 'react';
import { cn } from '@pulwave/utils';
import type { TextAreaProps } from './types';
import { textAreaVariants } from './types';
import './styles/_index.scss';

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
    className,
    fullWidth,
    disabled,
    error,
    success,
    resize,
    label,
    helperText,
    id,
    size = 'm',
    ...props
}, ref) => {
    const generatedId = useId();
    const inputId = id || `textarea-${generatedId}`;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
        <div className={cn(textAreaVariants({ fullWidth, disabled, error, success, resize }), className)}>
            {label && (
                <label htmlFor={inputId} className="text-area__label">
                    {label} {props.required && <span className="text-area__required-mark">*</span>}
                </label>
            )}

            <div className={cn("text-area__container", `text-area__container--${size}`)}>
                <textarea
                    ref={ref}
                    id={inputId}
                    disabled={disabled}
                    aria-invalid={error || undefined}
                    aria-describedby={helperId}
                    className="text-area__field"
                    {...props}
                />
            </div>

            {helperText && (
                <div id={helperId} className="text-area__helper" role={error ? 'alert' : undefined}>
                    {helperText}
                </div>
            )}
        </div>
    );
});

TextArea.displayName = 'TextArea';
