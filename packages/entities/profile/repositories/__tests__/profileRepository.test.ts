/**
 * Profile Repository Tests
 */
import { describe, it, expect, vi } from 'vitest';
import { profileRepository } from '..//profileRepository';
import { dataProvider } from '@pulwave/entity-infrastructure';

describe('ProfileRepository', () => {
    it('should be the dataProvider.profile instance', () => {
        expect(profileRepository).toBe(dataProvider.profile);
    });

    it('should have all required interface methods', () => {
        expect(profileRepository.findById).toBeTypeOf('function');
        expect(profileRepository.findByAuthUserId).toBeTypeOf('function');
        expect(profileRepository.update).toBeTypeOf('function');
        expect(profileRepository.findProfessionalProfile).toBeTypeOf('function');
        expect(profileRepository.findSocialProfiles).toBeTypeOf('function');
        expect(profileRepository.findPreferences).toBeTypeOf('function');
        expect(profileRepository.findAddress).toBeTypeOf('function');
        expect(profileRepository.findContacts).toBeTypeOf('function');
        expect(profileRepository.findAuthState).toBeTypeOf('function');
        expect(profileRepository.findOnboardingStatus).toBeTypeOf('function');
    });
});

