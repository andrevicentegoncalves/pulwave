import React, { useState, useEffect, useMemo } from 'react';
import { Settings, Plus, Edit2, Trash2, Save, Database, X, Layers, Info, Download } from '../../../components/ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAdminSettings, useUpdateAdminSettings } from '../../../hooks/admin';
import { AdminPageHeader, AdminLoadingState } from '../../../components/admin';
import { Button, Badge, EmptyState, Card, DataTable, Modal, ConfirmationModal, Input, TextArea, Select, MultiSelectDropdown, Tooltip } from '../../../components/ui';
import { FullTableMultiSelect, FullColumnMultiSelect, EnumMultiSelect } from '../../../components/forms';
import { adminService } from '../../../services';
import { supabase } from '../../../lib/supabaseClient';
import { toTitleCase } from '../../../utils';

// Filter type definitions (like translations sourceTypes)
const CONFIG_FILTER_TYPES = [
    { value: '', label: 'All', icon: Layers },
    { value: 'setting', label: 'Settings', icon: Settings },
    { value: 'json', label: 'JSON Config', icon: Database },
];

// JSON Config types managed in system_settings as JSON
const JSON_CONFIG_TYPES = [
    { key: 'TRANSLATABLE_TABLES', label: 'Translatable Tables', description: 'List of database tables available for admin translation (schema)', type: 'array' },
    { key: 'TRANSLATABLE_COLUMNS', label: 'Translatable Columns', description: 'Map of table columns that can be translated by admins', type: 'object' },
    { key: 'TRANSLATABLE_ENUMS', label: 'Translatable Enums', description: 'List of database enum types available for translation', type: 'array' },
    { key: 'USER_TRANSLATABLE_TABLES', label: 'User Translatable Tables', description: 'Tables where regular users can add content translations', type: 'array' },
    { key: 'USER_TRANSLATABLE_COLUMNS', label: 'User Translatable Columns', description: 'Map of table columns that users can translate (content)', type: 'object' },
    { key: 'UI_LAYOUT', label: 'UI Layout', description: 'Default UI layout style for new users', type: 'object' },
];

const CONFIG_TYPES = [
    { value: 'string', label: 'String' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'json', label: 'JSON' },
];

// Categories will be fetched from master_data_values

