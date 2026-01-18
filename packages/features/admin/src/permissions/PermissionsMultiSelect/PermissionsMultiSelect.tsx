import { useMemo } from 'react';
import { Select } from '@pulwave/ui';
import type { SelectOption } from '@pulwave/ui';

interface Permission {
    id: string;
    permission_name: string;
    permission_category?: string;
    description?: string;
    is_active: boolean;
}

export interface PermissionsMultiSelectProps {
    selectedPermissionIds?: string[];
    onChange: (values: string[]) => void;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
    excludePermissionIds?: string[];
    allPermissions?: Permission[]; // Injected data
    isLoading?: boolean;
}

/**
 * PermissionsMultiSelect - Multi-select for permissions using Select
 */
export const PermissionsMultiSelect = ({
    selectedPermissionIds = [],
    onChange,
    label = 'Additional Permissions',
    placeholder = 'Select permissions…',
    disabled = false,
    fullWidth = true,
    className,
    excludePermissionIds = [],
    allPermissions = [],
    isLoading = false,
}: PermissionsMultiSelectProps) => {
    // Transform permissions into options format, grouped by category
    const options: SelectOption<string>[] = useMemo(() => {
        return allPermissions
            .filter(p => p.is_active && !excludePermissionIds.includes(p.id))
            .map(p => ({
                value: p.id,
                label: p.permission_name,
                group: p.permission_category || 'Other',
                searchTerms: p.description ? [p.description] : undefined,
            }))
            .sort((a, b) => {
                // Sort by group first, then by name
                const catCompare = (a.group || '').localeCompare(b.group || '');
                if (catCompare !== 0) return catCompare;
                return a.label.localeCompare(b.label);
            });
    }, [allPermissions, excludePermissionIds]);

    return (
        <Select<string>
            multiple
            label={label}
            options={options}
            value={selectedPermissionIds}
            onChange={onChange}
            placeholder={placeholder}
            searchPlaceholder="Search permissions…"
            disabled={disabled}
            fullWidth={fullWidth}
            className={className}
            loading={isLoading}
            searchable
            showSelectAll
            showFooter
        />
    );
};
