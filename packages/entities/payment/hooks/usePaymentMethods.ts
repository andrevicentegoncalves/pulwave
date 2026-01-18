/**
 * Payment Methods Hook
 * Wrapper around React Query for payment operations.
 * 
 * @package @foundation/hooks
 */
import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { paymentService } from '../../payment/services/paymentService';
import type { PaymentMethod } from '../../payment/interfaces';

import { paymentKeys } from '../keys';

/**
 * Hook to fetch payment methods for an organization
 */
export const usePaymentMethods = (organizationId: string, options: Partial<UseQueryOptions<PaymentMethod[], Error>> = {}) => {
    return useQuery({
        queryKey: paymentKeys.list(organizationId),
        queryFn: () => paymentService.getPaymentMethods(organizationId),
        enabled: !!organizationId,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
};

/**
 * Hook to fetch payment method icons
 */
export const usePaymentMethodIcons = (options: Partial<UseQueryOptions<any[], Error>> = {}) => {
    return useQuery({
        queryKey: paymentKeys.icons(),
        queryFn: () => paymentService.getPaymentMethodIcons(),
        staleTime: 1000 * 60 * 30, // 30 minutes - icons rarely change
        ...options,
    });
};

/**
 * Hook for payment method mutations (create, update, delete)
 */
export const usePaymentMutations = (organizationId: string) => {
    const queryClient = useQueryClient();

    const invalidatePaymentMethods = () => {
        queryClient.invalidateQueries({ queryKey: paymentKeys.list(organizationId) });
    };

    const createPaymentMethod = useMutation({
        mutationFn: (data: any) => paymentService.createPaymentMethod(data),
        onSuccess: () => {
            invalidatePaymentMethods();
        },
    });

    const updatePaymentMethod = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<PaymentMethod> }) => paymentService.updatePaymentMethod(id, updates),
        onSuccess: () => {
            invalidatePaymentMethods();
        },
    });

    const deletePaymentMethod = useMutation({
        mutationFn: (id: string) => paymentService.deletePaymentMethod(id),
        onSuccess: () => {
            invalidatePaymentMethods();
        },
    });

    const setDefaultPaymentMethod = useMutation({
        mutationFn: (id: string) => paymentService.setDefaultPaymentMethod(id, organizationId),
        onSuccess: () => {
            invalidatePaymentMethods();
        },
    });

    const retryVerification = useMutation({
        mutationFn: (id: string) => paymentService.retryVerification(id),
        onSuccess: () => {
            invalidatePaymentMethods();
        },
    });

    return {
        createPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        setDefaultPaymentMethod,
        retryVerification,
    };
};





