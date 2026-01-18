import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
    Globe, MapPin, Building, Tag, Database, Languages, Clock,
    CreditCard, Shield, Users, Save, Edit2, Trash2, Plus, Download, Upload
} from '@pulwave/ui';
import {
    Card, Button, Input, TextArea, Checkbox, Badge, Spinner, EmptyState, Modal, ConfirmationModal, DataTable, SearchInput, SectionHeader
} from '@pulwave/ui';
import { DataTransferButton, ContentLayout } from '@pulwave/widgets';
import {
    useAdminMasterDataValues,
    useAdminMasterDataTypes,
    useAdminTableRecords,
    useSaveAdminMasterDataValue,
    useSaveAdminMasterDataType,
    useSaveAdminTableRecord,
    useDeleteAdminMasterDataValue,
    useDeleteAdminMasterDataType,
    useDeleteAdminTableRecord,
} from '@pulwave/features-admin';

// Configuration Constants
const MASTER_DATA_STRUCTURE = {
    data_types: {
        label: 'Data Types',
        icon: Database,
        items: [
            { key: 'master_data_types', label: 'All Data Types', icon: Database, table: 'master_data_types', editable: true },
        ]
    },
    geography: {
        label: 'Geography',
        icon: Globe,
        items: [
            { key: 'countries', label: 'Countries', icon: Globe, table: 'countries', editable: true },
            { key: 'admin_divisions', label: 'Regions / States', icon: MapPin, table: 'administrative_divisions', editable: true },
            { key: 'localities', label: 'Cities / Towns', icon: Building, table: 'localities', editable: true },
            { key: 'regional_blocks', label: 'Regional Blocks', icon: Globe, table: 'regional_blocks', editable: true },
        ]
    },
    translations: {
        label: 'Translations',
        icon: Languages,
        items: [
            { key: 'translation_categories', label: 'Categories', icon: Tag, type: 'master_data', typeKey: 'translation_categories', editable: true },
            { key: 'translatable_tables', label: 'Translatable Tables', icon: Database, type: 'master_data', typeKey: 'translatable_tables', editable: true },
            { key: 'translatable_enums', label: 'Translatable Enums', icon: Database, type: 'master_data', typeKey: 'translatable_enums', editable: true },
        ]
    },
    system: {
        label: 'System',
        icon: Database,
        items: [
            { key: 'locales', label: 'Supported Locales', icon: Languages, table: 'locales', editable: true },
            { key: 'timezones', label: 'Timezones', icon: Clock, table: 'timezones', editable: true },
            { key: 'setting_categories', label: 'Setting Categories', icon: Tag, type: 'master_data', typeKey: 'setting_categories', editable: true },
        ]
    },
    billing: {
        label: 'Billing',
        icon: CreditCard,
        items: [
            { key: 'subscription_plans', label: 'Subscription Plans', icon: CreditCard, table: 'subscription_plans', editable: true },
            { key: 'payment_icons', label: 'Payment Icons', icon: CreditCard, table: 'payment_method_icons', editable: true },
        ]
    },
    roles: {
        label: 'Roles',
        icon: Shield,
        items: [
            { key: 'app_role', label: 'App Roles', icon: Shield, type: 'enum', values: ['super_admin', 'admin', 'support', 'user'], editable: false },
            { key: 'user_role', label: 'User Roles', icon: Users, type: 'enum', values: ['owner', 'investor', 'property-manager', 'tenant', 'vendor', 'contractor'], editable: false },
        ]
    },
};

