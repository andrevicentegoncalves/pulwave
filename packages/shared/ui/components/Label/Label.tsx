/**
 * Label Component
 * 
 * Form field labels with support for required/optional indicators.
 */
import React from 'react';
import { cn } from '@pulwave/utils';
import { labelVariants, type LabelProps } from './types';
import './styles/_index.scss';


export const LabelRoot = React.forwardRef<HTMLDivElement, LabelProps & React.HTMLAttributes<HTMLDivElement>>(
    ({ className, size, disabled, children, ...props }, ref) => (
        <div ref={ref} className={cn(labelVariants({ size, disabled }), className)} {...props}>
            {children}
        </div>
    )
);
LabelRoot.displayName = 'Label.Root';

export const LabelText = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, children, ...props }, ref) => (
        <label ref={ref} className={cn('label__text', className)} {...props}>
            {children}
        </label>
    )
);
LabelText.displayName = 'Label.Text';

export const LabelDescription = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
    ({ className, children, ...props }, ref) => (
        <span ref={ref} className={cn('label__description', className)} {...props}>
            {children}
        </span>
    )
);
LabelDescription.displayName = 'Label.Description';

const LabelMain = ({
    children,
    htmlFor,
    size = 'm',
    required = false,
    optional = false,
    disabled = false,
    className,
    description,
    ...props
}: LabelProps) => {
    return (
        <LabelRoot size={size} disabled={disabled} className={className} {...props}>
            <LabelText htmlFor={htmlFor}>
                {children}
                {required && <span className="label__required" aria-hidden="true">*</span>}
                {optional && <span className="label__optional">(optional)</span>}
            </LabelText>
            {description && (
                <LabelDescription>{description}</LabelDescription>
            )}
        </LabelRoot>
    );
};

export const Label = Object.assign(LabelMain, {
    Root: LabelRoot,
    Text: LabelText,
    Description: LabelDescription,
});

Label.displayName = 'Label';
