import { cva, type VariantProps } from 'class-variance-authority';

export const formVariants = cva('form', {
    variants: {
        layout: {
            vertical: 'form--vertical',
            horizontal: 'form--horizontal',
            inline: 'form--inline',
        }
    },
    defaultVariants: {
        layout: 'vertical',
    }
});

export const formGroupVariants = cva('form-group', {
    variants: {
        // Add variants here if needed later
    },
    defaultVariants: {}
});

export const formRowVariants = cva('form-row', {
    variants: {
        gap: {
            sm: 'form-row--gap-sm',
            md: 'form-row--gap-md',
            lg: 'form-row--gap-lg',
        }
    },
    defaultVariants: {
        gap: 'md',
    }
});

export const formActionsVariants = cva('form-actions', {
    variants: {
        align: {
            left: 'form-actions--left',
            center: 'form-actions--center',
            right: 'form-actions--right',
            'space-between': 'form-actions--space-between',
        }
    },
    defaultVariants: {
        align: 'right',
    }
});

export type FormVariants = VariantProps<typeof formVariants>;
export type FormRowVariants = VariantProps<typeof formRowVariants>;
export type FormActionsVariants = VariantProps<typeof formActionsVariants>;

export type FormLayout = NonNullable<FormVariants['layout']>;
export type FormActionsAlign = NonNullable<FormActionsVariants['align']>;
export type FormRowGap = NonNullable<FormRowVariants['gap']>;

export interface FormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>, FormVariants {
    children: React.ReactNode;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    className?: string;
}

export interface FormGroupProps {
    children: React.ReactNode;
    className?: string;
}

export interface FormRowProps extends FormRowVariants {
    children: React.ReactNode;
    className?: string;
}

export interface FormActionsProps extends FormActionsVariants {
    children: React.ReactNode;
    className?: string;
}
