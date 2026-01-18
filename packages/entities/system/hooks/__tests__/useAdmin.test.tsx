/**
 * useAdmin Hook Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import {
    useAdminDashboard,
    useAdminUsers,
    useAdminUser,
    useUpdateAdminUser,
    useAdminLocales,
    useAdminMasterDataTypes,
    useAdminMasterDataValues,
    useAllPermissions,
    useAdminPermissions,
    useAdminTranslations,
    useSaveAdminTranslation,
    useRolePermissions,
    useAllUserPermissions,
    useUserPermissionGrants,
    useGrantUserPermission,
    useRevokeUserPermission,
} from '../';
import { adminService } from '../../services/index';
import type { UserData, Permission, PermissionGrant } from '@pulwave/entity-auth';
import type { UITranslation, Locale } from '@pulwave/entity-translation';

// Mock dependencies
vi.mock('../../services/index', () => ({
    adminService: {
        getDashboardData: vi.fn(),
        getUsers: vi.fn(),
        getUserById: vi.fn(),
        updateUser: vi.fn(),
        getSupportedLocales: vi.fn(),
        getMasterDataTypes: vi.fn(),
        getMasterDataValues: vi.fn(),
        getAllPermissions: vi.fn(),
        getPermissions: vi.fn(),
        getUITranslations: vi.fn(),
        saveUITranslation: vi.fn(),
        getAllUserPermissions: vi.fn(),
        getRolePermissions: vi.fn(),
        getUserPermissionGrants: vi.fn(),
        grantUserPermission: vi.fn(),
        revokeUserPermission: vi.fn(),
    },
}));

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return function Wrapper({ children }: { children: ReactNode }) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };
}

describe('Admin Hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useAdminDashboard', () => {
        it('should fetch dashboard data', async () => {
            const mockData = {
                stats: {
                    users: 100,
                    revenue: 50000,
                    totalUsers: 100,
                    totalOrganizations: 10,
                    activeUsersLast7Days: 80
                },
                recentActivity: [],
                translationStats: {}
            };
            vi.mocked(adminService.getDashboardData).mockResolvedValue(mockData);

            const { result } = renderHook(() => useAdminDashboard(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isLoading).toBe(true);

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(result.current.data).toEqual(mockData);
            expect(adminService.getDashboardData).toHaveBeenCalled();
        });
    });

    describe('useAdminUsers', () => {
        it('should fetch users with default pagination', async () => {
            const mockUser: UserData = { id: '1', email: 'user1@test.com', app_role: 'user', is_active: true };
            const mockUsers = { data: [mockUser], count: 1 };
            vi.mocked(adminService.getUsers).mockResolvedValue(mockUsers);

            const { result } = renderHook(() => useAdminUsers(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(result.current.data).toEqual(mockUsers);
            expect(adminService.getUsers).toHaveBeenCalledWith({
                page: 1,
                limit: 20,
                search: '',
                role: '',
                status: '',
            });
        });

        it('should fetch users with custom filters', async () => {
            const mockUser: UserData = { id: '2', email: 'admin@test.com', app_role: 'admin', is_active: true };
            const mockUsers = { data: [mockUser], count: 1 };
            vi.mocked(adminService.getUsers).mockResolvedValue(mockUsers);

            const { result } = renderHook(
                () => useAdminUsers({ page: 2, limit: 10, search: 'admin', role: 'admin' }),
                { wrapper: createWrapper() }
            );

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(adminService.getUsers).toHaveBeenCalledWith({
                page: 2,
                limit: 10,
                search: 'admin',
                role: 'admin',
                status: '',
            });
        });
    });

    describe('useAdminUser', () => {
        it('should fetch single user by id', async () => {
            const mockUser: UserData = { id: 'u1', email: 'test@test.com', app_role: 'user', is_active: true };
            vi.mocked(adminService.getUserById).mockResolvedValue(mockUser);

            const { result } = renderHook(() => useAdminUser('u1'), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(result.current.data).toEqual(mockUser);
            expect(adminService.getUserById).toHaveBeenCalledWith('u1');
        });

        it('should not fetch when id is empty', () => {
            const { result } = renderHook(() => useAdminUser(''), {
                wrapper: createWrapper(),
            });

            expect(adminService.getUserById).not.toHaveBeenCalled();
        });
    });

    describe('useUpdateAdminUser', () => {
        it('should update user and invalidate queries', async () => {
            const updatedUser: UserData = { id: 'u1', email: 'test@test.com', app_role: 'user', is_active: true };
            vi.mocked(adminService.updateUser).mockResolvedValue(updatedUser);

            const { result } = renderHook(() => useUpdateAdminUser(), {
                wrapper: createWrapper(),
            });

            await result.current.mutateAsync({ id: 'u1', updates: { name: 'Updated' } });

            expect(adminService.updateUser).toHaveBeenCalledWith('u1', { name: 'Updated' });
        });
    });

    describe('useAdminLocales', () => {
        it('should fetch supported locales', async () => {
            const mockLocales: Locale[] = [{ code: 'en', name: 'English', is_default: true, is_enabled: true }];
            vi.mocked(adminService.getSupportedLocales).mockResolvedValue(mockLocales);

            const { result } = renderHook(() => useAdminLocales(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(result.current.data).toEqual(mockLocales);
            expect(adminService.getSupportedLocales).toHaveBeenCalled();
        });
    });

    describe('useAdminMasterDataTypes', () => {
        it('should fetch master data types', async () => {
            const mockTypes = [{ id: 't1', name: 'Countries', key: 'country' }];
            vi.mocked(adminService.getMasterDataTypes).mockResolvedValue(mockTypes);

            const { result } = renderHook(() => useAdminMasterDataTypes(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(result.current.data).toEqual(mockTypes);
        });
    });

    describe('useAdminMasterDataValues', () => {
        it('should fetch values for a type', async () => {
            const mockValues = [{ id: 'v1', value: 'Portugal', type_id: 'countries', label: 'Portugal', is_active: true }];
            vi.mocked(adminService.getMasterDataValues).mockResolvedValue(mockValues);

            const { result } = renderHook(() => useAdminMasterDataValues('countries'), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(result.current.data).toEqual(mockValues);
            expect(adminService.getMasterDataValues).toHaveBeenCalledWith('countries');
        });

        it('should not fetch when typeId is empty', () => {
            const { result } = renderHook(() => useAdminMasterDataValues(''), {
                wrapper: createWrapper(),
            });

            expect(adminService.getMasterDataValues).not.toHaveBeenCalled();
        });
    });

    describe('useAllPermissions', () => {
        it('should fetch all permissions', async () => {
            const mockPermissions: Permission[] = [{ id: 'p1', permission_name: 'read', permission_category: 'general', is_active: true }];
            vi.mocked(adminService.getAllPermissions).mockResolvedValue(mockPermissions);

            const { result } = renderHook(() => useAllPermissions(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(result.current.data).toEqual(mockPermissions);
        });
    });

    describe('useAdminPermissions', () => {
        it('should fetch admin-level permissions', async () => {
            const mockPermissions = ['read', 'write'];
            vi.mocked(adminService.getPermissions).mockResolvedValue(mockPermissions);

            const { result } = renderHook(() => useAdminPermissions(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(result.current.data).toEqual(mockPermissions);
        });
    });

    describe('useAdminTranslations', () => {
        it('should fetch translations with filters', async () => {
            const mockTranslations: UITranslation[] = [{
                id: 't1',
                key: 'hello',
                value: 'Hello',
                locale: 'en',
                namespace: 'ui',
                is_active: true
            }];
            vi.mocked(adminService.getUITranslations).mockResolvedValue(mockTranslations);

            const { result } = renderHook(
                () => useAdminTranslations({ locale: 'en', search: 'hello' }),
                { wrapper: createWrapper() }
            );

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(result.current.data).toEqual(mockTranslations);
            expect(adminService.getUITranslations).toHaveBeenCalledWith({
                page: 1,
                limit: 50,
                locale: 'en',
                search: 'hello',
                source_type: '',
            });
        });
    });

    describe('useSaveAdminTranslation', () => {
        it('should save translation and invalidate queries', async () => {
            const mockSaved: UITranslation = {
                id: 't1',
                key: 'test',
                value: 'Test',
                locale: 'en',
                namespace: 'ui',
                is_active: true
            };
            vi.mocked(adminService.saveUITranslation).mockResolvedValue(mockSaved);

            const { result } = renderHook(() => useSaveAdminTranslation(), {
                wrapper: createWrapper(),
            });

            await result.current.mutateAsync({ key: 'test', value: 'Test', locale: 'en', namespace: 'ui' });

            expect(adminService.saveUITranslation).toHaveBeenCalledWith({ key: 'test', value: 'Test', locale: 'en', namespace: 'ui' });
        });
    });

    describe('useRolePermissions', () => {
        it('should fetch role permissions when roleId is provided', async () => {
            const mockPerms = ['perm1'];
            vi.mocked(adminService.getRolePermissions).mockResolvedValue(mockPerms);

            const { result } = renderHook(() => useRolePermissions('role1'), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(result.current.data).toEqual(mockPerms);
            expect(adminService.getRolePermissions).toHaveBeenCalledWith('role1');
        });

        it('should not fetch when roleId is missing', () => {
            renderHook(() => useRolePermissions(), {
                wrapper: createWrapper(),
            });
            expect(adminService.getRolePermissions).not.toHaveBeenCalled();
        });
    });

    describe('useUserPermissionGrants', () => {
        it('should fetch user grants', async () => {
            const mockGrants = [{
                id: 'g1',
                permission_id: 'p1',
                user_id: 'u1',
                granted_by: 'admin',
                created_at: new Date().toISOString()
            }];
            vi.mocked(adminService.getUserPermissionGrants).mockResolvedValue(mockGrants);

            const { result } = renderHook(() => useUserPermissionGrants('u1'), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(result.current.data).toEqual(mockGrants);
            expect(adminService.getUserPermissionGrants).toHaveBeenCalledWith('u1');
        });
    });

    describe('useGrantUserPermission', () => {
        it('should grant permission', async () => {
            const mockGrant: PermissionGrant = {
                id: 'g1',
                user_id: 'u1',
                permission_id: 'p1',
                granted_by: 'admin',
                created_at: new Date().toISOString()
            };
            vi.mocked(adminService.grantUserPermission).mockResolvedValue(mockGrant);

            const { result } = renderHook(() => useGrantUserPermission(), {
                wrapper: createWrapper(),
            });

            await result.current.mutateAsync({ userId: 'u1', permissionId: 'p1', grantedBy: 'admin', reason: 'test' });

            expect(adminService.grantUserPermission).toHaveBeenCalledWith('u1', 'p1', 'admin', 'test', '');
        });
    });

    describe('useRevokeUserPermission', () => {
        it('should revoke permission', async () => {
            vi.mocked(adminService.revokeUserPermission).mockResolvedValue();

            const { result } = renderHook(() => useRevokeUserPermission(), {
                wrapper: createWrapper(),
            });

            await result.current.mutateAsync({ userId: 'u1', permissionId: 'p1' });

            expect(adminService.revokeUserPermission).toHaveBeenCalledWith('u1', 'p1');
        });
    });

    describe('useAllUserPermissions', () => {
        it('should fetch all user permissions when method exists', async () => {
            const mockPerms = ['read'];
            vi.mocked(adminService.getAllUserPermissions).mockResolvedValue(mockPerms);

            const { result } = renderHook(() => useAllUserPermissions('u1'), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(result.current.data).toEqual(mockPerms);
        });
    });
});