const ConfigurationManager = () => {
    const [filterType, setFilterType] = useState(''); // '', 'setting', 'json'
    const [categoryFilter, setCategoryFilter] = useState('');
    const [editModal, setEditModal] = useState({ isOpen: false, config: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, config: null });
    const [jsonEditModal, setJsonEditModal] = useState({ isOpen: false, configKey: null, configLabel: null, configType: null });
    const [jsonCreateModal, setJsonCreateModal] = useState({ isOpen: false });
    const [formData, setFormData] = useState({ setting_key: '', setting_value: '', category: 'general', value_type: 'string', description: '' });
    const [jsonFormData, setJsonFormData] = useState('');
    const [newJsonConfig, setNewJsonConfig] = useState({ key: '', label: '', description: '', type: 'array' });
    const [formErrors, setFormErrors] = useState({});

    // For multi-select editing
    const [selectedTables, setSelectedTables] = useState([]);
    const [selectedEnums, setSelectedEnums] = useState([]);
    const [columnConfig, setColumnConfig] = useState({});
    const [selectedTableForColumns, setSelectedTableForColumns] = useState('');
    const [uiLayoutConfig, setUiLayoutConfig] = useState({ style: 'pulwave' });

    // User translatable configs (separate from admin)
    const [userSelectedTables, setUserSelectedTables] = useState([]);
    const [userColumnConfig, setUserColumnConfig] = useState({});
    const [selectedTableForUserColumns, setSelectedTableForUserColumns] = useState('');

    const queryClient = useQueryClient();
    const { data, isLoading, refetch } = useAdminSettings();
    const updateSettings = useUpdateAdminSettings();

    // Fetch all database tables for multi-select
    const { data: allTablesData } = useQuery({
        queryKey: ['admin', 'all-database-tables'],
        queryFn: () => adminService.getAllDatabaseTables(),
    });
    const allTables = allTablesData || [];

    // Fetch columns for selected table
    const { data: tableColumnsData } = useQuery({
        queryKey: ['admin', 'all-table-columns', selectedTableForColumns],
        queryFn: () => adminService.getAllTableColumns(selectedTableForColumns),
        enabled: !!selectedTableForColumns,
    });
    const tableColumns = tableColumnsData || [];

    // Fetch DB Enums for TRANSLATABLE_ENUMS
    const { data: dbEnumsData } = useQuery({
        queryKey: ['admin', 'all-database-enums'],
        queryFn: () => adminService.getDatabaseEnums(),
    });
    const dbEnums = dbEnumsData || [];

    // Fetch setting categories from master_data_values
    const { data: categoriesData } = useQuery({
        queryKey: ['admin', 'setting-categories'],
        queryFn: () => adminService.getMasterDataValues('setting_categories'),
    });

    // Build categories options for Select
    const categoryOptions = useMemo(() => {
        const options = [{ value: '', label: 'All Categories' }];
        if (categoriesData) {
            categoriesData.forEach(cat => {
                options.push({ value: cat.value_key, label: cat.value_label });
            });
        }
        return options;
    }, [categoriesData]);


    const settings = data || [];

    // Filter settings based on filterType
    const filteredSettings = useMemo(() => {
        let result = categoryFilter ? settings.filter(s => s.category === categoryFilter) : settings;

        // Apply type filter
        if (filterType === 'setting') {
            // Exclude JSON configs (value_type === 'json')
            result = result.filter(s => s.value_type !== 'json');
        } else if (filterType === 'json') {
            // Only show JSON type settings
            result = result.filter(s => s.value_type === 'json');
        }
        // 'All' (filterType === '') shows everything - no additional filtering

        return result;
    }, [settings, categoryFilter, filterType]);

    // Get specific JSON config from settings - parse if string
    const getJsonConfig = (key) => {
        const setting = settings.find(s => s.setting_key === key);
        if (!setting) return JSON_CONFIG_TYPES.find(t => t.key === key)?.type === 'array' ? [] : {};
        let value = setting.setting_value;
        // Handle case where value might be a string
        if (typeof value === 'string') {
            try { value = JSON.parse(value); } catch { return []; }
        }
        return value || (JSON_CONFIG_TYPES.find(t => t.key === key)?.type === 'array' ? [] : {});
    };

    // Validation for settings form
    const validateForm = () => {
        const errors = {};
        if (!formData.setting_key?.trim()) {
            errors.setting_key = 'Key is required';
        } else if (!/^[A-Z0-9_]+$/.test(formData.setting_key)) {
            errors.setting_key = 'Key must be UPPERCASE_WITH_UNDERSCORES';
        }
        if (!formData.setting_value?.toString().trim() && formData.value_type !== 'boolean') {
            errors.setting_value = 'Value is required';
        }
        if (formData.value_type === 'json') {
            try { JSON.parse(formData.setting_value); } catch { errors.setting_value = 'Invalid JSON'; }
        }
        if (formData.value_type === 'number' && isNaN(Number(formData.setting_value))) {
            errors.setting_value = 'Must be a valid number';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Export single config as JSON file
    const exportConfig = (config) => {
        const data = {
            setting_key: config.setting_key,
            setting_value: config.setting_value,
            category: config.category,
            value_type: config.value_type,
            description: config.description,
            exported_at: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${config.setting_key}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Export all configs as JSON file
    const exportAllConfigs = () => {
        const data = {
            configs: filteredSettings.map(c => ({
                setting_key: c.setting_key,
                setting_value: c.setting_value,
                category: c.category,
                value_type: c.value_type,
                description: c.description
            })),
            exported_at: new Date().toISOString(),
            count: filteredSettings.length
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `configurations_${filterType || 'all'}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Visual preview component for table/column configs
    const TableColumnPreview = ({ value }) => {
        try {
            const parsed = typeof value === 'string' ? JSON.parse(value) : value;
            if (!parsed || typeof parsed !== 'object') return null;

            // For arrays (TRANSLATABLE_TABLES, TRANSLATABLE_ENUMS)
            if (Array.isArray(parsed)) {
                return (
                    <div className="flex flex-wrap gap-1 max-h-20 overflow-hidden">
                        {parsed.slice(0, 8).map(item => (
                            <Badge key={item} type="neutral" variant="light" size="s">{item}</Badge>
                        ))}
                        {parsed.length > 8 && <Badge type="neutral" variant="light" size="s">+{parsed.length - 8} more</Badge>}
                    </div>
                );
            }

            // For objects (TRANSLATABLE_COLUMNS)
            const tables = Object.keys(parsed);
            return (
                <div className="flex flex-wrap gap-1 max-h-20 overflow-hidden">
                    {tables.slice(0, 4).map(table => (
                        <Tooltip key={table} content={parsed[table]?.join(', ') || 'no columns'} position="top">
                            <Badge type="info" variant="light" size="s" className="cursor-help">
                                {table} ({parsed[table]?.length || 0})
                            </Badge>
                        </Tooltip>
                    ))}
                    {tables.length > 4 && <Badge type="neutral" variant="light" size="s">+{tables.length - 4} tables</Badge>}
                </div>
            );
        } catch {
            return null;
        }
    };

    const openCreateModal = () => {
        setFormData({ setting_key: '', setting_value: '', category: 'general', value_type: 'string', description: '' });
        setFormErrors({});
        setEditModal({ isOpen: true, config: null });
    };

    const openEditModal = (config) => {
        setFormData({
            setting_key: config.setting_key || '',
            setting_value: typeof config.setting_value === 'object' ? JSON.stringify(config.setting_value) : String(config.setting_value ?? ''),
            category: config.category || 'general',
            value_type: config.value_type || 'string',
            description: config.description || '',
        });
        setFormErrors({});
        setEditModal({ isOpen: true, config });
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        try {
            let finalValue = formData.setting_value;
            if (formData.value_type === 'json') finalValue = JSON.parse(formData.setting_value);
            if (formData.value_type === 'number') finalValue = Number(formData.setting_value);
            if (formData.value_type === 'boolean') finalValue = formData.setting_value === 'true';

            await updateSettings.mutateAsync({
                id: editModal.config?.id,
                setting_key: formData.setting_key,
                setting_value: finalValue,
                category: formData.category,
                value_type: formData.value_type,
                description: formData.description,
            });
            setEditModal({ isOpen: false, config: null });
            refetch();
        } catch (err) {
            setFormErrors({ submit: err.message });
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.config) return;
        await updateSettings.mutateAsync({ id: deleteModal.config.id, is_active: false });
        setDeleteModal({ isOpen: false, config: null });
        refetch();
    };

    // JSON Config handlers with multi-select support
    const openJsonEditModal = (configKey) => {
        const configType = JSON_CONFIG_TYPES.find(t => t.key === configKey);
        const currentValue = getJsonConfig(configKey);

        if (configKey === 'TRANSLATABLE_TABLES') {
            setSelectedTables(Array.isArray(currentValue) ? currentValue : []);
        } else if (configKey === 'TRANSLATABLE_ENUMS') {
            setSelectedEnums(Array.isArray(currentValue) ? currentValue : []);
        } else if (configKey === 'TRANSLATABLE_COLUMNS') {
            const colConfig = typeof currentValue === 'object' && !Array.isArray(currentValue) ? currentValue : {};
            setColumnConfig(colConfig);
            // Auto-select first table if any
            const firstTable = Object.keys(colConfig)[0] || '';
            setSelectedTableForColumns(firstTable);
        } else if (configKey === 'USER_TRANSLATABLE_TABLES') {
            setUserSelectedTables(Array.isArray(currentValue) ? currentValue : []);
        } else if (configKey === 'USER_TRANSLATABLE_COLUMNS') {
            const colConfig = typeof currentValue === 'object' && !Array.isArray(currentValue) ? currentValue : {};
            setUserColumnConfig(colConfig);
            const firstTable = Object.keys(colConfig)[0] || '';
            setSelectedTableForUserColumns(firstTable);
        } else if (configKey === 'UI_LAYOUT') {
            const layoutConfig = typeof currentValue === 'object' && !Array.isArray(currentValue) ? currentValue : { style: 'pulwave' };
            setUiLayoutConfig(layoutConfig);
        }

        setJsonFormData(JSON.stringify(currentValue, null, 2));
        setJsonEditModal({
            isOpen: true,
            configKey,
            configLabel: configType?.label || configKey,
            configType: configType?.type
        });
        setFormErrors({});
    };

    // Handle table selection change from MultiSelectDropdown
    const handleTableSelectionChange = (newSelectedTables) => {
        setSelectedTables(newSelectedTables);
        setJsonFormData(JSON.stringify(newSelectedTables, null, 2));
    };

    const handleEnumSelectionChange = (newSelectedEnums) => {
        setSelectedEnums(newSelectedEnums);
        setJsonFormData(JSON.stringify(newSelectedEnums, null, 2));
    };

    // Handle column selection change from MultiSelectDropdown
    const handleColumnSelectionChange = (newSelectedColumns) => {
        if (!selectedTableForColumns) return;
        const updated = { ...columnConfig };
        if (newSelectedColumns.length > 0) {
            updated[selectedTableForColumns] = newSelectedColumns;
        } else {
            delete updated[selectedTableForColumns];
        }
        setColumnConfig(updated);
        setJsonFormData(JSON.stringify(updated, null, 2));
    };

    // Remove table from column config
    const handleRemoveTableFromColumns = (tableName) => {
        const updated = { ...columnConfig };
        delete updated[tableName];
        setColumnConfig(updated);
        setJsonFormData(JSON.stringify(updated, null, 2));
        if (selectedTableForColumns === tableName) {
            setSelectedTableForColumns(Object.keys(updated)[0] || '');
        }
    };

    // User table selection handler
    const handleUserTableSelectionChange = (newSelected) => {
        setUserSelectedTables(newSelected);
        setJsonFormData(JSON.stringify(newSelected, null, 2));
    };

    // User column selection handler
    const handleUserColumnSelectionChange = (newSelectedColumns) => {
        if (!selectedTableForUserColumns) return;
        const updated = { ...userColumnConfig };
        if (newSelectedColumns.length > 0) {
            updated[selectedTableForUserColumns] = newSelectedColumns;
        } else {
            delete updated[selectedTableForUserColumns];
        }
        setUserColumnConfig(updated);
        setJsonFormData(JSON.stringify(updated, null, 2));
    };

    // Remove table from user column config
    const handleRemoveTableFromUserColumns = (tableName) => {
        const updated = { ...userColumnConfig };
        delete updated[tableName];
        setUserColumnConfig(updated);
        setJsonFormData(JSON.stringify(updated, null, 2));
        if (selectedTableForUserColumns === tableName) {
            setSelectedTableForUserColumns(Object.keys(updated)[0] || '');
        }
    };

    const handleSaveJsonConfig = async () => {
        try {
            // Use the current state directly instead of parsing jsonFormData
            let valueToSave;
            if (jsonEditModal.configKey === 'TRANSLATABLE_TABLES') {
                valueToSave = selectedTables;
            } else if (jsonEditModal.configKey === 'TRANSLATABLE_ENUMS') {
                valueToSave = selectedEnums;
            } else if (jsonEditModal.configKey === 'TRANSLATABLE_COLUMNS') {
                valueToSave = columnConfig;
            } else if (jsonEditModal.configKey === 'USER_TRANSLATABLE_TABLES') {
                valueToSave = userSelectedTables;
            } else if (jsonEditModal.configKey === 'USER_TRANSLATABLE_COLUMNS') {
                valueToSave = userColumnConfig;
            } else if (jsonEditModal.configKey === 'UI_LAYOUT') {
                valueToSave = uiLayoutConfig;
            } else {
                valueToSave = JSON.parse(jsonFormData);
            }

            const existingSetting = settings.find(s => s.setting_key === jsonEditModal.configKey);

            await updateSettings.mutateAsync({
                id: existingSetting?.id,
                setting_key: jsonEditModal.configKey,
                setting_value: valueToSave,
                category: jsonEditModal.configKey === 'UI_LAYOUT' ? 'appearance' : 'translations',
                value_type: 'json',
                description: JSON_CONFIG_TYPES.find(t => t.key === jsonEditModal.configKey)?.description || '',
            });
            setJsonEditModal({ isOpen: false, configKey: null, configLabel: null, configType: null });
            refetch();
        } catch (err) {
            setFormErrors({ json: 'Error saving: ' + err.message });
        }
    };

    // Create new JSON config
    const handleCreateJsonConfig = async () => {
        if (!newJsonConfig.key.trim()) {
            setFormErrors({ newKey: 'Key is required' });
            return;
        }
        try {
            const initialValue = newJsonConfig.type === 'array' ? [] : {};
            await updateSettings.mutateAsync({
                setting_key: newJsonConfig.key.toUpperCase().replace(/\s+/g, '_'),
                setting_value: initialValue,
                category: 'translations',
                value_type: 'json',
                description: newJsonConfig.description || '',
            });
            setJsonCreateModal({ isOpen: false });
            setNewJsonConfig({ key: '', label: '', description: '', type: 'array' });
            refetch();
        } catch (err) {
            setFormErrors({ newKey: err.message });
        }
    };

    const getCategoryBadgeType = (category) => {
        const types = { general: 'neutral', email: 'info', auth: 'warning', storage: 'success', payments: 'error', features: 'info', translations: 'info' };
        return types[category] || 'neutral';
    };

    // Settings columns
    const columns = [
        { id: 'setting_key', title: 'Key', sortable: true, render: (value) => <code>{value}</code> },
        { id: 'setting_value', title: 'Value', sortable: false, render: (value) => <code className="data-table__truncate">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</code> },
        { id: 'category', title: 'Category', sortable: true, render: (value) => <Badge type={getCategoryBadgeType(value)} variant="light" size="s">{value}</Badge> },
        {
            id: 'description',
            title: '',
            sortable: false,
            render: (value) => value ? (
                <Tooltip content={value} position="top">
                    <Info size={20} style={{ color: 'var(--color-feedback-info)' }} className="cursor-help" />
                </Tooltip>
            ) : null
        },
        {
            id: 'actions', title: 'Actions', sortable: false,
            render: (_, row) => (
                <div className="data-table__actions">
                    <Button variant="icon-circle" size="s" onClick={() => exportConfig(row)} title="Export"><Download size={14} /></Button>
                    <Button variant="icon-circle" size="s" onClick={() => openEditModal(row)} title="Edit"><Edit2 size={14} /></Button>
                    <Button variant="icon-circle" size="s" onClick={() => setDeleteModal({ isOpen: true, config: row })} title="Delete"><Trash2 size={14} /></Button>
                </div>
            )
        }
    ];

    // JSON Config columns - now uses actual DB data with proper column IDs
    const jsonConfigColumns = [
        { id: 'setting_key', title: 'Key', sortable: true, render: (value) => <code>{value}</code> },
        {
            id: 'setting_value',
            title: 'Value',
            sortable: false,
            render: (value) => <TableColumnPreview value={value} />
        },
        { id: 'category', title: 'Category', sortable: true, render: (value) => <Badge type={getCategoryBadgeType(value)} variant="light" size="s">{value}</Badge> },
        {
            id: 'description',
            title: '',
            sortable: false,
            render: (value) => value ? (
                <Tooltip content={value} position="top">
                    <Info size={20} style={{ color: 'var(--color-feedback-info)' }} className="cursor-help" />
                </Tooltip>
            ) : null
        },
        {
            id: 'actions', title: 'Actions', sortable: false,
            render: (_, row) => (
                <div className="data-table__actions">
                    <Button variant="icon-circle" size="s" onClick={() => exportConfig(row)} title="Export"><Download size={14} /></Button>
                    <Button variant="icon-circle" size="s" onClick={() => openJsonEditModal(row.setting_key)} title="Edit"><Edit2 size={14} /></Button>
                    <Button variant="icon-circle" size="s" onClick={() => setDeleteModal({ isOpen: true, config: row })} title="Delete"><Trash2 size={14} /></Button>
                </div>
            )
        }
    ];

    // Options for MultiSelectDropdown
    const tableOptions = allTables.map(t => ({ value: t.table_name, label: t.label }));
    const enumOptions = dbEnums.map(e => ({ value: e, label: e }));
    const columnOptions = tableColumns.map(c => ({ value: c, label: toTitleCase(c) }));

    // Get translatable tables from config for column editor
    const translatableTables = getJsonConfig('TRANSLATABLE_TABLES');
    const tableOptionsForColumns = Array.isArray(translatableTables)
        ? translatableTables.map(t => ({ value: t, label: allTables.find(at => at.table_name === t)?.label || t }))
        : [];

    if (isLoading) {
        return <AdminLoadingState />;
    }

    return (
        <div className="admin-configuration">
            <AdminPageHeader title="Configuration" subtitle="Manage system settings and parameters">
                <Button variant="secondary" onClick={exportAllConfigs} leftIcon={<Download size={16} />}>Export All</Button>
                {filterType !== 'json' && (
                    <Button variant="primary" onClick={openCreateModal} leftIcon={<Plus size={16} />}>Add Setting</Button>
                )}
                {filterType === 'json' && (
                    <Button variant="primary" onClick={() => setJsonCreateModal({ isOpen: true })} leftIcon={<Plus size={16} />}>Add JSON Config</Button>
                )}
                {filterType === '' && (
                    <Button variant="secondary" onClick={() => setJsonCreateModal({ isOpen: true })} leftIcon={<Plus size={16} />}>Add JSON Config</Button>
                )}
            </AdminPageHeader>

            {/* Filter Buttons (like translations page) */}
            <div className="admin-filters-row mb-4">
                <div className="admin-filters-row__toggle flex gap-2 overflow-x-auto pb-2">
                    {CONFIG_FILTER_TYPES.map(t => {
                        const Icon = t.icon;
                        return (
                            <Button
                                key={t.value}
                                variant={filterType === t.value ? 'primary' : 'secondary'}
                                size="sm"
                                onClick={() => setFilterType(t.value)}
                                leftIcon={<Icon size={14} />}
                                className={filterType === t.value ? '' : 'bg-white border-neutral-200'}
                            >
                                {t.label}
                            </Button>
                        );
                    })}
                </div>
                <div className="data-table__filters filter-w-180">
                    <Select value={categoryFilter} onChange={(value) => setCategoryFilter(value)} options={categoryOptions} placeholder="Category..." />
                </div>
            </div>

            {/* Unified Content Card */}
            <Card variant="elevated">
                <div className="data-table__header admin-flex-between">
                    <h2 className="data-table__title">
                        {filteredSettings.length} {filterType === 'json' ? 'JSON Configurations' : filterType === 'setting' ? 'Settings' : 'Configurations'}
                    </h2>
                </div>

                {filteredSettings.length > 0 ? (
                    <DataTable
                        columns={filterType === 'json' ? jsonConfigColumns : columns}
                        data={filteredSettings}
                        pagination={{ enabled: filteredSettings.length > 25, pageSize: 25, align: 'right' }}
                        showProgress={false}
                    />
                ) : (
                    <EmptyState
                        icon={filterType === 'json' ? <Database /> : <Settings />}
                        title={filterType === 'json' ? 'No JSON configurations found' : 'No settings found'}
                        description="Add a configuration setting"
                        size="s"
                    />
                )}
            </Card>

            {/* Settings Edit Modal */}
            <Modal isOpen={editModal.isOpen} onClose={() => setEditModal({ isOpen: false, config: null })} title={editModal.config ? 'Edit Setting' : 'Add Setting'} size="md">
                <div className="admin-edit-form">
                    {formErrors.submit && <div className="admin-field-error">{formErrors.submit}</div>}
                    <div className="admin-form-field">
                        <Input label="Setting Key" value={formData.setting_key} onChange={(e) => setFormData({ ...formData, setting_key: e.target.value.toUpperCase() })} placeholder="e.g., MAX_UPLOAD_SIZE" disabled={!!editModal.config} fullWidth error={!!formErrors.setting_key} />
                        {formErrors.setting_key && <div className="admin-field-error">{formErrors.setting_key}</div>}
                    </div>
                    <div className="admin-form-field">
                        <Select label="Value Type" value={formData.value_type} onChange={(value) => setFormData({ ...formData, value_type: value })} options={CONFIG_TYPES} fullWidth />
                    </div>
                    <div className="admin-form-field">
                        {formData.value_type === 'boolean' ? (
                            <Select label="Value" value={formData.setting_value} onChange={(value) => setFormData({ ...formData, setting_value: value })} options={[{ value: 'true', label: 'True' }, { value: 'false', label: 'False' }]} fullWidth />
                        ) : formData.value_type === 'json' ? (
                            <>
                                {/* Show table multi-select for TRANSLATABLE_TABLES */}
                                {formData.setting_key === 'TRANSLATABLE_TABLES' && (
                                    <div className="admin-form-field">
                                        <FullTableMultiSelect
                                            selectedValues={(() => {
                                                try {
                                                    const parsed = JSON.parse(formData.setting_value || '[]');
                                                    return Array.isArray(parsed) ? parsed : [];
                                                } catch { return []; }
                                            })()}
                                            onChange={(newTables) => {
                                                setFormData({ ...formData, setting_value: JSON.stringify(newTables) });
                                            }}
                                            label="Select Tables"
                                            placeholder="Search tables..."
                                        />
                                    </div>
                                )}

                                {/* Show table multi-select for USER_TRANSLATABLE_TABLES */}
                                {formData.setting_key === 'USER_TRANSLATABLE_TABLES' && (
                                    <div className="admin-form-field">
                                        <FullTableMultiSelect
                                            selectedValues={(() => {
                                                try {
                                                    const parsed = JSON.parse(formData.setting_value || '[]');
                                                    return Array.isArray(parsed) ? parsed : [];
                                                } catch { return []; }
                                            })()}
                                            onChange={(newTables) => {
                                                setFormData({ ...formData, setting_value: JSON.stringify(newTables) });
                                            }}
                                            label="Select User Translatable Tables"
                                            placeholder="Search tables..."
                                        />
                                    </div>
                                )}

                                {/* Show enum multi-select for TRANSLATABLE_ENUMS */}
                                {formData.setting_key === 'TRANSLATABLE_ENUMS' && (
                                    <div className="admin-form-field">
                                        <EnumMultiSelect
                                            selectedValues={(() => {
                                                try {
                                                    const parsed = JSON.parse(formData.setting_value || '[]');
                                                    return Array.isArray(parsed) ? parsed : [];
                                                } catch { return []; }
                                            })()}
                                            onChange={(newEnums) => {
                                                setFormData({ ...formData, setting_value: JSON.stringify(newEnums) });
                                            }}
                                            label="Select Enums"
                                            placeholder="Search enums..."
                                        />
                                    </div>
                                )}

                                {/* TRANSLATABLE_COLUMNS - table + columns per table */}
                                {formData.setting_key === 'TRANSLATABLE_COLUMNS' && (
                                    <div className="admin-form-field space-y-4">
                                        <p className="text-sm text-neutral-600 mb-2">Configure which columns are translatable for each table.</p>

                                        {/* Auto-fill button */}
                                        <div className="flex gap-2 mb-3">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={async () => {
                                                    try {
                                                        const { data, error } = await supabase.rpc('get_common_translatable_columns');
                                                        if (error) throw error;
                                                        if (!data || data.length === 0) {
                                                            alert('No common translatable columns found');
                                                            return;
                                                        }
                                                        // Group by table_name
                                                        const grouped = {};
                                                        data.forEach(row => {
                                                            if (!grouped[row.table_name]) grouped[row.table_name] = [];
                                                            grouped[row.table_name].push(row.column_name);
                                                        });
                                                        setFormData({ ...formData, setting_value: JSON.stringify(grouped, null, 2) });
                                                    } catch (err) {
                                                        alert('Error: ' + err.message);
                                                    }
                                                }}
                                                leftIcon={<Database size={14} />}
                                            >
                                                Auto-fill common columns
                                            </Button>
                                            <Tooltip content="Finds common translatable column names (name, description, title, label, content, etc.) across all tables" position="top">
                                                <Info size={16} className="text-neutral-400 cursor-help" />
                                            </Tooltip>
                                        </div>

                                        <FullTableMultiSelect
                                            selectedValues={(() => {
                                                try {
                                                    const parsed = JSON.parse(formData.setting_value || '{}');
                                                    return typeof parsed === 'object' && !Array.isArray(parsed) ? Object.keys(parsed) : [];
                                                } catch { return []; }
                                            })()}
                                            onChange={(tables) => {
                                                try {
                                                    const current = JSON.parse(formData.setting_value || '{}');
                                                    const updated = {};
                                                    tables.forEach(t => { updated[t] = current[t] || []; });
                                                    setFormData({ ...formData, setting_value: JSON.stringify(updated, null, 2) });
                                                } catch {
                                                    const obj = {};
                                                    tables.forEach(t => { obj[t] = []; });
                                                    setFormData({ ...formData, setting_value: JSON.stringify(obj, null, 2) });
                                                }
                                            }}
                                            label="Or manually select tables"
                                            placeholder="Search tables..."
                                        />
                                    </div>
                                )}

                                {/* USER_TRANSLATABLE_COLUMNS - table + columns per table */}
                                {formData.setting_key === 'USER_TRANSLATABLE_COLUMNS' && (
                                    <div className="admin-form-field space-y-4">
                                        <p className="text-sm text-neutral-600 mb-2">Configure which columns users can translate. The JSON format is: {"{"}"table_name": ["column1", "column2"]{"}"}</p>
                                        <FullTableMultiSelect
                                            selectedValues={(() => {
                                                try {
                                                    const parsed = JSON.parse(formData.setting_value || '{}');
                                                    return typeof parsed === 'object' && !Array.isArray(parsed) ? Object.keys(parsed) : [];
                                                } catch { return []; }
                                            })()}
                                            onChange={(tables) => {
                                                try {
                                                    const current = JSON.parse(formData.setting_value || '{}');
                                                    const updated = {};
                                                    tables.forEach(t => { updated[t] = current[t] || []; });
                                                    setFormData({ ...formData, setting_value: JSON.stringify(updated, null, 2) });
                                                } catch {
                                                    const obj = {};
                                                    tables.forEach(t => { obj[t] = []; });
                                                    setFormData({ ...formData, setting_value: JSON.stringify(obj, null, 2) });
                                                }
                                            }}
                                            label="Select Tables"
                                            placeholder="Search tables..."
                                        />
                                    </div>
                                )}

                                <TextArea label="Value (JSON)" value={formData.setting_value} onChange={(e) => setFormData({ ...formData, setting_value: e.target.value })} placeholder='{"key": "value"}' rows={4} fullWidth error={!!formErrors.setting_value} />
                                {formErrors.setting_value && <div className="admin-field-error">{formErrors.setting_value}</div>}
                            </>
                        ) : (
                            <>
                                <Input label="Value" value={formData.setting_value} onChange={(e) => setFormData({ ...formData, setting_value: e.target.value })} placeholder="Enter value..." fullWidth error={!!formErrors.setting_value} />
                                {formErrors.setting_value && <div className="admin-field-error">{formErrors.setting_value}</div>}
                            </>
                        )}
                    </div>
                    <div className="admin-form-field">
                        <Select label="Category" value={formData.category} onChange={(value) => setFormData({ ...formData, category: value })} options={categoryOptions.filter(c => c.value !== '')} fullWidth />
                    </div>
                    <div className="admin-form-field">
                        <TextArea label="Description (optional)" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="What does this setting control?" rows={2} fullWidth />
                    </div>
                    <div className="admin-edit-form__actions">
                        <Button variant="secondary" onClick={() => setEditModal({ isOpen: false, config: null })}>Cancel</Button>
                        <Button variant="primary" onClick={handleSave} loading={updateSettings.isPending} leftIcon={<Save size={16} />}>{editModal.config ? 'Save' : 'Create'}</Button>
                    </div>
                </div>
            </Modal>

            {/* JSON Config Edit Modal */}
            <Modal
                isOpen={jsonEditModal.isOpen}
                onClose={() => setJsonEditModal({ isOpen: false, configKey: null, configLabel: null, configType: null })}
                title={`Edit ${jsonEditModal.configLabel || jsonEditModal.configKey}`}
                size="lg"
                className="overflow-visible"
            >
                <div className="admin-edit-form admin-json-layout">
                    {formErrors.json && <div className="admin-field-error">{formErrors.json}</div>}
                    <p className="admin-header__subtitle mt-0">
                        {JSON_CONFIG_TYPES.find(t => t.key === jsonEditModal.configKey)?.description}
                    </p>

                    {/* TRANSLATABLE_TABLES */}
                    {jsonEditModal.configKey === 'TRANSLATABLE_TABLES' && (
                        <FullTableMultiSelect
                            selectedValues={selectedTables}
                            onChange={handleTableSelectionChange}
                            label="Select Tables"
                            placeholder="Search tables..."
                        />
                    )}

                    {/* TRANSLATABLE_ENUMS */}
                    {jsonEditModal.configKey === 'TRANSLATABLE_ENUMS' && (
                        <EnumMultiSelect
                            selectedValues={selectedEnums}
                            onChange={handleEnumSelectionChange}
                            label="Select Enums"
                            placeholder="Search enums..."
                        />
                    )}

                    {/* TRANSLATABLE_COLUMNS */}
                    {jsonEditModal.configKey === 'TRANSLATABLE_COLUMNS' && (
                        <div className="admin-json-layout">
                            <Select
                                label="Select Table"
                                value={selectedTableForColumns}
                                options={[{ value: '', label: 'Choose a table...' }, ...tableOptionsForColumns]}
                                onChange={(value) => setSelectedTableForColumns(value)}
                                fullWidth
                            />

                            {selectedTableForColumns && (
                                <FullColumnMultiSelect
                                    table={selectedTableForColumns}
                                    selectedValues={columnConfig[selectedTableForColumns] || []}
                                    onChange={handleColumnSelectionChange}
                                    placeholder="Search columns..."
                                />
                            )}

                            {Object.keys(columnConfig).length > 0 && (
                                <div className="admin-configured-tables">
                                    <label className="admin-label-strong">Configured Tables</label>
                                    {Object.entries(columnConfig).map(([tableName, cols]) => (
                                        <div key={tableName} className="admin-configured-table-item">
                                            <div className="admin-configured-table-header">
                                                <span>{tableName}</span>
                                                <button onClick={() => handleRemoveTableFromColumns(tableName)} className="admin-remove-btn">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                            <div className="admin-configured-columns">
                                                {cols.map(col => (
                                                    <Badge key={col} variant="info" size="s">{col}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* USER_TRANSLATABLE_TABLES */}
                    {jsonEditModal.configKey === 'USER_TRANSLATABLE_TABLES' && (
                        <FullTableMultiSelect
                            selectedValues={userSelectedTables}
                            onChange={handleUserTableSelectionChange}
                            label="Select Tables for User Translation"
                            placeholder="Search tables..."
                        />
                    )}

                    {/* USER_TRANSLATABLE_COLUMNS */}
                    {jsonEditModal.configKey === 'USER_TRANSLATABLE_COLUMNS' && (
                        <div className="admin-json-layout">
                            <Select
                                label="Select Table"
                                value={selectedTableForUserColumns}
                                options={[{ value: '', label: 'Choose a table...' }, ...tableOptionsForColumns]}
                                onChange={(value) => setSelectedTableForUserColumns(value)}
                                fullWidth
                            />

                            {selectedTableForUserColumns && (
                                <FullColumnMultiSelect
                                    table={selectedTableForUserColumns}
                                    selectedValues={userColumnConfig[selectedTableForUserColumns] || []}
                                    onChange={handleUserColumnSelectionChange}
                                    placeholder="Search columns..."
                                />
                            )}

                            {Object.keys(userColumnConfig).length > 0 && (
                                <div className="admin-configured-tables">
                                    <label className="admin-label-strong">Configured Tables</label>
                                    {Object.entries(userColumnConfig).map(([tableName, cols]) => (
                                        <div key={tableName} className="admin-configured-table-item">
                                            <div className="admin-configured-table-header">
                                                <span>{tableName}</span>
                                                <button onClick={() => handleRemoveTableFromUserColumns(tableName)} className="admin-remove-btn">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                            <div className="admin-configured-columns">
                                                {cols.map(col => (
                                                    <Badge key={col} variant="info" size="s">{col}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}                    {/* UI_LAYOUT */}
                    {jsonEditModal.configKey === 'UI_LAYOUT' && (
                        <div className="admin-form-field">
                            <Select
                                label="Default Layout Style"
                                value={uiLayoutConfig.style || 'pulwave'}
                                options={[
                                    { value: 'pulwave', label: 'PulWave (Rich & Dynamic)' },
                                    { value: 'minimalist', label: 'Minimalist (Clean & Simple)' },
                                ]}
                                onChange={(val) => {
                                    const updated = { ...uiLayoutConfig, style: val };
                                    setUiLayoutConfig(updated);
                                    setJsonFormData(JSON.stringify(updated, null, 2));
                                }}
                                fullWidth
                            />
                        </div>
                    )}

                    {/* Raw JSON editor details */}
                    <details className="admin-raw-json-details">
                        <summary>Show raw JSON</summary>
                        <TextArea
                            value={jsonFormData}
                            onChange={(e) => setJsonFormData(e.target.value)}
                            rows={6}
                            fullWidth
                            className="admin-code-textarea"
                        />
                    </details>

                    <div className="admin-edit-form__actions">
                        <Button variant="secondary" onClick={() => setJsonEditModal({ isOpen: false, configKey: null, configLabel: null, configType: null })}>Cancel</Button>
                        <Button variant="primary" onClick={handleSaveJsonConfig} loading={updateSettings.isPending} leftIcon={<Save size={16} />}>Save</Button>
                    </div>
                </div>
            </Modal>

            {/* Create JSON Config Modal */}
            <Modal isOpen={jsonCreateModal.isOpen} onClose={() => setJsonCreateModal({ isOpen: false })} title="Add JSON Config" size="md">
                <div className="admin-edit-form">
                    {formErrors.newKey && <div className="admin-field-error">{formErrors.newKey}</div>}
                    <div className="admin-form-field">
                        <Input
                            label="Config Key"
                            value={newJsonConfig.key}
                            onChange={(e) => setNewJsonConfig({ ...newJsonConfig, key: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                            placeholder="e.g., MY_CONFIG_NAME"
                            fullWidth
                        />
                    </div>
                    <div className="admin-form-field">
                        <Select
                            label="Type"
                            value={newJsonConfig.type}
                            onChange={(value) => setNewJsonConfig({ ...newJsonConfig, type: value })}
                            options={[{ value: 'array', label: 'Array (list of items)' }, { value: 'object', label: 'Object (key-value pairs)' }]}
                            fullWidth
                        />
                    </div>
                    <div className="admin-form-field">
                        <TextArea
                            label="Description"
                            value={newJsonConfig.description}
                            onChange={(e) => setNewJsonConfig({ ...newJsonConfig, description: e.target.value })}
                            placeholder="What is this config for?"
                            rows={2}
                            fullWidth
                        />
                    </div>
                    <div className="admin-edit-form__actions">
                        <Button variant="secondary" onClick={() => setJsonCreateModal({ isOpen: false })}>Cancel</Button>
                        <Button variant="primary" onClick={handleCreateJsonConfig} loading={updateSettings.isPending} leftIcon={<Plus size={16} />}>Create</Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, config: null })}
                onConfirm={handleDelete}
                title="Delete Setting"
                message={deleteModal.config ? `Delete "${deleteModal.config.setting_key}"?` : ''}
                confirmText="Delete"
                variant="danger"
                loading={updateSettings.isPending}
            />
        </div>
    );

};

export default ConfigurationManager;
