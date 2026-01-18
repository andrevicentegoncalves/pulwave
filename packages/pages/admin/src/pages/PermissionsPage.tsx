import { useState, useMemo } from 'react';
import { Shield, Key, Users } from '@pulwave/ui';
import { Badge, EmptyState, Card, DataTable, SearchInput, Select, SectionHeader } from '@pulwave/ui';
import { DataTransferButton, ContentLayout } from '@pulwave/widgets';
import { useAllPermissions, useRolePermissions, useAdminAllUserPermissions } from '@pulwave/features-admin';

// Type definitions
interface Permission {
    id?: string | number;
    permission_name: string;
    description?: string;
    permission_category?: string;
    is_active?: boolean;
}

interface RolePermission {
    id?: string | number;
    role_type?: string;
    role_value?: string;
    permissions?: Permission;
    granted_at?: string;
}

interface UserPermission {
    id?: string | number;
    profiles?: {
        email?: string;
        first_name?: string;
        last_name?: string;
    };
    permissions?: Permission;
    reason?: string;
    granted_at?: string;
    expires_at?: string;
}

// Group by utility
const groupBy = <T, K extends PropertyKey>(list: T[], getKey: (item: T) => K) =>
    list.reduce((previous, currentItem) => {
        const group = getKey(currentItem);
        if (!previous[group]) previous[group] = [];
        previous[group].push(currentItem);
        return previous;
    }, {} as Record<K, T[]>);