const TABLE_FIELDS: Record<string, any[]> = {
    master_data_types: [
        { key: 'type_key', label: 'Type Key', type: 'text', required: true },
        { key: 'type_name', label: 'Type Name', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'icon', label: 'Icon (lucide name)', type: 'text' },
        { key: 'display_order', label: 'Display Order', type: 'number' },
        { key: 'is_system', label: 'System Type', type: 'toggle' },
        { key: 'is_active', label: 'Active', type: 'toggle', default: true },
    ],
    countries: [
        { key: 'code', label: 'Country Code', type: 'text', required: true },
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'phone_code', label: 'Phone Code', type: 'text' },
        { key: 'is_active', label: 'Active', type: 'toggle', default: true },
    ],
    administrative_divisions: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'division_type', label: 'Type', type: 'text', required: true },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'is_active', label: 'Active', type: 'toggle', default: true },
    ],
    localities: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'place_type', label: 'Type', type: 'text' },
        { key: 'is_active', label: 'Active', type: 'toggle', default: true },
    ],
    regional_blocks: [
        { key: 'code', label: 'Code', type: 'text', required: true },
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'block_type', label: 'Type', type: 'text' },
        { key: 'is_active', label: 'Active', type: 'toggle', default: true },
    ],
    locales: [
        { key: 'code', label: 'Locale Code', type: 'text', required: true },
        { key: 'language_code', label: 'Language Code', type: 'text', required: true },
        { key: 'country_code', label: 'Country Code', type: 'text' },
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'native_name', label: 'Native Name', type: 'text' },
        { key: 'is_rtl', label: 'Right-to-Left', type: 'toggle' },
        { key: 'is_active', label: 'Active', type: 'toggle', default: true },
    ],
    timezones: [
        { key: 'display_name', label: 'Display Name', type: 'text', required: true },
        { key: 'tz_identifier', label: 'TZ Identifier', type: 'text', required: true },
        { key: 'utc_offset', label: 'UTC Offset', type: 'text' },
        { key: 'display_order', label: 'Display Order', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'toggle', default: true },
    ],
    subscription_plans: [
        { key: 'plan_code', label: 'Plan Code', type: 'text', required: true },
        { key: 'plan_name', label: 'Name', type: 'text', required: true },
        { key: 'monthly_price', label: 'Monthly Price', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'toggle', default: true },
    ],
    payment_method_icons: [
        { key: 'method_code', label: 'Code', type: 'text', required: true },
        { key: 'display_name', label: 'Display Name', type: 'text', required: true },
        { key: 'method_type', label: 'Type', type: 'text' },
        { key: 'is_active', label: 'Active', type: 'toggle', default: true },
    ],
    master_data: [
        { key: 'value_key', label: 'Key', type: 'text', required: true },
        { key: 'value_label', label: 'Label', type: 'text', required: true },
        { key: 'display_order', label: 'Order', type: 'number' },
        { key: 'value_data', label: 'Extra Data (JSON)', type: 'json' },
    ],
};

