import { describe, it, expect, vi, beforeEach } from 'vitest';
import { featureFlagService } from '../featureFlagService';
import { dataProvider } from '@pulwave/entity-infrastructure';
import type { FeatureFlag } from '../../interfaces';

vi.mock('../../../../../infrastructure', () => ({
    dataProvider: {
        featureFlag: {
            getAllFlags: vi.fn(),
            getFlagByKey: vi.fn(),
            evaluateFlag: vi.fn(),
            createFlag: vi.fn(),
            updateFlag: vi.fn(),
            deleteFlag: vi.fn(),
        },
    },
}));

describe('featureFlagService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('isEnabled', () => {
        it('should return true when flag is enabled', async () => {
            vi.mocked(dataProvider.featureFlag.evaluateFlag).mockResolvedValue({
                flagKey: 'test-flag',
                enabled: true,
                reason: 'default',
            });

            const result = await featureFlagService.isEnabled('test-flag');

            expect(result).toBe(true);
            expect(dataProvider.featureFlag.evaluateFlag).toHaveBeenCalledWith('test-flag', undefined, undefined);
        });

        it('should return false when flag is disabled', async () => {
            vi.mocked(dataProvider.featureFlag.evaluateFlag).mockResolvedValue({
                flagKey: 'test-flag',
                enabled: false,
                reason: 'default',
            });

            const result = await featureFlagService.isEnabled('test-flag');

            expect(result).toBe(false);
        });

        it('should pass userId and userRoles to evaluateFlag', async () => {
            vi.mocked(dataProvider.featureFlag.evaluateFlag).mockResolvedValue({
                flagKey: 'test-flag',
                enabled: true,
                reason: 'user_targeted',
            });

            await featureFlagService.isEnabled('test-flag', 'user-123', ['admin']);

            expect(dataProvider.featureFlag.evaluateFlag).toHaveBeenCalledWith('test-flag', 'user-123', ['admin']);
        });
    });

    describe('evaluate', () => {
        it('should return full evaluation details', async () => {
            const mockEvaluation = {
                flagKey: 'test-flag',
                enabled: true,
                reason: 'percentage_rollout' as const,
            };

            vi.mocked(dataProvider.featureFlag.evaluateFlag).mockResolvedValue(mockEvaluation);

            const result = await featureFlagService.evaluate('test-flag', 'user-123');

            expect(result).toEqual(mockEvaluation);
        });
    });

    describe('getAllFlags', () => {
        it('should return all flags', async () => {
            const mockFlags: FeatureFlag[] = [
                { id: '1', key: 'flag-1', name: 'Flag 1', enabled: true, createdAt: '', updatedAt: '' },
                { id: '2', key: 'flag-2', name: 'Flag 2', enabled: false, createdAt: '', updatedAt: '' },
            ];

            vi.mocked(dataProvider.featureFlag.getAllFlags).mockResolvedValue(mockFlags);

            const result = await featureFlagService.getAllFlags();

            expect(result).toEqual(mockFlags);
        });
    });

    describe('createFlag', () => {
        it('should create a new flag', async () => {
            const newFlag = { key: 'new-flag', name: 'New Flag' };
            const createdFlag: FeatureFlag = { id: '1', ...newFlag, enabled: false, createdAt: '', updatedAt: '' };

            vi.mocked(dataProvider.featureFlag.createFlag).mockResolvedValue(createdFlag);

            const result = await featureFlagService.createFlag(newFlag);

            expect(result).toEqual(createdFlag);
            expect(dataProvider.featureFlag.createFlag).toHaveBeenCalledWith(newFlag);
        });
    });

    describe('toggleFlag', () => {
        it('should toggle flag enabled state', async () => {
            const updatedFlag: FeatureFlag = {
                id: '1',
                key: 'flag-1',
                name: 'Flag 1',
                enabled: true,
                createdAt: '',
                updatedAt: '',
            };

            vi.mocked(dataProvider.featureFlag.updateFlag).mockResolvedValue(updatedFlag);

            const result = await featureFlagService.toggleFlag('1', true);

            expect(result).toEqual(updatedFlag);
            expect(dataProvider.featureFlag.updateFlag).toHaveBeenCalledWith('1', { enabled: true });
        });
    });

    describe('deleteFlag', () => {
        it('should delete a flag', async () => {
            vi.mocked(dataProvider.featureFlag.deleteFlag).mockResolvedValue(undefined);

            await featureFlagService.deleteFlag('1');

            expect(dataProvider.featureFlag.deleteFlag).toHaveBeenCalledWith('1');
        });
    });
});