const PermissionsPage = () => {
    const { data: permissions = [], isLoading: loadingPermissions } = useAllPermissions();
    const { data: rolePermissions = [], isLoading: loadingRolePerms } = useRolePermissions();
    const { data: userPermissions = [], isLoading: loadingUserPerms } = useAdminAllUserPermissions();

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const isLoading = loadingPermissions || loadingRolePerms || loadingUserPerms;

    const typeOptions = [
        { value: '', label: 'All Permissions' },
        { value: 'role', label: 'Role Permissions' },
        { value: 'user', label: 'User Permissions' },
    ];

    const filteredPermissions = useMemo(() => {
        const typedPermissions = permissions as Permission[];
        if (!search.trim()) return typedPermissions;
        const q = search.toLowerCase();
        return typedPermissions.filter((p: Permission) =>
            p.permission_name?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.permission_category?.toLowerCase().includes(q)
        );
    }, [permissions, search]);

    const filteredRolePerms = useMemo(() => {
        const typedRolePerms = rolePermissions as RolePermission[];
        if (!search.trim()) return typedRolePerms;
        const q = search.toLowerCase();
        return typedRolePerms.filter((rp: RolePermission) =>
            rp.permissions?.permission_name?.toLowerCase().includes(q) ||
            rp.role_value?.toLowerCase().includes(q)
        );
    }, [rolePermissions, search]);

    const filteredUserPerms = useMemo(() => {
        const typedUserPerms = userPermissions as UserPermission[];
        if (!search.trim()) return typedUserPerms;
        const q = search.toLowerCase();
        return typedUserPerms.filter((up: UserPermission) =>
            up.permissions?.permission_name?.toLowerCase().includes(q) ||
            up.profiles?.email?.toLowerCase().includes(q) ||
            up.profiles?.first_name?.toLowerCase().includes(q)
        );
    }, [userPermissions, search]);

    const groupedPermissions = groupBy(filteredPermissions, (p: Permission) => p.permission_category || 'Other');
    const groupedRolePerms = groupBy(filteredRolePerms, (rp: RolePermission) => `${rp.role_type}:${rp.role_value}`);

    const permissionColumns = [
        { id: 'permission_name', title: 'Permission', sortable: true, render: (value: string) => <code>{value}</code> },
        { id: 'description', title: 'Description', sortable: false, render: (value: string) => value || '-' },
        { id: 'is_active', title: 'Status', sortable: true, render: (value: boolean) => <Badge status={value ? 'success' : 'error'} variant="light" size="s">{value ? 'Active' : 'Inactive'}</Badge> }
    ];

    const rolePermColumns = [
        { id: 'permissions', title: 'Permission', render: (value: Permission | undefined) => <code>{value?.permission_name}</code> },
        { id: 'permissions.description', title: 'Description', render: (_: unknown, row: RolePermission) => row.permissions?.description || '-' },
        { id: 'granted_at', title: 'Granted', render: (value: string) => value ? new Date(value).toLocaleDateString() : '-' }
    ];

    const userPermColumns = [
        { id: 'profiles', title: 'User', render: (value: UserPermission['profiles']) => value ? `${value.first_name || ''} ${value.last_name || ''} (${value.email})` : '-' },
        { id: 'permissions', title: 'Permission', render: (value: Permission | undefined) => <code>{value?.permission_name}</code> },
        { id: 'reason', title: 'Reason', render: (value: string) => value || '-' },
        { id: 'granted_at', title: 'Granted', render: (value: string) => value ? new Date(value).toLocaleDateString() : '-' },
        { id: 'expires_at', title: 'Expires', render: (value: string) => value ? new Date(value).toLocaleDateString() : 'Never' }
    ];

    const getTotalCount = () => {
        if (typeFilter === 'role') return filteredRolePerms.length;
        if (typeFilter === 'user') return filteredUserPerms.length;
        return filteredPermissions.length;
    };

    const getExportData = () => {
        if (typeFilter === 'role') return filteredRolePerms;
        if (typeFilter === 'user') return filteredUserPerms;
        return filteredPermissions;
    };

    const showBasePermissions = typeFilter === '' || typeFilter === 'role';
    const showRolePermissions = typeFilter === '' || typeFilter === 'role';
    const showUserPermissions = typeFilter === '' || typeFilter === 'user';

    return (
        <ContentLayout>
            <SectionHeader title="Permissions" />
            <p className="mb-4 color-muted">View and manage system permissions</p>

            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{getTotalCount()} Permissions</h2>
                    <div className="flex items-center gap-3">
                        <SearchInput value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} onClear={() => setSearch('')} placeholder="Search permissions…" size="s" />
                        <Select value={typeFilter} onChange={(value) => setTypeFilter(value)} options={typeOptions} size="s" />
                        <DataTransferButton entityName="Permissions" data={getExportData()} supportedFormats={['json', 'csv']} />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <Card variant="elevated"><DataTable columns={permissionColumns} data={[]} loading={true} /></Card>
            ) : (
                <>
                    {showBasePermissions && (
                        <>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Key size={18} aria-hidden="true" /> System Permissions</h3>
                            {Object.keys(groupedPermissions).length > 0 ? (
                                Object.entries(groupedPermissions).map(([category, perms]) => (
                                    <Card key={category} variant="elevated" className="mb-4">
                                        <div className="p-4 border-b border-neutral-100"><h2 className="font-semibold">{category}</h2></div>
                                        <DataTable columns={permissionColumns} data={perms} />
                                    </Card>
                                ))
                            ) : (
                                <Card variant="elevated" className="mb-4"><EmptyState icon={<Shield />} title={search ? "No permissions match your search" : "No permissions configured"} size="s" /></Card>
                            )}
                        </>
                    )}

                    {showRolePermissions && filteredRolePerms.length > 0 && (
                        <>
                            <h3 className="text-lg font-semibold mb-3 mt-6 flex items-center gap-2"><Shield size={18} aria-hidden="true" /> Role-Based Permissions</h3>
                            {Object.entries(groupedRolePerms).map(([roleKey, perms]) => {
                                const [roleType, roleValue] = roleKey.split(':');
                                return (
                                    <Card key={roleKey} variant="elevated" className="mb-4">
                                        <div className="p-4 border-b border-neutral-100"><h2 className="font-semibold flex items-center"><Badge status="info" variant="light" size="s" className="mr-2">{roleType}</Badge>{roleValue?.replace('_', ' ')}</h2></div>
                                        <DataTable columns={rolePermColumns} data={perms} />
                                    </Card>
                                );
                            })}
                        </>
                    )}

                    {showUserPermissions && (
                        <>
                            <h3 className="text-lg font-semibold mb-3 mt-6 flex items-center gap-2"><Users size={18} aria-hidden="true" /> User-Specific Permissions</h3>
                            {filteredUserPerms.length > 0 ? (
                                <Card variant="elevated" className="mb-4"><DataTable columns={userPermColumns} data={filteredUserPerms} /></Card>
                            ) : (
                                <Card variant="elevated" className="mb-4"><EmptyState icon={<Users />} title={search ? "No user permissions match your search" : "No user-specific permissions granted"} description="User permissions are granted individually via the Users page" size="s" /></Card>
                            )}
                        </>
                    )}
                </>
            )}
        </ContentLayout>
    );
};

export default PermissionsPage;