const TABLE_COLUMNS: Record<string, any[]> = {
    master_data_types: [
        { id: 'type_key', title: 'Key', sortable: true, render: (v: any) => { const str = typeof v === 'string' ? v : (v?.key || v?.type_key || JSON.stringify(v) || ''); return <code>{str}</code>; } },
        { id: 'type_name', title: 'Name', sortable: true },
        { id: 'description', title: 'Description', render: (v: string) => v ? (v.length > 40 ? v.substring(0, 40) + '...' : v) : '-' },
        { id: 'icon', title: 'Icon', render: (v: string) => v ? <code>{v}</code> : '-' },
        { id: 'is_system', title: 'System', render: (v: boolean) => <Badge status={v ? 'info' : 'neutral'}>{v ? 'Yes' : 'No'}</Badge> },
        { id: 'is_active', title: 'Active', render: (v: boolean) => <Badge status={v ? 'success' : 'neutral'}>{v ? 'Yes' : 'No'}</Badge> },
    ],
    countries: [
        { id: 'code', title: 'Code', sortable: true, render: (v: string) => <Badge status="neutral" variant="light">{v}</Badge> },
        { id: 'name', title: 'Name', sortable: true },
        { id: 'phone_code', title: 'Phone', render: (v: string) => v ? `+${v}` : '-' },
        { id: 'is_active', title: 'Active', render: (v: boolean) => <Badge status={v ? 'success' : 'neutral'}>{v ? 'Yes' : 'No'}</Badge> },
    ],
    administrative_divisions: [
        { id: 'name', title: 'Name', sortable: true },
        { id: 'division_type', title: 'Type', sortable: true, render: (v: string) => <Badge variant="light" status="info">{v}</Badge> },
        { id: 'code', title: 'Code', sortable: true },
        { id: 'is_active', title: 'Active', render: (v: boolean) => <Badge status={v ? 'success' : 'neutral'}>{v ? 'Yes' : 'No'}</Badge> },
    ],
    localities: [
        { id: 'name', title: 'Name', sortable: true },
        { id: 'place_type', title: 'Type', render: (v: string) => <Badge variant="light" status="info">{v || 'city'}</Badge> },
        { id: 'is_active', title: 'Active', render: (v: boolean) => <Badge status={v ? 'success' : 'neutral'}>{v ? 'Yes' : 'No'}</Badge> },
    ],
    regional_blocks: [
        { id: 'code', title: 'Code', sortable: true, render: (v: string) => <Badge status="neutral">{v}</Badge> },
        { id: 'name', title: 'Name', sortable: true },
        { id: 'block_type', title: 'Type', render: (v: string) => <Badge variant="light" status="info">{v}</Badge> },
        { id: 'is_active', title: 'Active', render: (v: boolean) => <Badge status={v ? 'success' : 'neutral'}>{v ? 'Yes' : 'No'}</Badge> },
    ],
    locales: [
        { id: 'code', title: 'Code', sortable: true, render: (v: string) => <code>{v}</code> },
        { id: 'name', title: 'Name', sortable: true },
        { id: 'native_name', title: 'Native Name' },
        { id: 'is_rtl', title: 'RTL', render: (v: boolean) => v ? <Badge variant="light" status="info">RTL</Badge> : '-' },
        { id: 'is_active', title: 'Active', render: (v: boolean) => <Badge status={v ? 'success' : 'neutral'}>{v ? 'Yes' : 'No'}</Badge> },
    ],
    timezones: [
        { id: 'display_name', title: 'Display Name', sortable: true },
        { id: 'tz_identifier', title: 'TZ Identifier', render: (v: string) => v ? <code>{v}</code> : '-' },
        { id: 'utc_offset', title: 'UTC Offset', render: (v: string) => v || '-' },
        { id: 'is_active', title: 'Active', render: (v: boolean) => <Badge status={v ? 'success' : 'neutral'}>{v ? 'Yes' : 'No'}</Badge> },
    ],
    subscription_plans: [
        { id: 'plan_code', title: 'Code', sortable: true, render: (v: string) => <code>{v}</code> },
        { id: 'plan_name', title: 'Name', sortable: true },
        { id: 'monthly_price', title: 'Price/mo', render: (v: number) => v ? `$${v}` : 'Free' },
        { id: 'is_active', title: 'Active', render: (v: boolean) => <Badge status={v ? 'success' : 'neutral'}>{v ? 'Yes' : 'No'}</Badge> },
    ],
    payment_method_icons: [
        { id: 'method_code', title: 'Code', sortable: true, render: (v: string) => <code>{v}</code> },
        { id: 'display_name', title: 'Display Name', sortable: true },
        { id: 'method_type', title: 'Type', render: (v: string) => <Badge variant="light" status="info">{v}</Badge> },
        { id: 'is_active', title: 'Active', render: (v: boolean) => <Badge status={v ? 'success' : 'neutral'}>{v ? 'Yes' : 'No'}</Badge> },
    ],
    master_data: [
        { id: 'value_key', title: 'Key', sortable: true, render: (v: string) => <code>{v}</code> },
        { id: 'value_label', title: 'Label', sortable: true },
        { id: 'display_order', title: 'Order', sortable: true },
    ],
    enum: [
        { id: 'value', title: 'Value', render: (v: string) => <code>{v}</code> },
        { id: 'label', title: 'Label' },
    ],
};

/**
 * MasterDataPage - Master Data Manager for admin
 */
