/**
 * ExportData
 *
 * Button component for exporting data to CSV.
 *
 * @package @ui
 */
import { FileSpreadsheet, Button } from '@pulwave/ui';

export interface ExportDataColumn {
    id: string;
    label?: string;
}

export interface ExportDataProps {
    /** Data array to export */
    data: Record<string, unknown>[];
    /** Filename (without extension) */
    filename?: string;
    /** Column definitions */
    columns?: ExportDataColumn[];
    /** Button variant */
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    /** Button size */
    size?: 's' | 'm' | 'l';
}

/**
 * ExportData - CSV export button
 */
export const ExportData = ({
    data,
    filename = 'export',
    columns,
    variant = 'outline',
    size = 's'
}: ExportDataProps) => {
    const exportToCSV = () => {
        if (!data || data.length === 0) {
            return;
        }

        const headers = columns
            ? columns.filter(col => col.id !== 'actions').map(col => col.label || col.id)
            : Object.keys(data[0]);

        const keys = columns
            ? columns.filter(col => col.id !== 'actions').map(col => col.id)
            : Object.keys(data[0]);

        const csvContent = [
            headers.join(','),
            ...data.map(row =>
                keys.map(key => {
                    const value = row[key];
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                }).join(',')
            )
        ].join('\n');

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
            kind={variant === 'primary' || variant === 'secondary' ? variant : 'neutral'}
            variant={variant === 'outline' ? 'outlined' : variant === 'ghost' ? 'ghost' : 'filled'}
            size={size}
            onClick={exportToCSV}
        >
            <FileSpreadsheet size={16} className="margin-right-2" aria-hidden="true" />
            Export CSV
        </Button>
    );
};

ExportData.displayName = 'ExportData';

export default ExportData;
