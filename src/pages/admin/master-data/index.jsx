import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Globe, MapPin, Building, Tag, Database, Languages, Clock,
    CreditCard, Shield, Users, Save, Edit2, Trash2, Plus, ChevronRight
} from '../../../components/ui';
import {
    Tabs, TabPanel, Card, Button, Input, TextArea, Checkbox,
    Badge, Spinner, EmptyState, Modal, ConfirmationModal, DataTable
} from '../../../components/ui';
import SectionLayout from '../../../components/layouts/SectionLayout';
import Sidebar from '../../../components/navigation/Sidebar';
import { adminService } from '../../../services';

const MASTER_DATA_STRUCTURE = {
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
        ]
    },
    system: {
        label: 'System',
        icon: Database,
        items: [
            { key: 'locales', label: 'Supported Locales', icon: Languages, table: 'supported_locales', editable: true },
            { key: 'timezones', label: 'Timezones', icon: Clock, table: 'timezones', editable: true },
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

// Field definitions for table forms
const TABLE_FIELDS = {
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
    supported_locales: [
        { key: 'locale', label: 'Locale Code', type: 'text', required: true },
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'native_name', label: 'Native Name', type: 'text' },
        { key: 'is_default', label: 'Default', type: 'toggle' },
        { key: 'is_active', label: 'Active', type: 'toggle', default: true },
    ],
    timezones: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'offset', label: 'Offset', type: 'text' },
        { key: 'abbreviation', label: 'Abbreviation', type: 'text' },
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

// Column definitions per table
const TABLE_COLUMNS = {
    countries: [
        { id: 'code', title: 'Code', sortable: true, render: (v) => <Badge variant="neutral">{v}</Badge> },
        { id: 'name', title: 'Name', sortable: true },
        { id: 'phone_code', title: 'Phone', render: (v) => v ? `+${v}` : '-' },
        { id: 'is_active', title: 'Active', render: (v) => <Badge variant={v ? 'success' : 'neutral'}>{v ? 'Yes' : 'No'}</Badge> },
    ],
    administrative_divisions: [
        { id: 'name', title: 'Name', sortable: true },
        { id: 'division_type', title: 'Type', sortable: true, render: (v) => <Badge variant="info">{v}</Badge> },
        { id: 'code', title: 'Code', sortable: true },
        { id: 'is_active', title: 'Active', render: (v) => <Badge variant={v ? 'success' : 'neutral'}>{v ? 'Yes' : 'No'}</Badge> },
    ],
    localities: [
        { id: 'name', title: 'Name', sortable: true },
        { id: 'place_type', title: 'Type', render: (v) => <Badge variant="info">{v || 'city'}</Badge> },
        { id: 'is_active', title: 'Active', render: (v) => <Badge variant={v ? 'success' : 'neutral'}>{v ? 'Yes' : 'No'}</Badge> },
    ],
    regional_blocks: [
        { id: 'code', title: 'Code', sortable: true, render: (v) => <Badge variant="neutral">{v}</Badge> },
        { id: 'name', title: 'Name', sortable: true },
        { id: 'block_type', title: 'Type', render: (v) => <Badge variant="info">{v}</Badge> },
        { id: 'is_active', title: 'Active', render: (v) => <Badge variant={v ? 'success' : 'neutral'}>{v ? 'Yes' : 'No'}</Badge> },
    ],
    supported_locales: [
        { id: 'locale', title: 'Locale', sortable: true, render: (v) => <code>{v}</code> },
        { id: 'name', title: 'Name', sortable: true },
        { id: 'native_name', title: 'Native Name' },
        { id: 'is_default', title: 'Default', render: (v) => v ? <Badge variant="info">Default</Badge> : '-' },
        { id: 'is_active', title: 'Active', render: (v) => <Badge variant={v ? 'success' : 'neutral'}>{v ? 'Yes' : 'No'}</Badge> },
    ],
    timezones: [
        { id: 'name', title: 'Name', sortable: true },
        { id: 'offset', title: 'Offset', render: (v) => v || '-' },
        { id: 'abbreviation', title: 'Abbrev', render: (v) => v ? <code>{v}</code> : '-' },
        { id: 'is_active', title: 'Active', render: (v) => <Badge variant={v ? 'success' : 'neutral'}>{v ? 'Yes' : 'No'}</Badge> },
    ],
    subscription_plans: [
        { id: 'plan_code', title: 'Code', sortable: true, render: (v) => <code>{v}</code> },
        { id: 'plan_name', title: 'Name', sortable: true },
        { id: 'monthly_price', title: 'Price/mo', render: (v) => v ? `$${v}` : 'Free' },
        { id: 'is_active', title: 'Active', render: (v) => <Badge variant={v ? 'success' : 'neutral'}>{v ? 'Yes' : 'No'}</Badge> },
    ],
    payment_method_icons: [
        { id: 'method_code', title: 'Code', sortable: true, render: (v) => <code>{v}</code> },
        { id: 'display_name', title: 'Display Name', sortable: true },
        { id: 'method_type', title: 'Type', render: (v) => <Badge variant="info">{v}</Badge> },
        { id: 'is_active', title: 'Active', render: (v) => <Badge variant={v ? 'success' : 'neutral'}>{v ? 'Yes' : 'No'}</Badge> },
    ],
    master_data: [
        { id: 'value_key', title: 'Key', sortable: true, render: (v) => <code>{v}</code> },
        { id: 'value_label', title: 'Label', sortable: true },
        { id: 'display_order', title: 'Order', sortable: true },
    ],
    enum: [
        { id: 'value', title: 'Value', render: (v) => <code>{v}</code> },
        { id: 'label', title: 'Label' },
    ],
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const MasterDataManager = () => {
    // Generate sidebar items from structure
    // Flatten structure into arrays suitable for Sidebar Menu
    const sidebarItems = React.useMemo(() => Object.entries(MASTER_DATA_STRUCTURE).map(([key, section]) => ({
        label: section.label,
        icon: section.icon,
        // Categories need 'items'
        items: section.items.map(item => ({
            id: item.key,
            label: item.label,
            icon: item.icon
        }))
    })), []);

    // Flatten all items for lookup
    const allItems = React.useMemo(() => Object.values(MASTER_DATA_STRUCTURE).flatMap(section => section.items), []);

    const [selectedItem, setSelectedItem] = useState(null);
    const [editModal, setEditModal] = useState({ isOpen: false, record: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, record: null });
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});

    // Initialize with first item of first section
    useEffect(() => {
        if (!selectedItem && allItems.length > 0) {
            setSelectedItem(allItems[0]);
        }
    }, [allItems]);

    const queryClient = useQueryClient();

    // Determine what data to fetch based on selected item
    const getQueryConfig = () => {
        if (!selectedItem) return null;
        if (selectedItem.type === 'master_data') {
            return { key: ['admin', 'master-data-values', selectedItem.typeKey], fn: () => adminService.getMasterDataValues(selectedItem.typeKey) };
        }
        if (selectedItem.type === 'enum') {
            return null;
        }
        return { key: ['admin', selectedItem.table], fn: () => adminService.getTableData(selectedItem.table) };
    };

    const queryConfig = getQueryConfig();
    const { data: tableData, isLoading, refetch } = useQuery({
        queryKey: queryConfig?.key || ['admin', 'empty'],
        queryFn: queryConfig?.fn || (() => Promise.resolve([])),
        enabled: !!queryConfig,
    });

    // Generic save mutation
    const saveMutation = useMutation({
        mutationFn: async (data) => {
            if (selectedItem.type === 'master_data') {
                return adminService.saveMasterDataValue({ ...data, type_key: selectedItem.typeKey });
            }
            return adminService.saveTableRecord(selectedItem.table, data);
        },
        onSuccess: () => {
            refetch();
            setEditModal({ isOpen: false, record: null });
        },
    });

    // Generic delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            if (selectedItem.type === 'master_data') {
                return adminService.deleteMasterDataValue(id);
            }
            return adminService.deleteTableRecord(selectedItem.table, id);
        },
        onSuccess: () => {
            refetch();
            setDeleteModal({ isOpen: false, record: null });
        },
    });

    // Get display data
    const getData = () => {
        if (!selectedItem) return [];
        if (selectedItem.type === 'enum') {
            return (selectedItem.values || []).map(v => ({
                value: v,
                label: v.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
            }));
        }
        return tableData || [];
    };

    const data = getData();
    const fieldType = selectedItem?.type === 'master_data' ? 'master_data' : selectedItem?.table;
    const fields = TABLE_FIELDS[fieldType] || [];
    const columns = selectedItem?.type === 'enum' ? TABLE_COLUMNS.enum :
        selectedItem?.type === 'master_data' ? TABLE_COLUMNS.master_data :
            TABLE_COLUMNS[selectedItem?.table] || [];

    // Add actions column for editable items
    const columnsWithActions = selectedItem?.editable
        ? [...columns, {
            id: 'actions', title: 'Actions', sortable: false,
            render: (_, row) => (
                <div className="data-table__actions">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(row)} title="Edit"><Edit2 size={14} /></Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteModal({ isOpen: true, record: row })} title="Delete"><Trash2 size={14} /></Button>
                </div>
            )
        }]
        : columns;

    // Form helpers
    const getInitialFormData = () => {
        const initial = {};
        fields.forEach(f => {
            initial[f.key] = f.default ?? (f.type === 'toggle' ? false : f.type === 'json' ? '{}' : '');
        });
        return initial;
    };

    const openCreateModal = () => {
        setFormData(getInitialFormData());
        setFormErrors({});
        setEditModal({ isOpen: true, record: null });
    };

    const openEditModal = (record) => {
        const data = {};
        fields.forEach(f => {
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
        const errors = {};
        fields.forEach(f => {
            if (f.required && !formData[f.key]?.toString().trim()) {
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
        fields.forEach(f => {
            if (f.type === 'json') {
                submitData[f.key] = JSON.parse(formData[f.key] || '{}');
            }
            if (f.type === 'number') {
                submitData[f.key] = Number(formData[f.key]) || 0;
            }
        });
        if (editModal.record?.id) submitData.id = editModal.record.id;
        await saveMutation.mutateAsync(submitData);
    };

    const handleDelete = async () => {
        if (!deleteModal.record) return;
        await deleteMutation.mutateAsync(deleteModal.record.id);
    };

    const updateField = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="admin-master-data h-full w-full">
            {/* Header */}
            <div className="admin-header margin-bottom-6">
                <div>
                    <h1>Master Data Manager</h1>
                    <p className="admin-header__subtitle">
                        Manage system-wide reference data, lookup tables, and configuration values.
                    </p>
                </div>
            </div>

            <SectionLayout
                sidebar={
                    <Sidebar
                        items={sidebarItems}
                        activeItem={selectedItem?.key}
                        onSelect={(id) => {
                            const item = allItems.find(i => i.key === id);
                            if (item) setSelectedItem(item);
                        }}
                        variant="neutral"
                        position="static"
                        showUserInfo={false}
                    />
                }
            >

                {/* Main Content */}
                <Card variant="elevated" className="min-h-[600px]">
                    <div className="data-table__header flex justify-between items-center p-6 border-b border-border-subtle">
                        <div>
                            <h2 className="text-display-xs font-bold text-text-primary">{selectedItem?.label}</h2>
                            <p className="text-sm text-text-secondary mt-1">
                                {selectedItem?.type === 'enum' ? 'Database enum values (read-only)' :
                                    selectedItem?.type === 'master_data' ? 'Managed lookup values' :
                                        `Data from ${selectedItem?.table} table`}
                            </p>
                        </div>
                        {selectedItem?.editable && (
                            <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={openCreateModal}>
                                Add New
                            </Button>
                        )}
                    </div>

                    <div className="p-0">
                        {isLoading ? (
                            <div className="h-64 flex items-center justify-center">
                                <Spinner />
                            </div>
                        ) : data.length > 0 ? (
                            <DataTable
                                columns={columnsWithActions}
                                data={data}
                                pagination={{ enabled: data.length > 25, pageSize: 25, align: 'right' }}
                                showProgress={false}
                            />
                        ) : (
                            <EmptyState icon={<Languages />} title="No data found" description="Select an item from the sidebar to view its data." size="s" />
                        )}
                    </div>
                </Card>
            </SectionLayout>

            {/* Dynamic Form Modal */}
            <Modal isOpen={editModal.isOpen} onClose={() => setEditModal({ isOpen: false, record: null })} title={editModal.record ? `Edit ${selectedItem?.label}` : `Add ${selectedItem?.label}`} size="md">
                {/* Form Content */}
                <div className="admin-edit-form">
                    {formErrors.submit && <div className="admin-field-error">{formErrors.submit}</div>}
                    {fields.map(field => (
                        <div className="admin-form-field" key={field.key}>
                            {field.type === 'toggle' ? (
                                <Checkbox
                                    label={field.label}
                                    checked={formData[field.key] || false}
                                    onChange={(e) => updateField(field.key, e.target.checked)}
                                />
                            ) : field.type === 'json' ? (
                                <>
                                    <TextArea label={field.label} value={formData[field.key] || ''} onChange={(e) => updateField(field.key, e.target.value)} rows={3} fullWidth error={!!formErrors[field.key]} />
                                    {formErrors[field.key] && <div className="admin-field-error">{formErrors[field.key]}</div>}
                                </>
                            ) : (
                                <>
                                    <Input label={field.label} type={field.type === 'number' ? 'number' : 'text'} value={formData[field.key] || ''} onChange={(e) => updateField(field.key, e.target.value)} fullWidth error={!!formErrors[field.key]} disabled={editModal.record && field.key === 'value_key'} />
                                    {formErrors[field.key] && <div className="admin-field-error">{formErrors[field.key]}</div>}
                                </>
                            )}
                        </div>
                    ))}
                    <div className="admin-edit-form__actions">
                        <Button variant="secondary" onClick={() => setEditModal({ isOpen: false, record: null })}>Cancel</Button>
                        <Button variant="primary" onClick={handleSave} loading={saveMutation.isPending} leftIcon={<Save size={16} />}>{editModal.record ? 'Save' : 'Create'}</Button>
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
                loading={deleteMutation.isPending}
            />
        </div>
    );
};

export default MasterDataManager;