const MasterDataPage = () => {
    const { itemKey } = useParams<{ itemKey?: string }>();
    const navigate = useNavigate();

    // Flatten items for lookup
    const allItems = useMemo(() => Object.values(MASTER_DATA_STRUCTURE).flatMap((section: any) => section.items), []);

    // Get selected item from URL params
    const selectedItem = useMemo(() => {
        if (!itemKey) return allItems[0] || null;
        return allItems.find((i: any) => i.key === itemKey) || allItems[0] || null;
    }, [itemKey, allItems]);

    // Redirect to first item if no item selected
    useEffect(() => {
        if (!itemKey && allItems.length > 0) {
            navigate(`/admin/master-data/${allItems[0].key}`, { replace: true });
        }
    }, [itemKey, allItems, navigate]);

    // Data Fetching
    const { data: masterDataValues, isLoading: isMasterDataLoading, refetch: refetchMasterData } = useAdminMasterDataValues(selectedItem?.type === 'master_data' ? selectedItem.typeKey : '');
    const { data: masterDataTypes, isLoading: isMasterDataTypesLoading, refetch: refetchMasterDataTypes } = useAdminMasterDataTypes();
    const { data: tableRecords, isLoading: isTableRecordsLoading, refetch: refetchTableRecords } = useAdminTableRecords(
        (!selectedItem?.type && selectedItem?.table) ? selectedItem.table : ''
    );

    const isLoading = selectedItem?.type === 'master_data' ? isMasterDataLoading :
        selectedItem?.table === 'master_data_types' ? isMasterDataTypesLoading :
            selectedItem?.type === 'enum' ? false : isTableRecordsLoading;

    // Mutations
    const saveMasterDataValue = useSaveAdminMasterDataValue();
    const saveMasterDataType = useSaveAdminMasterDataType();
    const saveTableRecord = useSaveAdminTableRecord(selectedItem?.table);

    const deleteMasterDataValue = useDeleteAdminMasterDataValue();
    const deleteMasterDataType = useDeleteAdminMasterDataType();
    const deleteTableRecord = useDeleteAdminTableRecord(selectedItem?.table);

    // State
    const [editModal, setEditModal] = useState<{ isOpen: boolean; record: any }>({ isOpen: false, record: null });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; record: any }>({ isOpen: false, record: null });
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [search, setSearch] = useState('');

    // Get display data
    const getData = () => {
        if (!selectedItem) return [];
        if (selectedItem.type === 'enum') {
            return (selectedItem.values || []).map((v: string) => ({
                value: v,
                label: v.split(/[-_]/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
            }));
        }
        if (selectedItem.type === 'master_data') return masterDataValues || [];
        if (selectedItem.table === 'master_data_types') return masterDataTypes || [];
        return tableRecords || [];
    };

    const data = getData();

    // Filtering
    const filteredData = useMemo(() => {
        if (!search.trim()) return data;
        const q = search.toLowerCase();
        return data.filter((item: any) => {
            return Object.values(item).some(v =>
                typeof v === 'string' && v.toLowerCase().includes(q)
            );
        });
    }, [data, search]);

    // Fields & Columns
    const fieldType = selectedItem?.type === 'master_data' ? 'master_data' : selectedItem?.table;
    const fields = TABLE_FIELDS[fieldType] || [];
    const columns = selectedItem?.type === 'enum' ? TABLE_COLUMNS.enum :
        selectedItem?.type === 'master_data' ? TABLE_COLUMNS.master_data :
            TABLE_COLUMNS[selectedItem?.table] || [];

    const columnsWithActions = selectedItem?.editable
        ? [...columns, {
            id: 'actions', title: 'Actions', sortable: false,
            render: (_: any, row: any) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="s" onClick={() => openEditModal(row)} title="Edit" aria-label="Edit"><Edit2 size={14} aria-hidden="true" /></Button>
                    <Button variant="ghost" size="s" onClick={() => setDeleteModal({ isOpen: true, record: row })} title="Delete" aria-label="Delete"><Trash2 size={14} aria-hidden="true" /></Button>
                </div>
            )
        }]
        : columns;

    // Handlers
    const openCreateModal = () => {
        const initial: Record<string, any> = {};
        fields.forEach((f: any) => {
            initial[f.key] = f.default ?? (f.type === 'toggle' ? false : f.type === 'json' ? '{}' : '');
        });
        setFormData(initial);
        setFormErrors({});
        setEditModal({ isOpen: true, record: null });
    };

    const openEditModal = (record: any) => {
        const data: Record<string, any> = {};
        fields.forEach((f: any) => {
            if (f.type === 'json') {
                data[f.key] = JSON.stringify(record[f.key] || {}, null, 2);
            } else {
                data[f.key] = record[f.key] ?? '';
            }
        });
        setFormData(data);
        setFormErrors({});
        setEditModal({ isOpen: true, record });
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        fields.forEach((f: any) => {
            if (f.required && !String(formData[f.key]).trim()) {
                errors[f.key] = `${f.label} is required`;
            }
            if (f.type === 'json' && formData[f.key]) {
                try { JSON.parse(formData[f.key]); } catch { errors[f.key] = 'Invalid JSON'; }
            }
        });
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        const submitData = { ...formData };
        fields.forEach((f: any) => {
            if (f.type === 'json') {
                submitData[f.key] = JSON.parse(formData[f.key] || '{}');
            }
            if (f.type === 'number') {
                submitData[f.key] = Number(formData[f.key]) || 0;
            }
        });
        if (editModal.record?.id) submitData.id = editModal.record.id;

        try {
            if (selectedItem.type === 'master_data') {
                await saveMasterDataValue.mutateAsync({ ...submitData, type_key: selectedItem.typeKey });
            } else if (selectedItem.table === 'master_data_types') {
                await saveMasterDataType.mutateAsync(submitData);
            } else {
                await saveTableRecord.mutateAsync({ table: selectedItem.table, data: submitData });
            }
            setEditModal({ isOpen: false, record: null });
        } catch {
            // Silent error handling for save
            setFormErrors({ submit: 'Failed to save record' });
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.record) return;
        try {
            if (selectedItem.type === 'master_data') {
                await deleteMasterDataValue.mutateAsync(deleteModal.record.id);
            } else if (selectedItem.table === 'master_data_types') {
                await deleteMasterDataType.mutateAsync(deleteModal.record.id);
            } else {
                await deleteTableRecord.mutateAsync({ table: selectedItem.table, id: deleteModal.record.id });
            }
            setDeleteModal({ isOpen: false, record: null });
        } catch {
            // Silent error handling for delete
        }
    };

    const updateField = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleExport = () => {
        if (!data || data.length === 0) {
            return;
        }
        const exportData = {
            type: selectedItem?.type || 'table',
            source: selectedItem?.type === 'master_data' ? selectedItem.typeKey : selectedItem?.table,
            exportedAt: new Date().toISOString(),
            count: data.length,
            data: data
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedItem?.key || 'data'}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const importData = JSON.parse(text);

            if (!importData.data || !Array.isArray(importData.data)) {
                throw new Error('Invalid import file format');
            }

            if (!window.confirm(`Import ${importData.data.length} records? This will add/update records.`)) {
                e.target.value = '';
                return;
            }

            let successCount = 0;
            // Sequential import for simplicity and error tracking
            for (const record of importData.data) {
                try {
                    const { id, created_at, updated_at, ...cleanRecord } = record;
                    if (selectedItem.type === 'master_data') {
                        await saveMasterDataValue.mutateAsync({ ...cleanRecord, type_key: selectedItem.typeKey });
                    } else if (selectedItem.table === 'master_data_types') {
                        await saveMasterDataType.mutateAsync(cleanRecord);
                    } else {
                        await saveTableRecord.mutateAsync({ table: selectedItem.table, data: cleanRecord });
                    }
                    successCount++;
                } catch {
                    // Silent error handling for individual record import
                }
            }
            // Trigger refetches
            if (selectedItem.type === 'master_data') refetchMasterData();
            else if (selectedItem.table === 'master_data_types') refetchMasterDataTypes();
            else refetchTableRecords();

        } catch {
            // Silent error handling for import
        }
        e.target.value = '';
    };

    return (
        <ContentLayout>
            <SectionHeader title="Master Data Manager" />
            <p className="mb-4 color-muted">Manage system-wide reference data, lookup tables, and configuration values.</p>

            <div className="flex flex-1 overflow-hidden h-[calc(100vh-200px)]">
                {/* Main Content Area - Full Width */}
                <div className="flex-1 overflow-y-auto">
                    <Card variant="elevated" className="min-h-full">
                        <div className="flex justify-between items-center p-6 border-b border-neutral-100">
                            <div>
                                <h2 className="text-xl font-bold">{selectedItem?.label}</h2>
                                <p className="text-sm text-neutral-500 mt-1">
                                    {selectedItem?.type === 'enum' ? 'Database enum values (read-only)' :
                                        selectedItem?.type === 'master_data' ? 'Managed lookup values' :
                                            `Data from ${selectedItem?.table} table`}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <SearchInput
                                    value={search}
                                    onChange={(e: any) => setSearch(e.target.value)}
                                    onClear={() => setSearch('')}
                                    placeholder="Search..."
                                    size="s"
                                />
                                <Button kind="neutral" size="s" leftIcon={<Download size={16} />} onClick={handleExport}>
                                    Export
                                </Button>
                                <Button kind="neutral" size="s" leftIcon={<Upload size={16} />} onClick={() => document.getElementById('import-file')?.click()}>
                                    Import
                                </Button>
                                <input type="file" id="import-file" accept=".json,.csv" style={{ display: 'none' }} onChange={handleImport} />
                                {selectedItem?.editable && (
                                    <Button kind="primary" size="s" leftIcon={<Plus size={16} />} onClick={openCreateModal}>
                                        Add New
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="p-0">
                            {isLoading ? (
                                <div className="h-64 flex items-center justify-center">
                                    <Spinner />
                                </div>
                            ) : filteredData.length > 0 ? (
                                <DataTable
                                    columns={columnsWithActions}
                                    data={filteredData}
                                    loading={isLoading}
                                />
                            ) : (
                                <EmptyState
                                    icon={<Languages />}
                                    title={search ? "No results found" : "No data found"}
                                    description={search ? "Try a different search term" : "Select an item from the sidebar to view its data."}
                                    size="s"
                                />
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Dynamic Form Modal */}
            <Modal isOpen={editModal.isOpen} onClose={() => setEditModal({ isOpen: false, record: null })} title={editModal.record ? `Edit ${selectedItem?.label}` : `Add ${selectedItem?.label}`} size="m">
                <div className="flex flex-col gap-4">
                    {formErrors.submit && <div className="text-error-600 bg-error-50 p-2 rounded">{formErrors.submit}</div>}
                    {fields.map((field: any) => (
                        <div key={field.key}>
                            {field.type === 'toggle' ? (
                                <Checkbox
                                    label={field.label}
                                    checked={formData[field.key] || false}
                                    onChange={(e) => updateField(field.key, e.target.checked)}
                                />
                            ) : field.type === 'json' ? (
                                <>
                                    <TextArea label={field.label} value={formData[field.key] || ''} onChange={(e) => updateField(field.key, e.target.value)} rows={3} fullWidth error={!!formErrors[field.key]} />
                                    {formErrors[field.key] && <div className="text-error-600 text-sm">{formErrors[field.key]}</div>}
                                </>
                            ) : (
                                <>
                                    <Input label={field.label} type={field.type === 'number' ? 'number' : 'text'} value={formData[field.key] || ''} onChange={(e) => updateField(field.key, e.target.value)} fullWidth error={!!formErrors[field.key]} disabled={editModal.record && field.key === 'value_key'} />
                                    {formErrors[field.key] && <div className="text-error-600 text-sm">{formErrors[field.key]}</div>}
                                </>
                            )}
                        </div>
                    ))}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button kind="secondary" variant="outlined" onClick={() => setEditModal({ isOpen: false, record: null })}>Cancel</Button>
                        <Button kind="primary" onClick={handleSave} loading={saveMasterDataValue.isPending || saveMasterDataType.isPending || saveTableRecord.isPending} leftIcon={<Save size={16} />}>{editModal.record ? 'Save' : 'Create'}</Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, record: null })}
                onConfirm={handleDelete}
                title="Delete Record"
                message={deleteModal.record ? `Delete "${deleteModal.record.name || deleteModal.record.value_label || deleteModal.record.code || 'this record'}"?` : ''}
                confirmText="Delete"
                variant="danger"
                loading={deleteMasterDataValue.isPending || deleteMasterDataType.isPending || deleteTableRecord.isPending}
            />
        </ContentLayout>
    );
};

export default MasterDataPage;
