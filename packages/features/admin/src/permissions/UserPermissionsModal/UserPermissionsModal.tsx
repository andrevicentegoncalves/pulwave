import { useState, useMemo, useEffect } from 'react';
import { Modal, Button, Badge, EmptyState, Checkbox, Shield, Check, X } from '@pulwave/ui';
import { useAllPermissions, useUserPermissionGrants, useGrantUserPermission, useRevokeUserPermission } from '../../permissions/useAdminPermissions';
import type { Permission, PermissionGrant } from '@pulwave/entity-auth';

interface User {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    app_role?: string;
    profile_id?: string;
}

export interface UserPermissionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    currentUserId: string; // Inject current used ID for grantedBy
}

export const UserPermissionsModal = ({ isOpen, onClose, user, currentUserId }: UserPermissionsModalProps) => {
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

    const { data: allPermissions = [], isLoading: loadingAll } = useAllPermissions();
    const { data: userGrants = [], isLoading: loadingGrants } = useUserPermissionGrants(user?.id || '');
    const grantPermission = useGrantUserPermission();
    const revokePermission = useRevokeUserPermission();

    useEffect(() => {
        if (userGrants && userGrants.length > 0) {
            const grantedIds = (userGrants as PermissionGrant[])
                .filter(g => g.is_granted)
                .map(g => g.permission_id);

            // Only update if the IDs have actually changed
            setSelectedPermissions(prev => {
                const prevArray = Array.from(prev).sort();
                const newArray = [...grantedIds].sort();

                // Compare arrays - only create new Set if content differs
                if (prevArray.length !== newArray.length ||
                    prevArray.some((id, index) => id !== newArray[index])) {
                    return new Set(grantedIds);
                }
                return prev;
            });
        } else {
            // Only create new empty Set if current Set is not empty
            setSelectedPermissions(prev => prev.size === 0 ? prev : new Set());
        }
    }, [userGrants]);

    const groupedPermissions = useMemo(() => {
        const groups: Record<string, Permission[]> = {};
        (allPermissions as Permission[]).forEach(perm => {
            const category = perm.permission_category || 'Other';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(perm);
        });
        return groups;
    }, [allPermissions]);

    const getGrantStatus = (permissionId: string) => {
        const grant = (userGrants as PermissionGrant[])?.find(g => g.permission_id === permissionId);
        return grant ? (grant.is_granted ? 'granted' : 'revoked') : 'none';
    };

    const handleTogglePermission = async (permission: Permission) => {
        if (!user) return;
        const isCurrentlyGranted = selectedPermissions.has(permission.id);

        if (isCurrentlyGranted) {
            await revokePermission.mutateAsync({
                userId: user.id,
                permissionId: permission.id,
            });
            setSelectedPermissions(prev => {
                const next = new Set(prev);
                next.delete(permission.id);
                return next;
            });
        } else {
            await grantPermission.mutateAsync({
                userId: user.id,
                permissionId: permission.id,
                grantedBy: currentUserId,
                reason: 'Granted via admin panel',
            });
            setSelectedPermissions(prev => new Set([...prev, permission.id]));
        }
    };

    const isLoading = loadingAll || loadingGrants;
    const isMutating = grantPermission.isPending || revokePermission.isPending;

    if (!user) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Permissions for ${user.first_name || user.email}`}
            size="l"
        >
            <div className="user-permissions-modal">
                <div className="user-permissions-modal__info margin-bottom-4">
                    <p className="text-sm text-color-text-secondary">
                        Role-based permissions are inherited from the user's role (<Badge status="info" size="s">{user.app_role || 'N/A'}</Badge>).
                        You can grant additional permissions or override role permissions below.
                    </p>
                </div>

                {isLoading ? (
                    <div className="display-flex align-items-center justify-content-center padding-vertical-8">
                        Loading permissions...
                    </div>
                ) : Object.keys(groupedPermissions).length === 0 ? (
                    <EmptyState
                        icon={<Shield aria-hidden="true" />}
                        title="No permissions available"
                        description="No permissions are configured in the system."
                        size="s"
                    />
                ) : (
                    <div className="user-permissions-modal__categories">
                        {Object.entries(groupedPermissions).map(([category, permissions]) => (
                            <div key={category} className="user-permissions-modal__category margin-bottom-4">
                                <h4 className="text-sm font-weight-semibold text-color-text-primary margin-bottom-2">{category}</h4>
                                <div className="user-permissions-modal__list">
                                    {permissions.map((permission: Permission) => {
                                        const isGranted = selectedPermissions.has(permission.id);
                                        const grantStatus = getGrantStatus(permission.id);

                                        return (
                                            <div
                                                key={permission.id}
                                                className="user-permissions-modal__item display-flex align-items-center justify-between padding-vertical-2 padding-horizontal-3 border-radius-m hover:bg-background-color-surface-subtle"
                                            >
                                                <div className="display-flex align-items-center gap-3">
                                                    <Checkbox
                                                        checked={isGranted}
                                                        onChange={() => handleTogglePermission(permission)}
                                                        disabled={isMutating}
                                                        size="s"
                                                        aria-label={`Grant ${permission.permission_name} permission`}
                                                    />
                                                    <div>
                                                        <span className="text-sm font-weight-medium text-color-text-primary">
                                                            {permission.permission_name}
                                                        </span>
                                                        {permission.description && (
                                                            <p className="text-xs text-color-text-secondary">
                                                                {permission.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="display-flex align-items-center gap-2">
                                                    {grantStatus === 'granted' && (
                                                        <Badge status="success" size="s">
                                                            <Check size={12} className="margin-right-1" aria-hidden="true" /> Granted
                                                        </Badge>
                                                    )}
                                                    {grantStatus === 'revoked' && (
                                                        <Badge status="error" size="s">
                                                            <X size={12} className="margin-right-1" aria-hidden="true" /> Revoked
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="user-permissions-modal__footer margin-top-6 display-flex justify-end gap-2">
                    <Button kind="secondary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
