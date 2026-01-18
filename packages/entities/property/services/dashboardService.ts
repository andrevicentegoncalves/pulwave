/**
 * Dashboard Service (Property)
 * Legacy export for dashboard logic.
 */
import { propertyStatsService } from './stats';
import { propertyUtils } from './utils';

export const propertyDashboardService = {
    ...propertyStatsService,
    ...propertyUtils
};

export default propertyDashboardService;


