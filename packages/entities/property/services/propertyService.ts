/**
 * Property Service
 * Handles property/building logic.
 */
import { propertyRepository } from '../repositories/propertyRepository';
import { sessionService } from '@pulwave/entity-auth';
import { Building } from '../interfaces/types';

export interface PropertyWithStats extends Building {
    unitsCount: number;
    status: 'Active' | 'Maintenance' | 'Vacant'; // Derived status
}

export const propertyService = {
    async getProperties(): Promise<PropertyWithStats[]> {
        const user = await sessionService.getUser();
        if (!user) return [];

        const buildingIds = await propertyRepository.getBuildingIdsByOwner(user.id);
        if (buildingIds.length === 0) return [];

        const buildings = await propertyRepository.getBuildingsByIds(buildingIds);

        // Enhance with stats (mock logic for now or fetch real stats if efficient)
        // ideally we would do a join in repo, but strict separation suggests composition or dedicated query
        // For now, let's just return buildings and assumes units count is 0 or fetched separately?
        // The UI needs "units" count and "status".

        // Let's map to UI shape
        return buildings.map(b => ({
            ...b,
            unitsCount: 0, // Placeholder
            status: 'Active'
        }));
    },

    async getBuildingStats(buildingId: string) {
        // Return placeholder stats for now to align with UI expectations
        return {
            totalUnits: 0,
            occupiedUnits: 0,
            revenue: 0,
            occupancyRate: 0
        };
    }
};



