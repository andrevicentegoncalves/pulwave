import { useRef, useState, useCallback, type DragEvent, type ChangeEvent } from 'react';
import { cn } from '@pulwave/utils';
import { Upload, X, File, Image, CheckCircle, AlertCircle, Loader2 } from '../../icon-library';
import { fileUploadVariants, type FileUploadProps, type UploadedFile } from './types';
import './styles/_index.scss';



const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const generateFileId = () => `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const FileUpload = ({
    onFilesChange,
    files = [],
    accept,
    multiple = false,
    maxSize,
    maxFiles,
    children,
    placeholder = 'Drag files here or click to upload',
    disabled = false,
    showPreview = true,
    className,
    onRemove,
}: FileUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const acceptString = Array.isArray(accept) ? accept.join(',') : accept;

    const processFiles = useCallback((fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;

        const newFiles: UploadedFile[] = [];
        const filesToProcess = multiple ? Array.from(fileList) : [fileList[0]];

        // Check maxFiles limit
        const maxAllowed = maxFiles ? maxFiles - files.length : filesToProcess.length;
        const filesToAdd = filesToProcess.slice(0, Math.max(0, maxAllowed));

        filesToAdd.forEach((file) => {
            // Validate file size
            if (maxSize && file.size > maxSize) {
                newFiles.push({
                    id: generateFileId(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    status: 'error',
                    error: `File exceeds maximum size of ${formatFileSize(maxSize)}`,
                    file,
                });
                return;
            }

            // Create preview for images
            let preview: string | undefined;
            if (file.type.startsWith('image/')) {
                preview = URL.createObjectURL(file);
            }

            newFiles.push({
                id: generateFileId(),
                name: file.name,
                size: file.size,
                type: file.type,
                status: 'success',
                preview,
                file,
            });
        });

        onFilesChange([...files, ...newFiles]);
    }, [files, maxFiles, maxSize, multiple, onFilesChange]);

    const handleDragEnter = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (!disabled) {
            processFiles(e.dataTransfer.files);
        }
    }, [disabled, processFiles]);

    const handleClick = () => {
        if (!disabled) inputRef.current?.click();
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
        // Reset input value to allow re-selecting same file
        e.target.value = '';
    };

    const handleRemove = (fileId: string) => {
        // Revoke preview URL if exists
        const fileToRemove = files.find(f => f.id === fileId);
        if (fileToRemove?.preview) {
            URL.revokeObjectURL(fileToRemove.preview);
        }
        onFilesChange(files.filter(f => f.id !== fileId));
        onRemove?.(fileId);
    };

    const getFileIcon = (file: UploadedFile) => {
        if (file.type.startsWith('image/')) return <Image size={20} aria-hidden="true" />;
        return <File size={20} aria-hidden="true" />;
    };

    const getStatusIcon = (file: UploadedFile) => {
        switch (file.status) {
            case 'uploading':
                return <Loader2 size={16} className="file-upload__status-icon file-upload__status-icon--loading" aria-hidden="true" />;
            case 'success':
                return <CheckCircle size={16} className="file-upload__status-icon file-upload__status-icon--success" aria-hidden="true" />;
            case 'error':
                return <AlertCircle size={16} className="file-upload__status-icon file-upload__status-icon--error" aria-hidden="true" />;
            default:
                return null;
        }
    };

    return (
        <div className={cn(fileUploadVariants({ disabled, isDragging }), className)}>
            <div
                className="file-upload__dropzone"
                onClick={handleClick}
                onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
                        e.preventDefault();
                        inputRef.current?.click();
                    }
                }}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-disabled={disabled}
                aria-label={`Drop files here or press Enter to browse${accept ? `. Accepted formats: ${Array.isArray(accept) ? accept.join(', ') : accept}` : ''}`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="file-upload__input"
                    accept={acceptString}
                    multiple={multiple}
                    disabled={disabled}
                    onChange={handleInputChange}
                    aria-hidden="true"
                />
                {children || (
                    <div className="file-upload__placeholder">
                        <Upload size={32} className="file-upload__icon" aria-hidden="true" />
                        <span className="file-upload__text">{placeholder}</span>
                        {accept && (
                            <span className="file-upload__accept">
                                Accepted: {Array.isArray(accept) ? accept.join(', ') : accept}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {showPreview && files.length > 0 && (
                <ul className="file-upload__list">
                    {files.map((file) => (
                        <li key={file.id} className={cn('file-upload__item', `file-upload__item--${file.status}`)}>
                            {file.preview ? (
                                <img src={file.preview} alt={file.name} className="file-upload__preview" width={40} height={40} />
                            ) : (
                                <span className="file-upload__file-icon">{getFileIcon(file)}</span>
                            )}
                            <div className="file-upload__info">
                                <span className="file-upload__name">{file.name}</span>
                                <span className="file-upload__size">{formatFileSize(file.size)}</span>
                                {file.error && <span className="file-upload__error">{file.error}</span>}
                            </div>
                            <span className="file-upload__status">{getStatusIcon(file)}</span>
                            <button
                                type="button"
                                className="file-upload__remove"
                                onClick={() => handleRemove(file.id)}
                                aria-label={`Remove ${file.name}`}
                            >
                                <X size={16} aria-hidden="true" />
                            </button>
                            {file.status === 'uploading' && file.progress !== undefined && (
                                <div className="file-upload__progress">
                                    <div
                                        className="file-upload__progress-bar"
                                        style={{ transform: `scaleX(${file.progress / 100})` }}
                                    />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

FileUpload.displayName = 'FileUpload';
