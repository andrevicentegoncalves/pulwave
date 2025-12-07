import { authService } from './authService';
import { propertyRepository } from '../repositories/propertyRepository';

/**
 * Dashboard Service
 * Handles business logic for the user dashboard.
 */
export const dashboardService = {
    /**
     * Get aggregated stats for the user dashboard
     * @returns {Promise<Object>} Stats object
     */
    async getDashboardStats() {
        try {
            // 1. Get current user
            const { user } = await authService.getUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            // 2. Get buildings owned by user
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

            // 3. Fetch properties (units) for these buildings
            const properties = await propertyRepository.getUnitsByBuildingIds(buildingIds);

            // 4. Calculate stats
            const rented = properties.filter(p => p.status === 'rented').length;
            const available = properties.filter(p => p.status === 'available').length;
            const revenue = properties
                .filter(p => p.status === 'rented')
                .reduce((sum, p) => sum + (parseFloat(p.monthly_rent) || 0), 0);

            // 5. Calculate locations (unique buildings) - usually same as buildingIds length if 1-to-1, but just in case
            const locationCount = buildingIds.length;

            return {
                totalBuildings: buildingIds.length,
                totalProperties: properties.length,
                rentedUnits: rented,
                availableUnits: available,
                locations: locationCount,
                monthlyRevenue: revenue,
            };
        } catch (error) {
            console.error('Error in getDashboardStats:', error);
            throw error;
        }
    },

    /**
     * Get a time-appropriate greeting
     * @returns {string} Greeting string
     */
    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    },

    /**
     * Get display name for the user
     * @param {Object} user Auth user object
     * @param {Object} profile User profile object
     * @returns {string} Display name
     */
    getDisplayName(user, profile) {
        if (!profile) return user?.email?.split('@')[0] || 'there';

        const firstName = profile.first_name || '';
        const lastName = profile.last_name || '';

        if (firstName) return firstName;
        if (lastName) return lastName;
        return user?.email?.split('@')[0] || 'there';
    }
};

export default dashboardService;
