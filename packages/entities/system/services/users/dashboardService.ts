/**
 * Dashboard Admin Service
 * Dashboard data aggregation for admin backoffice.
 */
import { systemRepository } from '../../repositories/systemRepository';

export const dashboardService = {
    async getDashboardData() {
        const [stats, recentActivity, translationStats] = await Promise.all([
            systemRepository.getDashboardStats(),
            systemRepository.getActivityLogs({ limit: 10 }),
            systemRepository.getTranslationStats(),
        ]);
        return { stats, recentActivity: recentActivity.data, translationStats };
    },

    async getActivityLogs(options = {}) {
        return systemRepository.getActivityLogs(options);
    },
};



