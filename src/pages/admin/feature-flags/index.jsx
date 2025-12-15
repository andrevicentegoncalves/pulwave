import React, { useState } from 'react';
import { ToggleLeft, Plus, Trash2, Save } from '../../../components/ui';
import { AdminPageHeader, AdminLoadingState } from '../../../components/admin';
import { useAdminFeatureFlags, useToggleFeatureFlag, useCreateFeatureFlag, useDeleteFeatureFlag } from '../../../hooks/admin';
import { Button, Badge, EmptyState, Card, DataTable, Modal, ConfirmationModal } from '../../../components/ui';
import { Input, TextArea } from '../../../components/ui';

/**
 * Admin Feature Flags Manager - Complete CRUD with validation
 */
const FeatureFlagsManager = () => {
    // Modal state
    const [editModal, setEditModal] = useState({ isOpen: false, flag: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, flag: null });
    const [formData, setFormData] = useState({ key: '', name: '', description: '', is_enabled: false });
    const [formErrors, setFormErrors] = useState({});

    // Hooks
    const { data, isLoading, refetch } = useAdminFeatureFlags();
    const toggleFlag = useToggleFeatureFlag();
    const createFlag = useCreateFeatureFlag();
    const deleteFlag = useDeleteFeatureFlag();

    const flags = data || [];

    // Validation
    const validateForm = () => {
        const errors = {};
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

    // Open create modal
    const openCreateModal = () => {
        setFormData({ key: '', name: '', description: '', is_enabled: false });
        setFormErrors({});
        setEditModal({ isOpen: true, flag: null });
    };

    // Handle toggle
    const handleToggle = async (flag) => {
        await toggleFlag.mutateAsync({ id: flag.id, enabled: !flag.is_enabled });
    };

    // Save flag
    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            await createFlag.mutateAsync(formData);
            setEditModal({ isOpen: false, flag: null });
            refetch();
        } catch (err) {
            setFormErrors({ submit: err.message });
        }
    };

    // Open delete modal
    const openDeleteModal = (flag) => {
        setDeleteModal({ isOpen: true, flag });
    };

    // Delete flag
    const handleDelete = async () => {
        if (!deleteModal.flag) return;

        try {
            await deleteFlag.mutateAsync(deleteModal.flag.id);
            setDeleteModal({ isOpen: false, flag: null });
            refetch();
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    // DataTable columns
    const columns = [
        {
            id: 'key',
            title: 'Key',
            sortable: true,
            render: (value) => <code>{value}</code>
        },
        {
            id: 'name',
            title: 'Name',
            sortable: true,
        },
        {
            id: 'description',
            title: 'Description',
            sortable: false,
            render: (value) => value || '-'
        },
        {
            id: 'is_enabled',
            title: 'Status',
            sortable: true,
            render: (value) => (
                <Badge type={value ? 'success' : 'error'} variant="light" size="s">
                    {value ? 'Enabled' : 'Disabled'}
                </Badge>
            )
        },
        {
            id: 'actions',
            title: 'Actions',
            sortable: false,
            render: (_, row) => (
                <div className="data-table__actions">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggle(row)}
                        disabled={toggleFlag.isPending}
                    >
                        {row.is_enabled ? 'Disable' : 'Enable'}
                    </Button>
                    <Button variant="icon-circle" size="s" onClick={() => openDeleteModal(row)} title="Delete">
                        <Trash2 size={14} />
                    </Button>
                </div>
            )
        }
    ];

    if (isLoading) {
        return <AdminLoadingState />;
    }

    return (
        <div className="admin-feature-flags">
            <AdminPageHeader
                title="Feature Flags"
                subtitle="Toggle feature availability"
                actions={
                    <Button variant="primary" onClick={openCreateModal} leftIcon={<Plus size={16} />}>
                        Add Flag
                    </Button>
                }
            />

            <Card variant="elevated">
                {flags.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={flags}
                        pagination={false}
                    />
                ) : (
                    <EmptyState
                        icon={<ToggleLeft />}
                        title="No feature flags"
                        description="Create feature flags to control feature rollouts"
                        size="s"
                    />
                )}
            </Card>

            {/* Create Flag Modal */}
            <Modal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, flag: null })}
                title="Add Feature Flag"
                size="m"
            >
                <div className="admin-edit-form">
                    {formErrors.submit && (
                        <div className="admin-field-error mb-3">
                            {formErrors.submit}
                        </div>
                    )}

                    <div>
                        <Input
                            label="Flag Key"
                            value={formData.key}
                            onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase() })}
                            placeholder="e.g., DARK_MODE"
                            fullWidth
                            error={!!formErrors.key}
                        />
                        {formErrors.key && (
                            <div className="admin-field-error">{formErrors.key}</div>
                        )}
                    </div>

                    <div>
                        <Input
                            label="Display Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Dark Mode"
                            fullWidth
                            error={!!formErrors.name}
                        />
                        {formErrors.name && (
                            <div className="admin-field-error">{formErrors.name}</div>
                        )}
                    </div>

                    <div>
                        <TextArea
                            label="Description (optional)"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="What does this flag control?"
                            rows={3}
                            fullWidth
                        />
                    </div>

                    <div className="admin-checkbox-field">
                        <input
                            type="checkbox"
                            id="is_enabled"
                            checked={formData.is_enabled}
                            onChange={(e) => setFormData({ ...formData, is_enabled: e.target.checked })}
                        />
                        <label htmlFor="is_enabled">Enable immediately</label>
                    </div>

                    <div className="admin-edit-form__actions">
                        <Button variant="secondary" onClick={() => setEditModal({ isOpen: false, flag: null })}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            loading={createFlag.isPending}
                            leftIcon={<Save size={16} />}
                        >
                            Create Flag
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, flag: null })}
                onConfirm={handleDelete}
                title="Delete Feature Flag"
                message={deleteModal.flag ? (
                    `Are you sure you want to delete the feature flag "${deleteModal.flag.key}"? This may affect application functionality.`
                ) : ''}
                confirmText="Delete"
                variant="danger"
                loading={deleteFlag.isPending}
            />
        </div>
    );
};

export default FeatureFlagsManager;
