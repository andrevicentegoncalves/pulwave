
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const importModalVariants = cva('import-modal', {
    variants: {},
    defaultVariants: {},
});

export const importModalDropZoneVariants = cva('import-modal__drop-zone', {
    variants: {
        active: {
            true: 'import-modal__drop-zone--active',
            false: '',
        },
        hasFiles: {
            true: 'import-modal__drop-zone--has-files',
            false: '',
        }
    },
    defaultVariants: {
        active: false,
        hasFiles: false,
    },
});

export interface ParseResult {
    [key: string]: string | number | boolean | null;
}

export interface ImportModalProps extends VariantProps<typeof importModalVariants> {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: ParseResult[], filname: string) => Promise<void>;
    onValidate?: (data: ParseResult[]) => Promise<{ valid: boolean; errors?: string[] }>;
    supportedFormats?: ('json' | 'csv' | 'xls')[];
    entityName?: string;
    renderPreview?: (data: ParseResult[]) => React.ReactNode;
    maxPreviewRows?: number;
}
