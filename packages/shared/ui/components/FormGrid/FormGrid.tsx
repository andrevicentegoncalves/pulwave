import { type ReactNode } from 'react';
import { cn } from '@pulwave/utils';
import { formGridVariants, formGridRowVariants, type FormGridProps, type FormGridRowProps } from './types';
import './styles/_index.scss';

/**
 * FormGrid - Container for form fields
 */
const FormGridRoot = ({ children, className }: FormGridProps) => (
    <div className={cn(formGridVariants(), className)}>
        {children}
    </div>
);

/**
 * FormGridRow - Responsive row with columns
 */
export const FormGridRow = ({ columns = 2, children, className }: FormGridRowProps) => {
    return (
        <div className={cn(formGridRowVariants({ columns }), className)}>
            {children}
        </div>
    );
};

FormGridRoot.displayName = 'FormGrid';
FormGridRow.displayName = 'FormGrid.Row';

export const FormGrid = Object.assign(FormGridRoot, {
    Row: FormGridRow,
});

export default FormGrid;
