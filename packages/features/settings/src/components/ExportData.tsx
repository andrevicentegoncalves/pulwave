/**
 * ExportData Component
 * Export data to CSV
 * @package @pulwave/features/settings
 */
import { type ReactNode, type ComponentType } from 'react';

interface Column {
    id: string;
    label?: string;
}

interface ExportDataProps {
    data: Record<string, unknown>[];
    filename?: string;
    columns?: Column[];
    ButtonComponent: ComponentType<{
        variant?: string;
        size?: string;
        onClick: () => void;
        children: ReactNode;
    }>;
    IconComponent?: ComponentType<{ size?: number; className?: string }>;
}

export const ExportData = ({
    data,
    filename = 'export',
    columns,
    ButtonComponent,
    IconComponent,
}: ExportDataProps) => {
    const exportToCSV = () => {
        if (!data || data.length === 0) {
            // No data to export - silently return
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
        <ButtonComponent variant="outline" size="s" onClick={exportToCSV}>
            {IconComponent && <span aria-hidden="true"><IconComponent size={16} className="margin-right-2" /></span>}
            Export CSV
        </ButtonComponent>
    );
};

export default ExportData;
