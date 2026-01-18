/**
 * Billing Repository Interface
 */
import { IBillingHistory } from '../../billing/interfaces/IBillingHistory';

import type { IVersionedRepository } from '../../_infrastructure/interfaces';
export interface IBillingRepository extends IVersionedRepository {
    readonly version: '1.0.0';
    getHistory(userId: string): Promise<IBillingHistory[]>;
    getInvoice(invoiceId: string): Promise<string | null>;
}


