/**
 * useBilling Hook Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useBillingHistory, useInvoice } from '../useBilling';
import { billingService } from '../../services/billingService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import type { IBillingHistory } from '../../interfaces/IBillingHistory';

vi.mock('../../services/billingService', () => ({
    billingService: {
        getHistory: vi.fn(),
        getInvoice: vi.fn(),
    }
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useBillingHistory', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch billing history for user', async () => {
        const mockHistory: IBillingHistory[] = [
            { id: 'bill-1', user_id: 'user-123', amount: '99.99', currency: 'USD', date: '2024-01-15', status: 'paid' },
            { id: 'bill-2', user_id: 'user-123', amount: '149.99', currency: 'USD', date: '2024-02-15', status: 'paid' }
        ];
        vi.mocked(billingService.getHistory).mockResolvedValue(mockHistory);

        const { result } = renderHook(() => useBillingHistory('user-123'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockHistory);
        expect(billingService.getHistory).toHaveBeenCalledWith('user-123');
    });

    it('should not fetch when userId is empty', () => {
        const { result } = renderHook(() => useBillingHistory(''), {
            wrapper: createWrapper(),
        });

        expect(result.current.isFetching).toBe(false);
        expect(billingService.getHistory).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
        const mockError = new Error('Failed to fetch billing history');
        vi.mocked(billingService.getHistory).mockRejectedValue(mockError);

        const { result } = renderHook(() => useBillingHistory('user-123'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBeTruthy();
    });
});

describe('useInvoice', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch invoice URL', async () => {
        const mockInvoiceUrl = 'https://example.com/invoices/inv-123.pdf';
        vi.mocked(billingService.getInvoice).mockResolvedValue(mockInvoiceUrl);

        const { result } = renderHook(() => useInvoice('inv-123'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBe(mockInvoiceUrl);
        expect(billingService.getInvoice).toHaveBeenCalledWith('inv-123');
    });

    it('should not fetch when invoiceId is empty', () => {
        const { result } = renderHook(() => useInvoice(''), {
            wrapper: createWrapper(),
        });

        expect(result.current.isFetching).toBe(false);
        expect(billingService.getInvoice).not.toHaveBeenCalled();
    });

    it('should handle null invoice URL', async () => {
        vi.mocked(billingService.getInvoice).mockResolvedValue(null);

        const { result } = renderHook(() => useInvoice('inv-404'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBeNull();
    });
});

