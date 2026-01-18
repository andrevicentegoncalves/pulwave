/**
 * Export Service
 * Handles user data export (JSON, CSV).
 */
import { profileRepository } from '../../repositories/profileRepository';
import { UserExportData } from '../../interfaces/types/Profile';

export const exportService = {
    async exportUserData(profileId: string): Promise<UserExportData> {
        return profileRepository.exportUserData(profileId);
    },

    async exportAsJson(profileId: string): Promise<string> {
        const data = await this.exportUserData(profileId);
        return JSON.stringify(data, null, 2);
    },

    async exportAsCsv(profileId: string): Promise<string> {
        const data = await this.exportUserData(profileId);
        const rows: string[][] = [];

        const profile = data.profile || {};
        rows.push(['Section', 'Field', 'Value']);

        Object.entries(profile).forEach(([key, value]) => {
            if (typeof value !== 'object') {
                rows.push(['Profile', key, String(value ?? '')]);
            }
        });

        const prefs = data.preferences || {};
        Object.entries(prefs).forEach(([key, value]) => {
            if (typeof value !== 'object') {
                rows.push(['Preferences', key, String(value ?? '')]);
            }
        });

        (data.contacts || []).forEach((contact, i: number) => {
            Object.entries(contact).forEach(([key, value]) => {
                if (typeof value !== 'object') {
                    rows.push([`Contact ${i + 1}`, key, String(value ?? '')]);
                }
            });
        });

        (data.addresses || []).forEach((addr, i: number) => {
            Object.entries(addr).forEach(([key, value]) => {
                if (typeof value !== 'object') {
                    rows.push([`Address ${i + 1}`, key, String(value ?? '')]);
                }
            });
        });

        return rows.map(row =>
            row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ).join('\n');
    },
};


