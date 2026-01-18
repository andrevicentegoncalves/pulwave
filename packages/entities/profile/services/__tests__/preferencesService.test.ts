/**
 * Preferences Service Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { preferencesService } from '..//preferences/preferencesService';
import { profileRepository } from '../../repositories/profileRepository';
import type { UserPreferences } from '../../interfaces';

// Mock repository
vi.mock('../../repositories/profileRepository', () => ({
    profileRepository: {
        findPreferences: vi.fn(),
        upsertPreferences: vi.fn(),
    }
}));

describe('PreferencesService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should get user preferences', async () => {
        const mockPrefs: UserPreferences = { profile_id: 'p1', theme: 'dark' };
        vi.mocked(profileRepository.findPreferences).mockResolvedValue(mockPrefs);

        const result = await preferencesService.getPreferences('p1');
        expect(result).toEqual(mockPrefs);
        expect(profileRepository.findPreferences).toHaveBeenCalledWith('p1');
    });

    it('should upsert user preferences', async () => {
        const prefs: Partial<UserPreferences> = { theme: 'light' };
        const mockResult: UserPreferences = { profile_id: 'p1', ...prefs };
        vi.mocked(profileRepository.upsertPreferences).mockResolvedValue(mockResult);

        const result = await preferencesService.upsertPreferences('p1', prefs);
        expect(result).toEqual(mockResult);
        expect(profileRepository.upsertPreferences).toHaveBeenCalledWith({
            profile_id: 'p1',
            ...prefs,
            organization_id: undefined
        });
    });
});

