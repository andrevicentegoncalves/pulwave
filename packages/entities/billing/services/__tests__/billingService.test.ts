import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { billingService } from '../billingService';
import type { IBillingHistory } from '../../interfaces/IBillingHistory';

// Mock the repository factory/provider
vi.mock('../../../../../infrastructure', () => {
    const mockRepo = {
        getHistory: vi.fn(),
        getInvoice: vi.fn(),
    };
    return {
        dataProvider: {
            billing: mockRepo
        }
    };
});

// Re-import to ensure mock is used?
// The implementation of billingService imports dataProvider directly.
// So mocking infrastructure should work.

import { dataProvider } from '@pulwave/entity-infrastructure';

describe('Billing Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch billing history', async () => {
        const mockHistory: IBillingHistory[] = [
            {
                id: '1',
                user_id: 'user-123',
                amount: '100',
                currency: 'USD',
                date: '2023-01-01',
                status: 'paid',
            },
        ];
        (dataProvider.billing.getHistory as Mock).mockResolvedValue(mockHistory);

        const result = await billingService.getHistory('user-123');

        expect(dataProvider.billing.getHistory).toHaveBeenCalledWith('user-123');
        expect(result).toEqual(mockHistory);
    });

    it('should fetch invoice url', async () => {
        const mockUrl = 'https://example.com/invoice.pdf';
        (dataProvider.billing.getInvoice as Mock).mockResolvedValue(mockUrl);

        const result = await billingService.getInvoice('inv-123');

        expect(dataProvider.billing.getInvoice).toHaveBeenCalledWith('inv-123');
        expect(result).toEqual(mockUrl);
    });
});



