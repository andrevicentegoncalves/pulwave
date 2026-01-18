/**
 * Storage Service Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { storageService } from '../storageService';
import { storageRepository } from '../../repositories/storageRepository';

// Mock repository
vi.mock('../../repositories/storageRepository', () => ({
    storageRepository: {
        upload: vi.fn(),
        delete: vi.fn(),
        deleteMany: vi.fn(),
        getPublicUrl: vi.fn(),
        parseStorageUrl: vi.fn(),
    }
}));

describe('Storage Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Business Logic', () => {
        it('uploadAvatar should format path and bucket correctly', async () => {
            const file = new File([''], 'avatar.jpg', { type: 'image/jpeg' });
            vi.mocked(storageRepository.upload).mockResolvedValue('url');

            await storageService.uploadAvatar('u1', file);

            // Verify service layer logic (bucket name 'profile-images', path formatting)
            const [bucket, path] = vi.mocked(storageRepository.upload).mock.calls[0];
            expect(bucket).toBe('profile-images');
            expect(path).toContain('avatars/u1-');
        });

        it('deleteAvatar should parse URL before deleting', async () => {
            vi.mocked(storageRepository.parseStorageUrl).mockReturnValue({
                bucket: 'profile-images',
                path: 'p'
            });

            await storageService.deleteAvatar('url');

            expect(storageRepository.delete).toHaveBeenCalledWith('profile-images', 'p');
        });
    });
});




