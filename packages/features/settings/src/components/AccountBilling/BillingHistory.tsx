/**
 * BillingHistory Sub-Section
 * 
 * Shows billing history and invoices.
 * 
 * @package @pulwave/experience-settings
 */
import { useState, useEffect } from 'react';
import { Card, Button, SectionHeader, Skeleton, EmptyState } from '@pulwave/ui';
import { ArrowLeft, FileText, Download } from '@pulwave/ui';

interface Invoice {
    id: string;
    date: string;
    amount: string;
    status: 'paid' | 'pending' | 'failed';
    description: string;
}

export interface BillingHistoryProps {
    onBack?: () => void;
}

/**
 * BillingHistory - Shows billing history and invoices
 */
export const BillingHistory = ({ onBack }: BillingHistoryProps) => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                setLoading(true);
                // TODO: Implement actual invoice fetching from Supabase
                // For now, simulate empty state
                await new Promise(resolve => setTimeout(resolve, 500));
                setInvoices([]);
            } catch {
                // Silent error handling for invoice fetch
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    return (
        <div className="profile-section">
            <div className="profile-section__header--with-back">
                {onBack && (
                    <Button variant="ghost" size="s" onClick={onBack}>
                        <ArrowLeft size={16} className="margin-right-2" aria-hidden="true" />
                        Back to Billing
                    </Button>
                )}
                <SectionHeader icon={FileText} title="Billing History" />
            </div>
            <div className="profile-section__cards">
                <Card>
                    {loading ? (
                        <div className="billing-history__loading">
                            <Skeleton variant="rectangular" height={60} />
                            <Skeleton variant="rectangular" height={60} />
                            <Skeleton variant="rectangular" height={60} />
                        </div>
                    ) : invoices.length === 0 ? (
                        <EmptyState
                            icon={<FileText size={48} />}
                            title="No billing history"
                            description="You don't have any invoices yet. Invoices will appear here after your first payment."
                        />
                    ) : (
                        <div className="billing-history__list">
                            {invoices.map(invoice => (
                                <div key={invoice.id} className="billing-history__item">
                                    <div className="billing-history__item-info">
                                        <span className="billing-history__date">{invoice.date}</span>
                                        <span className="billing-history__description">{invoice.description}</span>
                                    </div>
                                    <div className="billing-history__item-actions">
                                        <span className="billing-history__amount">{invoice.amount}</span>
                                        <span className={`billing-history__status billing-history__status--${invoice.status}`}>
                                            {invoice.status}
                                        </span>
                                        <Button variant="ghost" size="s" aria-label="Download invoice">
                                            <Download size={14} aria-hidden="true" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

BillingHistory.displayName = 'BillingHistory';

export default BillingHistory;
