/**
 * usePaymentMethods Hook Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { usePaymentMethods, usePaymentMethodIcons } from '../usePaymentMethods';
import { paymentService } from '../../services/paymentService';
import type { PaymentMethod, PaymentMethodIcon } from '../../interfaces';

// Mock dependencies
vi.mock('../../services/paymentService', () => ({
    paymentService: {
        getPaymentMethods: vi.fn(),
        getPaymentMethodIcons: vi.fn(),
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
        <QueryClientProvider client={queryClient} > {children} </QueryClientProvider>
    );
};

describe('usePaymentMethods', () => {
    beforeEach(() => {
        console.log('paymentService in test:', paymentService);
        vi.clearAllMocks();
    });

    it('should fetch payment methods and icons on mount', async () => {
        const mockMethods: PaymentMethod[] = [
            {
                id: 'pm1',
                organization_id: 'org1',
                provider: 'stripe',
                provider_payment_method_id: 'pm_test',
                is_default: true,
                card_brand: 'visa',
                last_four: '4242',
                expiry_month: 12,
                expiry_year: 2025,
                is_active: true,
            },
        ];
        const mockIcons: PaymentMethodIcon[] = [
            { id: 'icon-1', brand: 'visa', icon_url: 'https://example.com/visa.png' },
        ];

        vi.mocked(paymentService.getPaymentMethods).mockResolvedValue(mockMethods);
        vi.mocked(paymentService.getPaymentMethodIcons).mockResolvedValue(mockIcons);

        const { result } = renderHook(() => usePaymentMethods('org1'), { wrapper: createWrapper() });

        // Initial state
        expect(result.current.isLoading).toBe(true);

        // Wait for fetch
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.data).toEqual(mockMethods);
        expect(paymentService.getPaymentMethods).toHaveBeenCalledWith('org1');
    });

    it('should fetch payment icons', async () => {
        const mockIcons: PaymentMethodIcon[] = [
            { id: 'icon-1', brand: 'visa', icon_url: 'https://example.com/visa.png' },
        ];
        vi.mocked(paymentService.getPaymentMethodIcons).mockResolvedValue(mockIcons);

        const { result } = renderHook(() => usePaymentMethodIcons(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.data).toEqual(mockIcons);
        expect(paymentService.getPaymentMethodIcons).toHaveBeenCalled();
    });

    it('should handle empty organization id', async () => {
        const { result } = renderHook(() => usePaymentMethods(''), { wrapper: createWrapper() });

        // Should not fetch if org id is empty
        expect(result.current.data).toBeUndefined();
        expect(paymentService.getPaymentMethods).not.toHaveBeenCalled();
    });
});





