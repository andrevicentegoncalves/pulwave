
import { useState } from 'react';
import { Upload, FileJson, FileText, Table, Printer, ChevronDown, Dropdown, DropdownItem, DropdownDivider, DropdownLabel, Button, type ButtonProps } from '@pulwave/ui';
import { ImportModal } from '../ImportModal';
import { dataTransferButtonVariants, type DataTransferButtonProps, type DataRecord } from './types';
import { classNames } from '@pulwave/utils';
import './styles/_index.scss';

export const DataTransferButton = ({
    data = [],
    onExport,
    onImport,
    onExportPdf,
    onValidateImport,
    entityName = 'data',
    supportedFormats = ['json', 'csv', 'xls'],
    variant = 'neutral',
    size = 'm',
    disabled = false,
    exportOnly = false,
    importOnly = false,
    className
}: DataTransferButtonProps) => {
    const [importing, setImporting] = useState(false);
    const [isImportModalOpen, setImportModalOpen] = useState(false);

    const handleExport = (format: string) => {
        if (format === 'pdf') {
            if (onExportPdf) {
                onExportPdf(data);
            }
            return;
        }

        if (onExport) {
            onExport(data, format);
            return;
        }

        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `${entityName}_export_${timestamp}.${format}`;

        let content = '';
        let mimeType = 'text/plain';

        if (format === 'json') {
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
        } else if (format === 'csv') {
            if (data.length === 0) {
                content = '';
            } else {
                const headers = Object.keys(data[0]);
                const rows = data.map(row =>
                    headers.map(h => {
                        const val = row[h];
                        if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
                            return `"${val.replace(/"/g, '""')}"`;
                        }
                        return String(val ?? '');
                    }).join(',')
                );
                content = [headers.join(','), ...rows].join('\n');
            }
            mimeType = 'text/csv';
        } else if (format === 'xls') {
            if (data.length === 0) {
                content = '';
            } else {
                const headers = Object.keys(data[0]);
                const rows = data.map(row =>
                    headers.map(h => String(row[h] ?? '')).join('\t')
                );
                content = [headers.join('\t'), ...rows].join('\n');
            }
            mimeType = 'application/vnd.ms-excel';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = async (parsedData: DataRecord[], filename: string) => {
        setImporting(true);
        try {
            if (onImport) {
                await onImport(parsedData, filename);
            }
        } finally {
            setImporting(false);
        }
    };

    const importFormats = supportedFormats.filter(f => f !== 'pdf') as ('json' | 'csv' | 'xls')[];
    const buttonVariant = variant as ButtonProps['variant'];

    return (
        <div className={classNames(dataTransferButtonVariants({ variant, size }), className)}>
            <Dropdown
                trigger={
                    <Button
                        variant={buttonVariant}
                        size={size}
                        disabled={disabled || importing}
                        leftIcon={<FileText size={16} />}
                        rightIcon={<ChevronDown size={14} />}
                        className="data-transfer-button__trigger"
                        loading={importing}
                        aria-label="Data transfer options"
                    >
                        {importOnly ? 'Import' : exportOnly ? 'Export' : 'Data'}
                    </Button>
                }
                align="right"
                className="data-transfer-button__dropdown"
            >
                {!importOnly && (
                    <>
                        <DropdownLabel>Export</DropdownLabel>
                        {supportedFormats.includes('json') && (
                            <DropdownItem
                                icon={<FileJson size={14} />}
                                onClick={() => handleExport('json')}
                            >
                                JSON
                            </DropdownItem>
                        )}
                        {supportedFormats.includes('csv') && (
                            <DropdownItem
                                icon={<FileText size={14} />}
                                onClick={() => handleExport('csv')}
                            >
                                CSV
                            </DropdownItem>
                        )}
                        {supportedFormats.includes('xls') && (
                            <DropdownItem
                                icon={<Table size={14} />}
                                onClick={() => handleExport('xls')}
                            >
                                Excel
                            </DropdownItem>
                        )}
                        {supportedFormats.includes('pdf') && onExportPdf && (
                            <DropdownItem
                                icon={<Printer size={14} />}
                                onClick={() => handleExport('pdf')}
                            >
                                PDF
                            </DropdownItem>
                        )}
                    </>
                )}

                {!importOnly && !exportOnly && <DropdownDivider />}

                {!exportOnly && (
                    <DropdownItem
                        icon={<Upload size={14} />}
                        onClick={() => setImportModalOpen(true)}
                    >
                        Import
                    </DropdownItem>
                )}
            </Dropdown>

            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setImportModalOpen(false)}
                onImport={handleImport}
                onValidate={onValidateImport}
                entityName={entityName}
                supportedFormats={importFormats}
            />
        </div>
    );
};
DataTransferButton.displayName = 'DataTransferButton';
