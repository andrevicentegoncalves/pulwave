/**
 * Property Stats Service
 * Dashboard statistics for properties.
 */
import { authService } from '@pulwave/entity-auth';
import { propertyRepository } from '../../repositories/propertyRepository';
import type { Unit } from '../../interfaces';

interface UnitWithRent extends Unit {
    monthly_rent?: string | number;
}

function isRented(unit: Unit): boolean {
    return unit.status === 'Occupied';
}

function isAvailable(unit: Unit): boolean {
    return unit.status === 'Vacant';
}

export const propertyStatsService = {
    async getDashboardStats() {
        try {
            const user = await authService.getUser();
            if (!user) throw new Error('User not authenticated');

            const buildingIds = await propertyRepository.getBuildingIdsByOwner(user.id);

            if (buildingIds.length === 0) {
                return {
                    totalBuildings: 0,
                    totalProperties: 0,
                    rentedUnits: 0,
                    availableUnits: 0,
                    locations: 0,
                    monthlyRevenue: 0,
                };
            }

            const properties = await propertyRepository.getUnitsByBuildingIds(buildingIds) as UnitWithRent[];

            const rented = properties.filter(isRented).length;
            const available = properties.filter(isAvailable).length;
            const revenue = properties
                .filter(isRented)
                .reduce((sum, p) => sum + (parseFloat(String(p.monthly_rent ?? 0)) || 0), 0);

            return {
                totalBuildings: buildingIds.length,
                totalProperties: properties.length,
                rentedUnits: rented,
                availableUnits: available,
                locations: buildingIds.length,
                monthlyRevenue: revenue,
            };
        } catch (error) {
            // Error in getDashboardStats
            throw error;
        }
    },
};



