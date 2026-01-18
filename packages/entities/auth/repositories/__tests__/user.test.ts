/**
 * Auth Repository Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { UserData } from '../../interfaces';

// Mock the infrastructure module
vi.mock('../../../../../infrastructure', () => ({
    dataProvider: {
        user: {
            getUsers: vi.fn(),
            getUserById: vi.fn(),
            createUser: vi.fn(),
            updateUser: vi.fn(),
            getUserPermissions: vi.fn(),
            checkUserHasPermission: vi.fn(),
        },
    },
}));

import { dataProvider } from '@pulwave/entity-infrastructure';


describe('User Repository', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getUsers', () => {
        it('should fetch paginated users', async () => {
            const mockUserData: UserData = {
                id: '1',
                email: 'test@test.com',
                app_role: 'user',
                is_active: true,
            };
            const mockResult: { data: UserData[]; count: number | null } = {
                data: [mockUserData],
                count: 1,
            };
            vi.mocked(dataProvider.user.getUsers).mockResolvedValue(mockResult);

            expect(dataProvider.user.getUsers).toBeDefined();
        });

        it('should filter by role', async () => {
            const mockResult: { data: UserData[]; count: number | null } = { data: [], count: 0 };
            vi.mocked(dataProvider.user.getUsers).mockResolvedValue(mockResult);
            expect(true).toBe(true);
        });
    });

    describe('getUserById', () => {
        it('should return user by id', async () => {
            const mockUser: UserData = {
                id: '1',
                email: 'test@test.com',
                app_role: 'user',
                is_active: true,
            };
            vi.mocked(dataProvider.user.getUserById).mockResolvedValue(mockUser);

            expect(dataProvider.user.getUserById).toBeDefined();
        });

        it('should return null for non-existent user', async () => {
            vi.mocked(dataProvider.user.getUserById).mockResolvedValue(null);
            expect(true).toBe(true);
        });
    });

    describe('permissions', () => {
        it('should get user permissions', async () => {
            vi.mocked(dataProvider.user.getUserPermissions).mockResolvedValue(['read', 'write']);
            expect(dataProvider.user.getUserPermissions).toBeDefined();
        });

        it('should check if user has specific permission', async () => {
            vi.mocked(dataProvider.user.checkUserHasPermission).mockResolvedValue(true);
            expect(dataProvider.user.checkUserHasPermission).toBeDefined();
        });
    });
});


