import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const fileUploadVariants = cva('file-upload', {
    variants: {
        disabled: {
            true: 'file-upload--disabled',
        },
        isDragging: {
            true: 'file-upload--dragging',
        }
    },
    defaultVariants: {
        disabled: false,
        isDragging: false,
    },
});

export type FileUploadVariantProps = VariantProps<typeof fileUploadVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

/**
 * File upload accept types
 */
export type FileAccept = string | string[];

/**
 * Uploaded file info
 */
export interface UploadedFile {
    /** Unique file ID */
    id: string;
    /** File name */
    name: string;
    /** File size in bytes */
    size: number;
    /** MIME type */
    type: string;
    /** Upload progress (0-100) */
    progress?: number;
    /** Upload status */
    status: 'pending' | 'uploading' | 'success' | 'error';
    /** Error message if status is error */
    error?: string;
    /** Preview URL (for images) */
    preview?: string;
    /** The actual File object */
    file?: File;
}

/**
 * FileUpload component props
 */
export interface FileUploadProps {
    /** Callback when files are selected */
    onFilesChange: (files: UploadedFile[]) => void;
    /** Currently uploaded files */
    files?: UploadedFile[];
    /** Accepted file types */
    accept?: FileAccept;
    /** Allow multiple files */
    multiple?: boolean;
    /** Maximum file size in bytes */
    maxSize?: number;
    /** Maximum number of files */
    maxFiles?: number;
    /** Custom dropzone content */
    children?: ReactNode;
    /** Placeholder text */
    placeholder?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Show file previews */
    showPreview?: boolean;
    /** Additional CSS class names */
    className?: string;
    /** Callback for file removal */
    onRemove?: (fileId: string) => void;
}
