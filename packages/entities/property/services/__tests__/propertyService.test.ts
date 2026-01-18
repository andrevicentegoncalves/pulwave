import { describe, it, expect, vi, beforeEach } from 'vitest';
import { propertyService } from '../propertyService';
import { propertyRepository } from '../../repositories/propertyRepository';
import { sessionService } from '@pulwave/entity-auth';
import type { User } from '@pulwave/entity-auth';
import type { Building } from '../../interfaces/types';

// Mock dependencies
vi.mock('../../repositories/propertyRepository', () => ({
    propertyRepository: {
        getBuildingIdsByOwner: vi.fn(),
        getBuildingsByIds: vi.fn(),
    },
}));

vi.mock('@pulwave/entity-auth', () => ({
    sessionService: {
        getUser: vi.fn(),
    },
}));

function createMockUser(overrides: Partial<User> = {}): User {
    return {
        id: 'user-1',
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        ...overrides,
    };
}

function createMockBuilding(overrides: Partial<Building> = {}): Building {
    return {
        id: 'b-1',
        owner_id: 'user-1',
        name: 'Building 1',
        address: '123 Main St',
        ...overrides,
    };
}

describe('Property Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getProperties', () => {
        it('should return empty list if no user logged in', async () => {
            vi.mocked(sessionService.getUser).mockResolvedValue(null);
            const result = await propertyService.getProperties();
            expect(result).toEqual([]);
        });

        it('should return properties for logged in user', async () => {
            const mockUser = createMockUser({ id: 'user-1' });
            const mockBuildingIds = ['b-1', 'b-2'];
            const mockBuildings: Building[] = [
                createMockBuilding({ id: 'b-1', name: 'B1' }),
                createMockBuilding({ id: 'b-2', name: 'B2' }),
            ];

            vi.mocked(sessionService.getUser).mockResolvedValue(mockUser);
            vi.mocked(propertyRepository.getBuildingIdsByOwner).mockResolvedValue(mockBuildingIds);
            vi.mocked(propertyRepository.getBuildingsByIds).mockResolvedValue(mockBuildings);

            const result = await propertyService.getProperties();

            expect(sessionService.getUser).toHaveBeenCalled();
            expect(propertyRepository.getBuildingIdsByOwner).toHaveBeenCalledWith('user-1');
            expect(propertyRepository.getBuildingsByIds).toHaveBeenCalledWith(mockBuildingIds);
            expect(result).toHaveLength(2);
            expect(result[0].status).toBe('Active'); // Default status check
        });

        it('should return empty list if user has no properties', async () => {
            const mockUser = createMockUser({ id: 'user-1' });
            vi.mocked(sessionService.getUser).mockResolvedValue(mockUser);
            vi.mocked(propertyRepository.getBuildingIdsByOwner).mockResolvedValue([]);

            const result = await propertyService.getProperties();

            expect(propertyRepository.getBuildingsByIds).not.toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });
});





