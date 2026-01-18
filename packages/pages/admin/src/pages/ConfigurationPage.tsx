import { useState, useMemo } from 'react';
import { Settings, Plus, Edit2, Trash2, Database, Layers } from '@pulwave/ui';
import { Button, Badge, EmptyState, Card, DataTable, Modal, Input, TextArea, Select, Tooltip, SearchInput, SectionHeader } from '@pulwave/ui';
import { DataTransferButton, ContentLayout } from '@pulwave/widgets';
import {
    useAdminSettings, useUpdateAdminSetting, useAdminMasterDataValues, useAdminService,
    FullTableMultiSelect, EnumMultiSelect, ColumnTreeSelect
} from '@pulwave/features-admin';

// Admin setting type
interface AdminSetting {
    id?: number | string;
    setting_key: string;
    setting_value: string | number | boolean | object | unknown[];
    category: string;
    value_type: 'string' | 'number' | 'boolean' | 'json';
    description: string;
    is_active?: boolean;
}

const CONFIG_FILTER_TYPES = [
    { value: '', label: 'All', icon: Layers },
    { value: 'setting', label: 'Settings', icon: Settings },
    { value: 'json', label: 'JSON Config', icon: Database },
];

const JSON_CONFIG_TYPES = [
    { key: 'TRANSLATABLE_COLUMNS', label: 'Translatable Columns', description: 'Map of table columns that can be translated by admins', type: 'object' },
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

const ConfigurationPage = () => {
    const service = useAdminService();
    const [filterType, setFilterType] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [editModal, setEditModal] = useState<{ isOpen: boolean; config: AdminSetting | null }>({ isOpen: false, config: null });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; config: AdminSetting | null }>({ isOpen: false, config: null });
    const [jsonEditModal, setJsonEditModal] = useState<{ isOpen: boolean; configKey: string | null; configLabel: string | null; configType: string | null }>({ isOpen: false, configKey: null, configLabel: null, configType: null });
    const [jsonCreateModal, setJsonCreateModal] = useState({ isOpen: false });
    const [formData, setFormData] = useState({ setting_key: '', setting_value: '', category: 'general', value_type: 'string', description: '' });
    const [jsonFormData, setJsonFormData] = useState('');
    const [newJsonConfig, setNewJsonConfig] = useState({ key: '', label: '', description: '', type: 'array' });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [selectedTables, setSelectedTables] = useState<string[]>([]);
    const [selectedEnums, setSelectedEnums] = useState<string[]>([]);
    const [columnConfig, setColumnConfig] = useState<Record<string, string[]>>({});
    const [userSelectedTables, setUserSelectedTables] = useState<string[]>([]);
    const [userColumnConfig, setUserColumnConfig] = useState<Record<string, string[]>>({});
    const [uiLayoutConfig, setUiLayoutConfig] = useState({ style: 'pulwave' });

    const { data: settings = [], isLoading, refetch } = useAdminSettings();
    const updateSettings = useUpdateAdminSetting();
    const { data: categories = [] } = useAdminMasterDataValues('setting_categories');

    const categoryOptions = useMemo(() => {
        const options = [{ value: '', label: 'All Categories' }];
        if (settings?.length > 0) {
            const uniqueCategories = Array.from(new Set((settings as AdminSetting[]).map(s => s.category).filter(Boolean)));
            uniqueCategories.slice().sort().forEach((cat: string) => {
                const label = cat.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                options.push({ value: cat, label });
            });
        }
        return options;
    }, [settings]);

    const [search, setSearch] = useState('');

    const filteredSettings = useMemo(() => {
        const typedSettings = settings as AdminSetting[];
        let result = categoryFilter ? typedSettings.filter(s => s.category === categoryFilter) : typedSettings;
        if (filterType === 'setting') result = result.filter(s => s.value_type !== 'json');
        else if (filterType === 'json') result = result.filter(s => s.value_type === 'json');
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(s => s.setting_key?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q));
        }
        return result;
    }, [settings, categoryFilter, filterType, search]);

    const getJsonConfig = (key: string) => {
        const setting = (settings as AdminSetting[]).find(s => s.setting_key === key);
        if (!setting) return JSON_CONFIG_TYPES.find(t => t.key === key)?.type === 'array' ? [] : {};
        let value = setting.setting_value;
        if (typeof value === 'string') { try { value = JSON.parse(value); } catch { return []; } }
        return value || (JSON_CONFIG_TYPES.find(t => t.key === key)?.type === 'array' ? [] : {});
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!formData.setting_key?.trim()) errors.setting_key = 'Key is required';
        else if (!/^[A-Z0-9_]+$/.test(formData.setting_key)) errors.setting_key = 'Key must be UPPERCASE_WITH_UNDERSCORES';
        if (!String(formData.setting_value).trim() && formData.value_type !== 'boolean') errors.setting_value = 'Value is required';
        if (formData.value_type === 'json') { try { JSON.parse(formData.setting_value); } catch { errors.setting_value = 'Invalid JSON'; } }
        if (formData.value_type === 'number' && isNaN(Number(formData.setting_value))) errors.setting_value = 'Must be a valid number';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const openEditModal = (config: AdminSetting) => {
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
            let finalValue: string | number | boolean | object | unknown[] = formData.setting_value;
            if (formData.value_type === 'json') finalValue = JSON.parse(formData.setting_value);
            if (formData.value_type === 'number') finalValue = Number(formData.setting_value);
            if (formData.value_type === 'boolean') finalValue = formData.setting_value === 'true';
            await updateSettings.mutateAsync({ id: editModal.config?.id, setting_key: formData.setting_key, setting_value: finalValue, category: formData.category, value_type: formData.value_type, description: formData.description });
            setEditModal({ isOpen: false, config: null });
            refetch();
        } catch (err) {
            const error = err as Error;
            setFormErrors({ submit: error.message });
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.config) return;
        await updateSettings.mutateAsync({ id: deleteModal.config.id, is_active: false });
        setDeleteModal({ isOpen: false, config: null });
        refetch();
    };

    const openJsonEditModal = (configKey: string) => {
        const configType = JSON_CONFIG_TYPES.find(t => t.key === configKey);
        const currentValue = getJsonConfig(configKey);
        if (configKey === 'TRANSLATABLE_TABLES') setSelectedTables(Array.isArray(currentValue) ? currentValue : []);
        else if (configKey === 'TRANSLATABLE_ENUMS') setSelectedEnums(Array.isArray(currentValue) ? currentValue : []);
        else if (configKey === 'TRANSLATABLE_COLUMNS') { const colConfig = typeof currentValue === 'object' && !Array.isArray(currentValue) ? currentValue : {}; setColumnConfig(colConfig as Record<string, string[]>); }
        else if (configKey === 'USER_TRANSLATABLE_TABLES') setUserSelectedTables(Array.isArray(currentValue) ? currentValue : []);
        else if (configKey === 'USER_TRANSLATABLE_COLUMNS') { const colConfig = typeof currentValue === 'object' && !Array.isArray(currentValue) ? currentValue : {}; setUserColumnConfig(colConfig as Record<string, string[]>); }
        else if (configKey === 'UI_LAYOUT') setUiLayoutConfig(typeof currentValue === 'object' && !Array.isArray(currentValue) ? currentValue : { style: 'pulwave' });
        setJsonFormData(JSON.stringify(currentValue, null, 2));
        setJsonEditModal({ isOpen: true, configKey, configLabel: configType?.label || configKey, configType: configType?.type || null });
        setFormErrors({});
    };

    const handleSaveJsonConfig = async () => {
        if (!jsonEditModal.configKey) return;
        try {
            let valueToSave;
            if (jsonEditModal.configKey === 'TRANSLATABLE_TABLES') valueToSave = selectedTables;
            else if (jsonEditModal.configKey === 'TRANSLATABLE_ENUMS') valueToSave = selectedEnums;
            else if (jsonEditModal.configKey === 'TRANSLATABLE_COLUMNS') valueToSave = columnConfig;
            else if (jsonEditModal.configKey === 'USER_TRANSLATABLE_TABLES') valueToSave = userSelectedTables;
            else if (jsonEditModal.configKey === 'USER_TRANSLATABLE_COLUMNS') valueToSave = userColumnConfig;
            else if (jsonEditModal.configKey === 'UI_LAYOUT') valueToSave = uiLayoutConfig;
            else valueToSave = JSON.parse(jsonFormData);
            const existingSetting = (settings as AdminSetting[]).find(s => s.setting_key === jsonEditModal.configKey);
            await updateSettings.mutateAsync({ id: existingSetting?.id, setting_key: jsonEditModal.configKey, setting_value: valueToSave, category: jsonEditModal.configKey === 'UI_LAYOUT' ? 'appearance' : 'translations', value_type: 'json', description: JSON_CONFIG_TYPES.find(t => t.key === jsonEditModal.configKey)?.description || '' });
            setJsonEditModal({ isOpen: false, configKey: null, configLabel: null, configType: null });
            refetch();
        } catch (err) {
            const error = err as Error;
            setFormErrors({ json: 'Error saving: ' + error.message });
        }
    };

    const handleCreateJsonConfig = async () => {
        if (!newJsonConfig.key.trim()) { setFormErrors({ newKey: 'Key is required' }); return; }
        try {
            const initialValue = newJsonConfig.type === 'array' ? [] : {};
            await updateSettings.mutateAsync({ setting_key: newJsonConfig.key.toUpperCase().replace(/\s+/g, '_'), setting_value: initialValue, category: 'translations', value_type: 'json', description: newJsonConfig.description || '' });
            setJsonCreateModal({ isOpen: false });
            setNewJsonConfig({ key: '', label: '', description: '', type: 'array' });
            refetch();
        } catch (err) {
            const error = err as Error;
            setFormErrors({ newKey: error.message });
        }
    };

    const getCategoryBadgeType = (category: string): "neutral" | "primary" | "success" | "warning" | "info" | "error" => {
        const types: Record<string, "neutral" | "primary" | "success" | "warning" | "info" | "error"> = { general: 'neutral', email: 'info', auth: 'warning', storage: 'success', payments: 'error', features: 'info', translations: 'info' };
        return types[category] || 'neutral';
    };

    const formatSettingName = (key: string | number | boolean | null | undefined) => {
        if (!key) return '';
        const keyStr = String(key);
        return keyStr.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    const jsonConfigColumns = [
        { id: 'setting_key', title: 'Name', sortable: true, render: (value: string) => <Tooltip content={value} direction="top"><span className="cursor-help">{formatSettingName(value)}</span></Tooltip> },
        { id: 'setting_value', title: 'Value', sortable: false, render: (value: string | Record<string, unknown> | unknown[]) => { try { const parsed = typeof value === 'string' ? JSON.parse(value) : value; if (!parsed || typeof parsed !== 'object') return null; if (Array.isArray(parsed)) return <div className="flex flex-wrap gap-1 max-h-20 overflow-hidden">{parsed.slice(0, 5).map((item: unknown) => <Badge key={String(item)} status="neutral" variant="light" size="s">{String(item)}</Badge>)}{parsed.length > 5 && <Badge status="neutral" variant="light" size="s">+{parsed.length - 5} more</Badge>}</div>; const keys = Object.keys(parsed); return <div className="flex flex-wrap gap-1 max-h-20 overflow-hidden">{keys.slice(0, 3).map((key: string) => <Badge key={key} status="info" variant="light" size="s">{key} ({Array.isArray((parsed as Record<string, unknown>)[key]) ? ((parsed as Record<string, unknown>)[key] as unknown[]).length : 0})</Badge>)}{keys.length > 3 && <Badge status="neutral" variant="light" size="s">+{keys.length - 3} more</Badge>}</div>; } catch { return <span>Invalid JSON</span>; } } },
        { id: 'category', title: 'Category', sortable: true, render: (value: string) => <Badge status={getCategoryBadgeType(value)} variant="light" size="s">{value}</Badge> },
        { id: 'actions', title: 'Actions', sortable: false, render: (_: unknown, row: AdminSetting) => <div className="data-table__actions flex gap-2"><Button variant="ghost" size="s" onClick={() => openJsonEditModal(row.setting_key)} title="Edit" aria-label="Edit"><Edit2 size={14} aria-hidden="true" /></Button><Button variant="ghost" size="s" onClick={() => setDeleteModal({ isOpen: true, config: row })} title="Delete" aria-label="Delete"><Trash2 size={14} aria-hidden="true" /></Button></div> }
    ];

    const settingColumns = [
        { id: 'setting_key', title: 'Name', sortable: true, render: (value: string) => <Tooltip content={value} direction="top"><span className="cursor-help">{formatSettingName(value)}</span></Tooltip> },
        { id: 'setting_value', title: 'Value', sortable: false, render: (value: string | number | boolean | object | unknown[]) => <code className="block truncate max-w-xs">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</code> },
        { id: 'category', title: 'Category', sortable: true, render: (value: string | { name?: string; category?: string }) => { const str = typeof value === 'string' ? value : (value?.name || value?.category || ''); return <Badge status={getCategoryBadgeType(str)} variant="light" size="s">{str || '—'}</Badge>; } },
        { id: 'actions', title: 'Actions', sortable: false, render: (_: unknown, row: AdminSetting) => <div className="data-table__actions flex gap-2"><Button variant="ghost" size="s" onClick={() => openEditModal(row)} title="Edit" aria-label="Edit"><Edit2 size={14} aria-hidden="true" /></Button><Button variant="ghost" size="s" onClick={() => setDeleteModal({ isOpen: true, config: row })} title="Delete" aria-label="Delete"><Trash2 size={14} aria-hidden="true" /></Button></div> }
    ];

    return (
        <ContentLayout>
            <div className="flex justify-between items-center mb-4">
                <SectionHeader title="Configuration" />
                <div className="flex gap-2">
                    <DataTransferButton entityName="Configurations" data={filteredSettings} />
                    {filterType !== 'json' && <Button kind="primary" onClick={() => { setFormData({ setting_key: '', setting_value: '', category: 'general', value_type: 'string', description: '' }); setFormErrors({}); setEditModal({ isOpen: true, config: null }); }} leftIcon={<Plus size={16} />}>Add Setting</Button>}
                    {(filterType === 'json' || filterType === '') && <Button kind={filterType === '' ? 'neutral' : 'primary'} onClick={() => setJsonCreateModal({ isOpen: true })} leftIcon={<Plus size={16} />}>Add JSON Config</Button>}
                </div>
            </div>
            <div className="mb-6">
                <div className="flex gap-2 mb-4 overflow-x-auto">
                    {CONFIG_FILTER_TYPES.map(t => { const Icon = t.icon; return <Button key={t.value} kind={filterType === t.value ? 'primary' : 'neutral'} size="s" onClick={() => setFilterType(t.value)} leftIcon={<Icon size={14} />} className={filterType !== t.value ? 'bg-white border-neutral-200' : ''}>{t.label}</Button>; })}
                </div>
                <div className="w-48"><Select value={categoryFilter} onChange={(value) => setCategoryFilter(value)} options={categoryOptions} placeholder="Category…" size="s" /></div>
            </div>

            <Card variant="elevated">
                <div className="p-4 border-b border-neutral-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{filteredSettings.length} {filterType === 'json' ? 'JSON Configurations' : filterType === 'setting' ? 'Settings' : 'Configurations'}</h2>
                    <SearchInput value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} onClear={() => setSearch('')} placeholder="Search configurations…" size="s" />
                </div>
                {!isLoading && filteredSettings.length === 0 ? (
                    <EmptyState icon={filterType === 'json' ? <Database /> : <Settings />} title={filterType === 'json' ? 'No JSON configurations found' : 'No settings found'} description="Add a configuration setting" size="s" />
                ) : (
                    <DataTable columns={filterType === 'json' ? jsonConfigColumns : settingColumns} data={filteredSettings} loading={isLoading} />
                )}
            </Card>

            {/* Settings Edit Modal */}
            <Modal isOpen={editModal.isOpen} onClose={() => setEditModal({ isOpen: false, config: null })} title={editModal.config ? 'Edit Setting' : 'Add Setting'} size="m">
                <div className="flex flex-col gap-4">
                    {formErrors.submit && <div className="text-error-600 bg-error-50 p-2 rounded">{formErrors.submit}</div>}
                    <div><Input label="Setting Key" value={formData.setting_key} onChange={(e) => setFormData({ ...formData, setting_key: e.target.value.toUpperCase() })} placeholder="e.g., MAX_UPLOAD_SIZE" disabled={!!editModal.config} fullWidth error={!!formErrors.setting_key} />{formErrors.setting_key && <div className="text-error-600 text-sm mt-1">{formErrors.setting_key}</div>}</div>
                    <div><Select label="Value Type" value={formData.value_type} onChange={(value) => setFormData({ ...formData, value_type: value })} options={CONFIG_TYPES} fullWidth /></div>
                    <div>{formData.value_type === 'boolean' ? <Select label="Value" value={formData.setting_value} onChange={(value) => setFormData({ ...formData, setting_value: value })} options={[{ value: 'true', label: 'True' }, { value: 'false', label: 'False' }]} fullWidth /> : formData.value_type === 'json' ? <TextArea label="JSON Value" value={formData.setting_value} onChange={(e) => setFormData({ ...formData, setting_value: e.target.value })} rows={5} fullWidth error={!!formErrors.setting_value} /> : <Input label="Value" value={formData.setting_value} onChange={(e) => setFormData({ ...formData, setting_value: e.target.value })} fullWidth error={!!formErrors.setting_value} />}{formErrors.setting_value && <div className="text-error-600 text-sm mt-1">{formErrors.setting_value}</div>}</div>
                    <div className="flex justify-end gap-2 mt-4"><Button kind="secondary" variant="outlined" onClick={() => setEditModal({ isOpen: false, config: null })}>Cancel</Button><Button kind="primary" onClick={handleSave} loading={updateSettings.isPending}>Save</Button></div>
                </div>
            </Modal>

            {/* JSON Edit Modal */}
            <Modal isOpen={jsonEditModal.isOpen} onClose={() => setJsonEditModal({ ...jsonEditModal, isOpen: false })} title={`Edit ${jsonEditModal.configLabel}`} size="l">
                <div className="flex flex-col gap-4">
                    {jsonEditModal.configKey === 'TRANSLATABLE_TABLES' && <FullTableMultiSelect selectedValues={selectedTables} schemaService={service} onChange={(newTables: string[]) => setSelectedTables(newTables)} label="Select Tables" placeholder="Search tables…" />}
                    {jsonEditModal.configKey === 'USER_TRANSLATABLE_TABLES' && <FullTableMultiSelect selectedValues={userSelectedTables} schemaService={service} onChange={(newTables: string[]) => setUserSelectedTables(newTables)} label="Select User Translatable Tables" placeholder="Search tables…" />}
                    {jsonEditModal.configKey === 'TRANSLATABLE_ENUMS' && <EnumMultiSelect selectedValues={selectedEnums} adminService={service} onChange={(newEnums: string[]) => setSelectedEnums(newEnums)} label="Select Enums" placeholder="Search enums…" />}
                    {jsonEditModal.configKey === 'TRANSLATABLE_COLUMNS' && <div className="space-y-4"><p className="text-sm text-neutral-600 mb-2">Configure which columns are translatable for each table.</p><div className="flex gap-2 my-3"><Button kind="secondary" variant="outlined" size="s" onClick={async () => { try { const data = await service.getCommonTranslatableColumns(); if (!data || data.length === 0) { return; } const grouped: Record<string, string[]> = {}; data.forEach((row: { table_name: string; column_name: string }) => { if (!grouped[row.table_name]) grouped[row.table_name] = []; grouped[row.table_name].push(row.column_name); }); setColumnConfig(grouped); } catch { /* silently fail */ } }} leftIcon={<Database size={14} />}>Auto-fill common columns</Button></div><ColumnTreeSelect value={columnConfig} onChange={(newConfig: Record<string, string[]>) => setColumnConfig(newConfig)} showTextColumns adminService={service} /></div>}
                    {jsonEditModal.configKey === 'USER_TRANSLATABLE_COLUMNS' && <div className="space-y-4"><p className="text-sm text-neutral-600 mb-2">Configure which columns users can translate.</p><FullTableMultiSelect selectedValues={Object.keys(userColumnConfig)} schemaService={service} onChange={(tables: string[]) => { const updated: Record<string, string[]> = {}; tables.forEach(t => { updated[t] = userColumnConfig[t] || []; }); setUserColumnConfig(updated); }} label="Select Tables" placeholder="Search tables…" /></div>}
                    {!['TRANSLATABLE_TABLES', 'TRANSLATABLE_ENUMS', 'TRANSLATABLE_COLUMNS', 'USER_TRANSLATABLE_TABLES', 'USER_TRANSLATABLE_COLUMNS', 'UI_LAYOUT'].includes(jsonEditModal.configKey || '') && <TextArea label="JSON Configuration" value={jsonFormData} onChange={(e) => setJsonFormData(e.target.value)} rows={10} fullWidth />}
                    <div className="flex justify-end gap-2 mt-4"><Button kind="secondary" variant="outlined" onClick={() => setJsonEditModal({ ...jsonEditModal, isOpen: false })}>Cancel</Button><Button kind="primary" onClick={handleSaveJsonConfig} loading={updateSettings.isPending}>Save Configuration</Button></div>
                </div>
            </Modal>

            {/* Create JSON Config Modal */}
            <Modal isOpen={jsonCreateModal.isOpen} onClose={() => setJsonCreateModal({ isOpen: false })} title="Add JSON Configuration" size="m">
                <div className="flex flex-col gap-4">
                    {formErrors.newKey && <div className="text-error-600 bg-error-50 p-2 rounded">{formErrors.newKey}</div>}
                    <Input label="Config Key" value={newJsonConfig.key} onChange={(e) => setNewJsonConfig({ ...newJsonConfig, key: e.target.value.toUpperCase() })} placeholder="e.g., NEW_CONFIG" fullWidth error={!!formErrors.newKey} />
                    <Input label="Description" value={newJsonConfig.description} onChange={(e) => setNewJsonConfig({ ...newJsonConfig, description: e.target.value })} fullWidth />
                    <Select label="Type" value={newJsonConfig.type} onChange={(value) => setNewJsonConfig({ ...newJsonConfig, type: value })} options={[{ value: 'array', label: 'Array' }, { value: 'object', label: 'Object' }]} fullWidth />
                    <div className="flex justify-end gap-2 mt-4"><Button kind="secondary" variant="outlined" onClick={() => setJsonCreateModal({ isOpen: false })}>Cancel</Button><Button kind="primary" onClick={handleCreateJsonConfig} loading={updateSettings.isPending}>Create</Button></div>
                </div>
            </Modal>
        </ContentLayout>
    );
};

export default ConfigurationPage;
