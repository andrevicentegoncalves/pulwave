/**
 * Form
 * 
 * Form wrapper with layout variants.
 * 
 * @package @ui
 */
import { type FormEvent, type ReactNode } from 'react';
import { cn } from '@pulwave/utils';
import {
    formVariants,
    formGroupVariants,
    formRowVariants,
    formActionsVariants,
    type FormProps,
    type FormGroupProps,
    type FormRowProps,
    type FormActionsProps
} from './types';
import './styles/_index.scss';

export * from './types';

/**
 * Form - Form wrapper component
 */
const FormRoot = ({
    children,
    onSubmit,
    className,
    layout = 'vertical',
    ...rest
}: FormProps) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit?.(e);
    };

    return (
        <form
            className={cn(formVariants({ layout }), className)}
            onSubmit={handleSubmit}
            noValidate
            {...rest}
        >
            {children}
        </form>
    );
};

/**
 * FormGroup - Group related form fields
 */
export const FormGroup = ({ children, className }: FormGroupProps) => {
    return (
        <div className={cn(formGroupVariants(), className)}>
            {children}
        </div>
    );
};

/**
 * FormRow - Horizontal layout for form fields
 */
export const FormRow = ({ children, className, gap = 'md' }: FormRowProps) => {
    return (
        <div className={cn(formRowVariants({ gap }), className)}>
            {children}
        </div>
    );
};

/**
 * FormActions - Container for form buttons
 */
export const FormActions = ({
    children,
    className,
    align = 'right'
}: FormActionsProps) => {
    return (
        <div className={cn(formActionsVariants({ align }), className)}>
            {children}
        </div>
    );
};

FormRoot.displayName = 'Form';
FormGroup.displayName = 'Form.Group';
FormRow.displayName = 'Form.Row';
FormActions.displayName = 'Form.Actions';

export const Form = Object.assign(FormRoot, {
    Group: FormGroup,
    Row: FormRow,
    Actions: FormActions,
});

export default Form;
