import React from 'react';
import { Button } from '../ui';
import { FileSpreadsheet } from 'lucide-react';

/**
 * ExportData Component
 * Reusable component for exporting data to CSV or other formats
 */
const ExportData = ({ data, filename = 'export', columns, variant = 'outline', size = 's' }) => {
    const exportToCSV = () => {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        // Determine headers from columns or data keys
        const headers = columns
            ? columns.filter(col => col.id !== 'actions').map(col => col.label || col.id)
            : Object.keys(data[0]);

        const keys = columns
            ? columns.filter(col => col.id !== 'actions').map(col => col.id)
            : Object.keys(data[0]);

        // Create CSV content
        const csvContent = [
            headers.join(','), // Header row
            ...data.map(row =>
                keys.map(key => {
                    const value = row[key];
                    // Escape commas and quotes
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                }).join(',')
            )
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={exportToCSV}
        >
            <FileSpreadsheet size={16} className="margin-right-2" />
            Export CSV
        </Button>
    );
};

export default ExportData;
