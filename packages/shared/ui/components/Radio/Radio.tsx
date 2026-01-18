/**
 * Radio Component
 * 
 * Single radio button input with label support.
 */
import React, { forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import {
    radioVariants,
    radioLabelVariants,
    radioDescriptionVariants,
    radioControlVariants,
    type RadioProps
} from './types';
import './styles/_index.scss';

const RadioRoot = forwardRef<HTMLInputElement, RadioProps>(({
    label,
    size = 'm',
    description,
    className,
    disabled,
    id,
    ...props
}, ref) => {
    const inputId = id || `radio-${props.name}-${props.value}`;

    return (
        <div className={cn(radioVariants({ size, disabled }), className)}>
            <input
                ref={ref}
                type="radio"
                id={inputId}
                className="radio__input"
                disabled={disabled}
                {...props}
            />
            <span className={cn(radioControlVariants())} aria-hidden="true" />
            {(label || description) && (
                <div className="radio__content">
                    {label && (
                        <label htmlFor={inputId} className={cn(radioLabelVariants())}>
                            {label}
                        </label>
                    )}
                    {description && (
                        <span className={cn(radioDescriptionVariants())}>{description}</span>
                    )}
                </div>
            )}
        </div>
    );
});
RadioRoot.displayName = 'Radio';

// Compound Sub-components
const RadioLabel = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={cn(radioLabelVariants(), className)}>{children}</span>
);
RadioLabel.displayName = 'Radio.Label';

const RadioDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={cn(radioDescriptionVariants(), className)}>{children}</span>
);
RadioDescription.displayName = 'Radio.Description';

const RadioControl = ({ className }: { className?: string }) => (
    <span className={cn(radioControlVariants(), className)} aria-hidden="true" />
);
RadioControl.displayName = 'Radio.Control';

// Export with compound sub-components
export const Radio = Object.assign(RadioRoot, {
    Label: RadioLabel,
    Description: RadioDescription,
    Control: RadioControl,
});
