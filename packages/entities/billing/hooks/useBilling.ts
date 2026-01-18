import { useQuery } from '@tanstack/react-query';
import { billingService } from '../services/billingService';
import { billingKeys } from '../keys';

/**
 * Hook to fetch billing history for a user
 */
export const useBillingHistory = (userId: string) => {
    return useQuery({
        queryKey: billingKeys.history(userId),
        queryFn: () => billingService.getHistory(userId),
        enabled: !!userId,
    });
};

/**
 * Hook to fetch an invoice URL
 */
export const useInvoice = (invoiceId: string) => {
    return useQuery({
        queryKey: billingKeys.invoice(invoiceId),
        queryFn: () => billingService.getInvoice(invoiceId),
        enabled: !!invoiceId,
    });
};
