import React, { useState } from 'react';
import { Button, Select, Badge, EmptyState, Card, SearchInput, Pagination, DataTable, ConfirmationModal, Modal, UserX, Edit2, Input } from '../../../components/ui';
import { AdminPageHeader, AdminLoadingState } from '../../../components/admin';
import { useAdminUsers, useUpdateAdminUser } from '../../../hooks/admin';

/**
 * Admin Users List - User management page
 * Uses DataTable, ConfirmationModal for CRUD operations
 */
const UsersList = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const limit = 20;

    // Modal state
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, user: null, action: null });
    const [editModal, setEditModal] = useState({ isOpen: false, user: null });
    const [editForm, setEditForm] = useState({ first_name: '', last_name: '', app_role: '' });

    const { data, isLoading, error } = useAdminUsers({ page, limit, search, role: roleFilter });
    const updateUser = useUpdateAdminUser();

    const users = data?.data || [];
    const totalCount = data?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleClearSearch = () => {
        setSearch('');
        setPage(1);
    };

    const handleRoleChange = (e) => {
        setRoleFilter(e.target.value);
        setPage(1);
    };

    // Open confirm modal for suspend/activate
    const openConfirmModal = (user, action) => {
        setConfirmModal({ isOpen: true, user, action });
    };

    // Handle suspend/activate confirmation
    const handleConfirmAction = async () => {
        const { user, action } = confirmModal;
        if (!user) return;

        await updateUser.mutateAsync({
            id: user.id,
            updates: { is_suspended: action === 'suspend' },
        });
        setConfirmModal({ isOpen: false, user: null, action: null });
    };

    // Open edit modal
    const openEditModal = (user) => {
        setEditForm({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            app_role: user.app_role || 'user',
        });
        setEditModal({ isOpen: true, user });
    };

    // Handle edit save
    const handleEditSave = async () => {
        if (!editModal.user) return;
        await updateUser.mutateAsync({
            id: editModal.user.id,
            updates: editForm,
        });
        setEditModal({ isOpen: false, user: null });
    };

    const roleOptions = [
        { value: '', label: 'All Roles' },
        { value: 'super_admin', label: 'Super Admin' },
        { value: 'admin', label: 'Admin' },
        { value: 'support', label: 'Support' },
        { value: 'user', label: 'User' },
    ];

    const roleSelectOptions = [
        { value: 'super_admin', label: 'Super Admin' },
        { value: 'admin', label: 'Admin' },
        { value: 'support', label: 'Support' },
        { value: 'user', label: 'User' },
    ];

    // Map app_role to Badge type
    const getRoleBadgeType = (role) => {
        switch (role) {
            case 'super_admin': return 'info';
            case 'admin': return 'warning';
            case 'support': return 'neutral';
            default: return 'neutral';
        }
    };

    // DataTable columns
    const columns = [
        {
            id: 'name',
            title: 'User',
            sortable: true,
            render: (_, row) => (
                <>
                    <strong>{row.first_name} {row.last_name}</strong>
                    {row.username && <span> (@{row.username})</span>}
                </>
            )
        },
        {
            id: 'email',
            title: 'Email',
            sortable: true,
        },
        {
            id: 'app_role',
            title: 'Role',
            sortable: true,
            render: (value) => (
                <Badge type={getRoleBadgeType(value)} variant="light" size="s">
                    {value?.replace('_', ' ')}
                </Badge>
            )
        },
        {
            id: 'is_suspended',
            title: 'Status',
            sortable: true,
            render: (value) => (
                <Badge type={value ? 'error' : 'success'} variant="light" size="s">
                    {value ? 'Suspended' : 'Active'}
                </Badge>
            )
        },
        {
            id: 'created_at',
            title: 'Created',
            sortable: true,
            render: (value) => new Date(value).toLocaleDateString()
        },
        {
            id: 'actions',
            title: 'Actions',
            sortable: false,
            render: (_, row) => (
                <div className="data-table__actions">
                    <Button
                        variant="icon-circle"
                        size="s"
                        onClick={() => openEditModal(row)}
                    >
                        <Edit2 size={14} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openConfirmModal(row, row.is_suspended ? 'activate' : 'suspend')}
                        disabled={updateUser.isPending}
                    >
                        {row.is_suspended ? 'Activate' : 'Suspend'}
                    </Button>
                </div>
            )
        }
    ];

    if (isLoading) {
        return <AdminLoadingState />;
    }

    if (error) {
        return (
            <EmptyState
                icon={<UserX />}
                title="Error loading users"
                description={error.message}
                variant="card"
            />
        );
    }

    return (
        <div className="admin-users">
            <AdminPageHeader title="Users" subtitle="Manage user accounts and roles" />
            <Card variant="elevated" className="admin-users-card">
                <div className="data-table__header">
                    <h2 className="data-table__title">{totalCount} Users</h2>
                    <div className="data-table__filters flex flex-row items-center gap-3">
                        <SearchInput
                            value={search}
                            onChange={handleSearch}
                            onClear={handleClearSearch}
                            placeholder="Search users..."
                            size="sm"
                        />
                        <Select
                            value={roleFilter}
                            onChange={handleRoleChange}
                            options={roleOptions}
                            size="sm"
                        />
                    </div>
                </div>

                {users.length > 0 ? (
                    <>
                        <DataTable
                            columns={columns}
                            data={users}
                            pagination={false}
                        />

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="data-table__pagination">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                    showInfo
                                    totalItems={totalCount}
                                    itemsPerPage={limit}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <EmptyState
                        icon={<UserX />}
                        title="No users found"
                        description={search ? 'Try a different search term' : 'No users match the current filter'}
                        size="s"
                    />
                )}
            </Card>

            {/* Confirmation Modal for Suspend/Activate */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, user: null, action: null })}
                onConfirm={handleConfirmAction}
                title={confirmModal.action === 'suspend' ? 'Suspend User' : 'Activate User'}
                message={confirmModal.user ? (
                    confirmModal.action === 'suspend'
                        ? `Are you sure you want to suspend ${confirmModal.user.first_name} ${confirmModal.user.last_name}? They will no longer be able to access the system.`
                        : `Are you sure you want to activate ${confirmModal.user.first_name} ${confirmModal.user.last_name}? They will regain access to the system.`
                ) : ''}
                confirmText={confirmModal.action === 'suspend' ? 'Suspend' : 'Activate'}
                variant={confirmModal.action === 'suspend' ? 'danger' : 'info'}
                loading={updateUser.isPending}
            />

            {/* Edit User Modal */}
            <Modal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, user: null })}
                title="Edit User"
                size="m"
            >
                <div className="admin-edit-form">
                    <Input
                        label="First Name"
                        value={editForm.first_name}
                        onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                        fullWidth
                    />
                    <Input
                        label="Last Name"
                        value={editForm.last_name}
                        onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                        fullWidth
                    />
                    <Select
                        label="Role"
                        value={editForm.app_role}
                        onChange={(e) => setEditForm({ ...editForm, app_role: e.target.value })}
                        options={roleSelectOptions}
                        fullWidth
                    />
                    <div className="admin-edit-form__actions">
                        <Button variant="secondary" onClick={() => setEditModal({ isOpen: false, user: null })}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleEditSave} loading={updateUser.isPending}>
                            Save Changes
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UsersList;
