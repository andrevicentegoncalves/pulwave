/**
 * Storage Repository Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dataProvider } from '@pulwave/entity-infrastructure';
import { storageRepository } from '../../repositories/storageRepository';

// Mock data provider
vi.mock('@pulwave/entity-infrastructure', () => ({
    dataProvider: {
        storage: {
            upload: vi.fn(),
            delete: vi.fn(),
            deleteMany: vi.fn(),
            getPublicUrl: vi.fn(),
            parseStorageUrl: vi.fn(),
        }
    }
}));

describe('Storage Repository Proxy', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should delegate upload to provider', async () => {
        const file = new File([], 'test');
        vi.mocked(dataProvider.storage.upload).mockResolvedValue('url');

        await storageRepository.upload('b', 'p', file);

        expect(dataProvider.storage.upload).toHaveBeenCalledWith('b', 'p', file);
    });

    it('should delegate delete to provider', async () => {
        await storageRepository.delete('b', 'p');
        expect(dataProvider.storage.delete).toHaveBeenCalledWith('b', 'p');
    });

    it('should delegate getPublicUrl to provider', () => {
        storageRepository.getPublicUrl('b', 'p');
        expect(dataProvider.storage.getPublicUrl).toHaveBeenCalledWith('b', 'p');
    });
});



