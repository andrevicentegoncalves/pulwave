
import { useState, useRef, useCallback, type ChangeEvent, type DragEvent } from 'react';
import { Upload, FileJson, AlertCircle, CheckCircle, X, Info } from '@pulwave/ui';
import { classNames } from '@pulwave/utils';
import { Modal, Button, Card, ScrollArea, Alert } from '@pulwave/ui';
import {
    importModalVariants,
    importModalDropZoneVariants,
    type ImportModalProps,
    type ParseResult
} from './types';
import './styles/_index.scss';

export const ImportModal = ({
    isOpen,
    onClose,
    onImport,
    onValidate,
    supportedFormats = ['json', 'csv'],
    entityName = 'data',
    renderPreview,
    maxPreviewRows = 10
}: ImportModalProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [parsedData, setParsedData] = useState<ParseResult[] | null>(null);
    const [parseError, setParseError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [importing, setImporting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const acceptedTypes = supportedFormats.map(f => `.${f}`).join(',');

    const resetState = useCallback(() => {
        setFiles([]);
        setParsedData(null);
        setParseError(null);
        setValidationErrors([]);
        setImporting(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const handleClose = useCallback(() => {
        resetState();
        onClose();
    }, [onClose, resetState]);

    const parseFile = useCallback(async (file: File): Promise<ParseResult[]> => {
        try {
            const text = await file.text();
            let data: ParseResult[] = [];

            if (file.name.endsWith('.json')) {
                const parsed = JSON.parse(text);
                if (Array.isArray(parsed)) {
                    data = parsed;
                } else {
                    data = [parsed];
                }
            } else if (file.name.endsWith('.csv')) {
                const lines = text.split('\n').filter(line => line.trim());
                if (lines.length === 0) {
                    data = [];
                } else {
                    const parseCSVLine = (line: string) => {
                        const result = [];
                        let current = '';
                        let inQuotes = false;

                        for (let i = 0; i < line.length; i++) {
                            const char = line[i];
                            if (char === '"') {
                                inQuotes = !inQuotes;
                            } else if (char === ',' && !inQuotes) {
                                result.push(current.trim());
                                current = '';
                            } else {
                                current += char;
                            }
                        }
                        result.push(current.trim());
                        return result;
                    };

                    const headers = parseCSVLine(lines[0]);
                    data = lines.slice(1).map(line => {
                        const values = parseCSVLine(line);
                        return headers.reduce((obj, header, i) => {
                            obj[header] = values[i] || '';
                            return obj;
                        }, {} as ParseResult);
                    });
                }
            } else if (file.name.endsWith('.xls')) {
                const lines = text.split('\n').filter(line => line.trim());
                if (lines.length === 0) {
                    data = [];
                } else {
                    const headers = lines[0].split('\t').map(h => h.trim());
                    data = lines.slice(1).map(line => {
                        const values = line.split('\t').map(v => v.trim());
                        return headers.reduce((obj, header, i) => {
                            obj[header] = values[i] || '';
                            return obj;
                        }, {} as ParseResult);
                    });
                }
            } else {
                throw new Error('Unsupported file format');
            }

            return data;
        } catch (err) {
            throw new Error(`Error parsing ${file.name}: ${(err as Error).message}`);
        }
    }, []);

    const processFiles = useCallback(async (newFiles: File[]) => {
        setParseError(null);
        setValidationErrors([]);

        try {
            const allData: ParseResult[] = [];
            for (const file of newFiles) {
                const data = await parseFile(file);
                allData.push(...data);
            }

            setParsedData(allData);
            setFiles(newFiles);

            if (onValidate && allData.length > 0) {
                const result = await onValidate(allData);
                if (!result.valid) {
                    setValidationErrors(result.errors || ['Validation failed']);
                }
            }
        } catch (err) {
            setParseError((err as Error).message);
            setParsedData(null);
        }
    }, [parseFile, onValidate]);

    const handleFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length > 0) {
            await processFiles(selectedFiles);
        }
    }, [processFiles]);

    const handleDrag = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(async (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFiles = Array.from(e.dataTransfer.files || []);
        if (droppedFiles.length > 0) {
            await processFiles(droppedFiles);
        }
    }, [processFiles]);

    const removeFile = useCallback((indexToRemove: number) => {
        setFiles(currentFiles => {
            const newFiles = currentFiles.filter((_, i) => i !== indexToRemove);
            if (newFiles.length === 0) {
                resetState();
                return [];
            } else {
                processFiles(newFiles);
                return newFiles;
            }
        });
    }, [resetState, processFiles]);

    const handleImportClick = useCallback(async () => {
        if (!parsedData || validationErrors.length > 0) return;

        setImporting(true);
        try {
            const filenames = files.map(f => f.name).join(', ');
            await onImport(parsedData, filenames);
            handleClose();
        } catch (err) {
            setParseError(`Import failed: ${(err as Error).message}`);
        } finally {
            setImporting(false);
        }
    }, [parsedData, validationErrors, onImport, files, handleClose]);

    const canImport = parsedData && parsedData.length > 0 && validationErrors.length === 0 && !parseError;

    const footerContent = (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
            <Button variant="ghost" onClick={handleClose}>
                Cancel
            </Button>
            <Button
                kind="primary"
                onClick={handleImportClick}
                disabled={!canImport || importing}
                loading={importing}
            >
                {parsedData?.length ? `Import ${parsedData.length} Records` : 'Import'}
            </Button>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={`Import ${entityName}`} size="l" footer={footerContent}>
            <div className={classNames(importModalVariants())}>
                <div
                    className={classNames(importModalDropZoneVariants({ active: dragActive, hasFiles: files.length > 0 }))}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    aria-label={files.length > 0 ? `${files.length} file(s) selected. Click to add more or drop files here` : `Drop files here or click to browse. Supported formats: ${supportedFormats.join(', ')}`}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            fileInputRef.current?.click();
                        }
                    }}
                >
                    {files.length > 0 ? (
                        <>
                            <div className="import-modal__file-list">
                                {files.map((file, index) => (
                                    <div key={`${file.name}-${index}`} className="import-modal__file-item">
                                        <div className="import-modal__file-info">
                                            <FileJson size={20} aria-hidden="true" />
                                            <span className="file-name">{file.name}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="import-modal__file-remove-btn"
                                            onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                            aria-label={`Remove ${file.name}`}
                                        >
                                            <X size={14} aria-hidden="true" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="import-modal__drop-hint">
                                <Info size={14} aria-hidden="true" />
                                <span>Drop more files to add, or click to replace</span>
                            </div>
                        </>
                    ) : (
                        <div className="import-modal__empty-state">
                            <Upload size={32} aria-hidden="true" />
                            <p>Drag & drop files here, or click to browse</p>
                            <span>
                                Supported: {supportedFormats.map(f => f.toUpperCase()).join(', ')}
                            </span>
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedTypes}
                    onChange={handleFileChange}
                    multiple
                    className="import-modal__hidden-input"
                />

                {parseError && (
                    <Alert status="error">
                        {parseError}
                    </Alert>
                )}

                {validationErrors.length > 0 && (
                    <div className="import-modal__validation-errors">
                        <div className="validation-header">
                            <AlertCircle size={16} aria-hidden="true" />
                            <span>Validation Errors ({validationErrors.length})</span>
                        </div>
                        <ul>
                            {validationErrors.slice(0, 5).map((err) => (
                                <li key={err}>{err}</li>
                            ))}
                            {validationErrors.length > 5 && (
                                <li>…and {validationErrors.length - 5} more</li>
                            )}
                        </ul>
                    </div>
                )}

                {parsedData && parsedData.length > 0 && !parseError && (() => {
                    const allKeys = [...new Set(parsedData.flatMap((row) => Object.keys(row)))];
                    const displayKeys = allKeys.slice(0, 6);
                    const hasMoreKeys = allKeys.length > 6;
                    const previewData = parsedData.slice(0, maxPreviewRows);

                    return (
                        <Card className="import-modal__preview">
                            <div className="import-modal__preview-info">
                                <CheckCircle size={16} aria-hidden="true" />
                                <span>{parsedData.length} records found{files.length > 1 ? ` from ${files.length} files` : ''}</span>
                            </div>
                            {renderPreview ? (
                                renderPreview(previewData)
                            ) : (
                                <ScrollArea maxHeight="220px" orientation="both">
                                    <table className="import-modal__preview-table">
                                        <thead>
                                            <tr>
                                                {displayKeys.map(key => (
                                                    <th key={key}>{key}</th>
                                                ))}
                                                {hasMoreKeys && <th>…</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.map((row, i) => (
                                                <tr key={i}>
                                                    {displayKeys.map(key => (
                                                        <td key={key}>
                                                            {String(row[key] ?? '').substring(0, 50)}
                                                        </td>
                                                    ))}
                                                    {hasMoreKeys && <td>…</td>}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {parsedData.length > maxPreviewRows && (
                                        <div className="more-rows-hint">
                                            +{parsedData.length - maxPreviewRows} more rows
                                        </div>
                                    )}
                                </ScrollArea>
                            )}
                        </Card>
                    );
                })()}
            </div>
        </Modal>
    );
};
ImportModal.displayName = 'ImportModal';
