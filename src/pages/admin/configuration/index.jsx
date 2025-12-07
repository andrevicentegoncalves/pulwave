import React, { useState, useEffect } from 'react';
import { Settings, Plus, Edit2, Trash2, Save, Database, X } from '../../../components/ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAdminSettings, useUpdateAdminSettings } from '../../../hooks/admin';
import { Button, Badge, EmptyState, Spinner, Card, DataTable, Modal, ConfirmationModal, Input, TextArea, Select, MultiSelectDropdown, Tabs, TabPanel } from '../../../components/ui';
import { adminService } from '../../../services';

// Tab definitions
const CONFIG_TABS = [
    { key: 'settings', label: 'Settings', icon: Settings },
    { key: 'json_configs', label: 'JSON Configs', icon: Database },
];

// JSON Config types managed in system_settings as JSON
const JSON_CONFIG_TYPES = [
    { key: 'TRANSLATABLE_TABLES', label: 'Translatable Tables', description: 'List of database tables available for translation', type: 'array' },
    { key: 'TRANSLATABLE_COLUMNS', label: 'Translatable Columns', description: 'Map of table columns that can be translated', type: 'object' },
];

const CONFIG_TYPES = [
    { value: 'string', label: 'String' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'json', label: 'JSON' },
];

const CONFIG_CATEGORIES = [
    { value: '', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'email', label: 'Email' },
    { value: 'auth', label: 'Authentication' },
    { value: 'storage', label: 'Storage' },
    { value: 'payments', label: 'Payments' },
    { value: 'features', label: 'Features' },
    { value: 'translations', label: 'Translations' },
];

