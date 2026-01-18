
import { cva, type VariantProps } from 'class-variance-authority';
import { type ParseResult } from '../ImportModal/types';

export const dataTransferButtonVariants = cva('data-transfer-button', {
    variants: {
        variant: {
            primary: 'data-transfer-button--primary',
            secondary: 'data-transfer-button--secondary',
            neutral: 'data-transfer-button--neutral',
            ghost: 'data-transfer-button--ghost',
            danger: 'data-transfer-button--danger',
        },
        size: {
            s: 'data-transfer-button--s',
            m: 'data-transfer-button--m',
            l: 'data-transfer-button--l',
        }
    },
    defaultVariants: {
        variant: 'neutral',
        size: 'm',
    },
});

// Type for data records that can be exported/imported
export type DataRecord = Record<string, unknown>;

export interface DataTransferButtonProps extends VariantProps<typeof dataTransferButtonVariants> {
    data?: DataRecord[];
    onExport?: (data: DataRecord[], format: string) => void;
    onImport?: (data: DataRecord[], filename: string) => Promise<void>;
    onExportPdf?: (data: DataRecord[]) => void;
    onValidateImport?: (data: ParseResult[]) => Promise<{ valid: boolean; errors?: string[] }>;
    entityName?: string;
    supportedFormats?: ('json' | 'csv' | 'xls' | 'pdf')[];
    disabled?: boolean;
    exportOnly?: boolean;
    importOnly?: boolean;
    className?: string;
}
