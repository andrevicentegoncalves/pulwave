import { useState, useMemo } from 'react';
import { ToggleLeft, Plus, Trash2, Save } from '@pulwave/ui';
import { Button, Badge, EmptyState, Card, DataTable, Modal, ConfirmationModal, SearchInput, Input, TextArea, SectionHeader } from '@pulwave/ui';
import { ContentLayout } from '@pulwave/widgets';
import { useAdminFeatureFlags, useToggleFeatureFlag, useCreateFeatureFlag, useDeleteFeatureFlag } from '@pulwave/features-admin';

/**
 * Admin Feature Flags Manager - Complete CRUD with validation
 */
const FeatureFlagsPage = () => {
    const [editModal, setEditModal] = useState<{ isOpen: boolean; flag: any }>({ isOpen: false, flag: null });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; flag: any }>({ isOpen: false, flag: null });
    const [formData, setFormData] = useState({ key: '', name: '', description: '', is_enabled: false });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const { data, isLoading, refetch } = useAdminFeatureFlags();
    const toggleFlag = useToggleFeatureFlag();
    const createFlag = useCreateFeatureFlag();
    const deleteFlag = useDeleteFeatureFlag();

    const flags = data || [];
    const [search, setSearch] = useState('');

    const filteredFlags = useMemo(() => {
        if (!search.trim()) return flags;
        const q = search.toLowerCase();
        return flags.filter((f: any) =>
            f.key?.toLowerCase().includes(q) ||
            f.name?.toLowerCase().includes(q) ||
            f.description?.toLowerCase().includes(q)
        );
    }, [flags, search]);

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!formData.key?.trim()) {
            errors.key = 'Key is required';
        } else if (!/^[A-Z0-9_]+$/.test(formData.key)) {
            errors.key = 'Key must be uppercase alphanumeric with underscores (e.g., DARK_MODE)';
        }
        if (!formData.name?.trim()) {
            errors.name = 'Name is required';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const openCreateModal = () => {
        setFormData({ key: '', name: '', description: '', is_enabled: false });
        setFormErrors({});
        setEditModal({ isOpen: true, flag: null });
    };

    const handleToggle = async (flag: any) => {
        await toggleFlag.mutateAsync({ id: flag.id, enabled: !flag.is_enabled });
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        try {
            await createFlag.mutateAsync(formData);
            setEditModal({ isOpen: false, flag: null });
            refetch();
        } catch (err: any) {
            setFormErrors({ submit: err.message });
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.flag) return;
        try {
            await deleteFlag.mutateAsync(deleteModal.flag.id);
            setDeleteModal({ isOpen: false, flag: null });
            refetch();
        } catch {
            // Silent error handling for delete
        }
    };

    const columns = [
        { id: 'key', title: 'Key', sortable: true, render: (value: string) => <code className="bg-neutral-100 px-1 py-0.5 rounded text-sm text-primary-700">{value}</code> },
        { id: 'name', title: 'Name', sortable: true },
        { id: 'description', title: 'Description', sortable: false, render: (value: string) => value || '-' },
        { id: 'is_enabled', title: 'Status', sortable: true, render: (value: boolean) => <Badge status={value ? 'success' : 'error'} variant="light" size="s">{value ? 'Enabled' : 'Disabled'}</Badge> },
        {
            id: 'actions', title: 'Actions', sortable: false,
            render: (_: any, row: any) => (
                <div className="data-table__actions flex gap-2">
                    <Button variant="ghost" size="s" onClick={() => handleToggle(row)} disabled={toggleFlag.isPending}>{row.is_enabled ? 'Disable' : 'Enable'}</Button>
                    <Button variant="ghost" size="s" onClick={() => setDeleteModal({ isOpen: true, flag: row })} title="Delete" aria-label="Delete flag"><Trash2 size={14} aria-hidden="true" /></Button>
                </div>
            )
        }
    ];

    return (
        <ContentLayout>
            <div className="flex justify-between items-center mb-4">
                <SectionHeader title="Feature Flags" />
                <Button kind="primary" onClick={openCreateModal} leftIcon={<Plus size={16} />}>Add Flag</Button>
            </div>
            <p className="mb-4 color-muted">Toggle feature availability</p>
            <Card variant="elevated">
                <div className="p-4 border-b border-neutral-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{filteredFlags.length} Flags</h2>
                    <SearchInput value={search} onChange={(e: any) => setSearch(e.target.value)} onClear={() => setSearch('')} placeholder="Search flags…" size="s" />
                </div>
                {!isLoading && filteredFlags.length === 0 ? (
                    <EmptyState icon={<ToggleLeft />} title="No feature flags" description={search ? "No flags match your search" : "Create feature flags to control feature rollouts"} size="s" />
                ) : (
                    <DataTable columns={columns} data={filteredFlags} loading={isLoading} />
                )}
            </Card>

            <Modal isOpen={editModal.isOpen} onClose={() => setEditModal({ isOpen: false, flag: null })} title="Add Feature Flag" size="m">
                <div className="admin-edit-form flex flex-col gap-4">
                    {formErrors.submit && <div className="admin-field-error margin-bottom-3 text-error-600 bg-error-50 p-2 rounded">{formErrors.submit}</div>}
                    <div>
                        <Input label="Flag Key" value={formData.key} onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase() })} placeholder="e.g., DARK_MODE" fullWidth error={!!formErrors.key} />
                        {formErrors.key && <div className="admin-field-error text-error-600 text-sm mt-1">{formErrors.key}</div>}
                    </div>
                    <div>
                        <Input label="Display Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Dark Mode" fullWidth error={!!formErrors.name} />
                        {formErrors.name && <div className="admin-field-error text-error-600 text-sm mt-1">{formErrors.name}</div>}
                    </div>
                    <div><TextArea label="Description (optional)" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="What does this flag control?" rows={3} fullWidth /></div>
                    <div className="admin-checkbox-field flex items-center gap-2">
                        <input type="checkbox" id="is_enabled" checked={formData.is_enabled} onChange={(e) => setFormData({ ...formData, is_enabled: e.target.checked })} />
                        <label htmlFor="is_enabled">Enable immediately</label>
                    </div>
                    <div className="admin-edit-form__actions flex justify-end gap-2 mt-4">
                        <Button kind="secondary" variant="outlined" onClick={() => setEditModal({ isOpen: false, flag: null })}>Cancel</Button>
                        <Button kind="primary" onClick={handleSave} loading={createFlag.isPending} leftIcon={<Save size={16} />}>Create Flag</Button>
                    </div>
                </div>
            </Modal>

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, flag: null })}
                onConfirm={handleDelete}
                title="Delete Feature Flag"
                message={deleteModal.flag ? `Are you sure you want to delete the feature flag "${deleteModal.flag.key}"? This may affect application functionality.` : ''}
                confirmText="Delete"
                variant="danger"
                loading={deleteFlag.isPending}
            />
        </ContentLayout>
    );
};

export default FeatureFlagsPage;