const ConfigurationManager = () => {
    const [activeTab, setActiveTab] = useState('settings');
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
    const [columnConfig, setColumnConfig] = useState({});
    const [selectedTableForColumns, setSelectedTableForColumns] = useState('');

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

    const settings = data || [];
    const filteredSettings = (categoryFilter ? settings.filter(s => s.category === categoryFilter) : settings)
        .filter(s => !['TRANSLATABLE_TABLES', 'TRANSLATABLE_COLUMNS'].includes(s.setting_key));

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
        } else if (configKey === 'TRANSLATABLE_COLUMNS') {
            const colConfig = typeof currentValue === 'object' && !Array.isArray(currentValue) ? currentValue : {};
            setColumnConfig(colConfig);
            // Auto-select first table if any
            const firstTable = Object.keys(colConfig)[0] || '';
            setSelectedTableForColumns(firstTable);
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

    const handleSaveJsonConfig = async () => {
        try {
            // Use the current state directly instead of parsing jsonFormData
            let valueToSave;
            if (jsonEditModal.configKey === 'TRANSLATABLE_TABLES') {
                valueToSave = selectedTables;
            } else if (jsonEditModal.configKey === 'TRANSLATABLE_COLUMNS') {
                valueToSave = columnConfig;
            } else {
                valueToSave = JSON.parse(jsonFormData);
            }

            const existingSetting = settings.find(s => s.setting_key === jsonEditModal.configKey);

            await updateSettings.mutateAsync({
                id: existingSetting?.id,
                setting_key: jsonEditModal.configKey,
                setting_value: valueToSave,
                category: 'translations',
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
        { id: 'description', title: 'Description', sortable: false, render: (value) => value || '-' },
        {
            id: 'actions', title: 'Actions', sortable: false,
            render: (_, row) => (
                <div className="data-table__actions">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(row)} title="Edit"><Edit2 size={14} /></Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteModal({ isOpen: true, config: row })} title="Delete"><Trash2 size={14} /></Button>
                </div>
            )
        }
    ];

    // JSON Config columns
    const jsonConfigColumns = [
        { id: 'label', title: 'Config Name', sortable: false },
        { id: 'description', title: 'Description', sortable: false },
        {
            id: 'count', title: 'Items', sortable: false, render: (_, row) => {
                const value = getJsonConfig(row.key);
                return <Badge variant="neutral">{Array.isArray(value) ? value.length : Object.keys(value || {}).length}</Badge>;
            }
        },
        {
            id: 'actions', title: 'Actions', sortable: false,
            render: (_, row) => (
                <div className="data-table__actions">
                    <Button variant="ghost" size="sm" onClick={() => openJsonEditModal(row.key)} title="Edit"><Edit2 size={14} /></Button>
                </div>
            )
        }
    ];

    // Options for MultiSelectDropdown
    const tableOptions = allTables.map(t => ({ value: t.table_name, label: t.label }));
    const columnOptions = tableColumns.map(c => ({ value: c, label: c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }));

    // Get translatable tables from config for column editor
    const translatableTables = getJsonConfig('TRANSLATABLE_TABLES');
    const tableOptionsForColumns = Array.isArray(translatableTables)
        ? translatableTables.map(t => ({ value: t, label: allTables.find(at => at.table_name === t)?.label || t }))
        : [];

    if (isLoading) {
        return <div className="admin-loading"><Spinner size="lg" /></div>;
    }

    return (
        <div className="admin-configuration">
            <div className="admin-header">
                <div>
                    <h1 className="admin-header__title">Configuration</h1>
                    <p className="admin-header__subtitle">Manage system settings and parameters</p>
                </div>
                <div className="admin-header__actions">
                    {activeTab === 'settings' && (
                        <Button variant="primary" onClick={openCreateModal} leftIcon={<Plus size={16} />}>Add Setting</Button>
                    )}
                    {activeTab === 'json_configs' && (
                        <Button variant="primary" onClick={() => setJsonCreateModal({ isOpen: true })} leftIcon={<Plus size={16} />}>Add JSON Config</Button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <Tabs
                defaultTab={CONFIG_TABS.findIndex(t => t.key === activeTab)}
                onChange={(index) => setActiveTab(CONFIG_TABS[index].key)}
            >
                {CONFIG_TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <TabPanel
                            key={tab.key}
                            label={
                                <>
                                    <Icon size={16} />
                                    {tab.label}
                                </>
                            }
                        >
                            {/* Tab Content */}
                            {tab.key === 'settings' && (
                                <Card variant="elevated">
                                    <div className="data-table__header admin-flex-between">
                                        <h2 className="data-table__title">{filteredSettings.length} Settings</h2>
                                        <div className="data-table__filters filter-w-180">
                                            <Select value={categoryFilter} onChange={(value) => setCategoryFilter(value)} options={CONFIG_CATEGORIES} placeholder="Category..." />
                                        </div>
                                    </div>
                                    {filteredSettings.length > 0 ? (
                                        <DataTable columns={columns} data={filteredSettings} pagination={{ enabled: filteredSettings.length > 25, pageSize: 25, align: 'right' }} showProgress={false} />
                                    ) : (
                                        <EmptyState icon={<Settings />} title="No settings found" description="Add a configuration setting" size="s" />
                                    )}
                                </Card>
                            )}

                            {tab.key === 'json_configs' && (
                                <Card variant="elevated">
                                    <div className="data-table__header">
                                        <div>
                                            <h2 className="data-table__title">JSON Configurations</h2>
                                            <p className="admin-header__subtitle">
                                                Manage complex JSON-based settings like translatable tables
                                            </p>
                                        </div>
                                    </div>
                                    <DataTable columns={jsonConfigColumns} data={JSON_CONFIG_TYPES} pagination={false} showProgress={false} />
                                </Card>
                            )}
                        </TabPanel>
                    );
                })}
            </Tabs>

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
                        <Select label="Category" value={formData.category} onChange={(value) => setFormData({ ...formData, category: value })} options={CONFIG_CATEGORIES.filter(c => c.value !== '')} fullWidth />
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

            {/* JSON Config Edit Modal - With overflow visible for dropdowns */}
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

                    {/* TRANSLATABLE_TABLES - MultiSelectDropdown */}
                    {jsonEditModal.configKey === 'TRANSLATABLE_TABLES' && (
                        <MultiSelectDropdown
                            label="Select Tables"
                            options={tableOptions}
                            selectedValues={selectedTables}
                            onChange={handleTableSelectionChange}
                            placeholder="Search tables..."
                            maxHeight={280}
                        />
                    )}

                    {/* TRANSLATABLE_COLUMNS - Table selector + MultiSelectDropdown for columns */}
                    {jsonEditModal.configKey === 'TRANSLATABLE_COLUMNS' && (
                        <div className="admin-json-layout">
                            {/* First select table from TRANSLATABLE_TABLES */}
                            <Select
                                label="Select Table"
                                value={selectedTableForColumns}
                                options={[{ value: '', label: 'Choose a table...' }, ...tableOptionsForColumns]}
                                onChange={(value) => setSelectedTableForColumns(value)}
                                fullWidth
                            />

                            {/* Then select columns for that table */}
                            {selectedTableForColumns && (
                                <MultiSelectDropdown
                                    label={`Columns for "${selectedTableForColumns}"`}
                                    options={columnOptions}
                                    selectedValues={columnConfig[selectedTableForColumns] || []}
                                    onChange={handleColumnSelectionChange}
                                    placeholder="Search columns..."
                                    maxHeight={200}
                                />
                            )}

                            {/* Show configured tables */}
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

                            {tableOptionsForColumns.length === 0 && (
                                <p className="admin-header__subtitle">
                                    Please configure Translatable Tables first, then add columns here.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Raw JSON editor (collapsible) */}
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
