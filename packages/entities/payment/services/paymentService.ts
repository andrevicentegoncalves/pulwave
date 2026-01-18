/**
 * Payment Service
 * Domain logic for payment methods.
 */
import { dataProvider } from '@pulwave/entity-infrastructure';
// Assuming types exist or can be inferred, but good to be explicit if interfaces are available
// import { IPaymentMethod } from '../../payment/interfaces/IPaymentMethod';

export const paymentService = {
    // Expose repository methods or add domain logic here
    // For now, mirroring the repository structure pattern
    getPaymentMethods: (orgId: string) => dataProvider.payment.findAll(orgId),
    getPaymentMethodMethods: (id: string) => dataProvider.payment.findById(id), // naming? findById
    createPaymentMethod: (data: any) => dataProvider.payment.create(data),
    updatePaymentMethod: (id: string, data: any) => dataProvider.payment.update(id, data),
    deletePaymentMethod: (id: string) => dataProvider.payment.softDelete(id),
    setDefaultPaymentMethod: (orgId: string, id: string) => dataProvider.payment.update(id, { is_default: true }), // logic? usually repo handles unsetAll
    getPaymentMethodIcons: () => dataProvider.payment.getIcons(),
    retryVerification: (id: string) => Promise.resolve(), // Placeholder or needs repo support?
    repository: dataProvider.payment,
};

export default paymentService;



