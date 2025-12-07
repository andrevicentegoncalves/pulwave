// src/hooks/usePaymentMethods.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../services';

/**
 * Query key factory for payment methods
 */
export const paymentKeys = {
    all: ['payment-methods'],
    lists: () => [...paymentKeys.all, 'list'],
    list: (orgId) => [...paymentKeys.lists(), orgId],
    details: () => [...paymentKeys.all, 'detail'],
    detail: (id) => [...paymentKeys.details(), id],
    icons: () => [...paymentKeys.all, 'icons'],
};

/**
 * Hook to fetch payment methods for an organization
 * @param {string} organizationId - Organization UUID
 * @param {Object} options - Additional React Query options
 */
export const usePaymentMethods = (organizationId, options = {}) => {
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
export const usePaymentMethodIcons = (options = {}) => {
    return useQuery({
        queryKey: paymentKeys.icons(),
        queryFn: () => paymentService.getPaymentMethodIcons(),
        staleTime: 1000 * 60 * 30, // 30 minutes - icons rarely change
        ...options,
    });
};

/**
 * Hook for payment method mutations (create, update, delete)
 * @param {string} organizationId - Organization UUID for cache invalidation
 */
export const usePaymentMutations = (organizationId) => {
    const queryClient = useQueryClient();

    const invalidatePaymentMethods = () => {
        queryClient.invalidateQueries({ queryKey: paymentKeys.list(organizationId) });
    };

    const createPaymentMethod = useMutation({
        mutationFn: (data) => paymentService.createPaymentMethod(data),
        onSuccess: () => {
            invalidatePaymentMethods();
        },
    });

    const updatePaymentMethod = useMutation({
        mutationFn: ({ id, updates }) => paymentService.updatePaymentMethod(id, updates),
        onSuccess: () => {
            invalidatePaymentMethods();
        },
    });

    const deletePaymentMethod = useMutation({
        mutationFn: (id) => paymentService.deletePaymentMethod(id),
        onSuccess: () => {
            invalidatePaymentMethods();
        },
    });

    const setDefaultPaymentMethod = useMutation({
        mutationFn: (id) => paymentService.setDefaultPaymentMethod(id, organizationId),
        onSuccess: () => {
            invalidatePaymentMethods();
        },
    });

    const retryVerification = useMutation({
        mutationFn: (id) => paymentService.retryVerification(id),
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

export default usePaymentMethods;
