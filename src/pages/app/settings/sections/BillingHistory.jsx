import React, { useState, useEffect } from 'react';
import { Card, DataTable, Badge, Button, Dropdown, DropdownItem } from '../../../../components/ui';
import OrganizationSelector from '../../../../components/shared/OrganizationSelector';
import { Download, FileText, ArrowLeft } from 'lucide-react';
import { supabase } from '../../../../lib/supabaseClient';

const BillingHistory = ({ onBack }) => {
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [billingHistory, setBillingHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (selectedOrg) {
            fetchBillingHistory();
        }
    }, [selectedOrg]);

    const fetchBillingHistory = async () => {
        try {
            setLoading(true);
            const { data: invoices, error } = await supabase
                .from('subscription_invoices')
                .select('*')
                .eq('organization_id', selectedOrg)
                .eq('is_active', true)
                .order('invoice_date', { ascending: false });

            if (error) throw error;

            // Transform data to match expected format
            const formattedData = invoices?.map(inv => ({
                id: inv.id,
                date: inv.invoice_date,
                description: inv.description,
                amount: `$${parseFloat(inv.amount).toFixed(2)}`,
                status: inv.status,
                invoiceUrl: inv.invoice_url || inv.invoice_pdf_url || '#'
            })) || [];

            setBillingHistory(formattedData);
        } catch (error) {
            console.error('Error fetching billing history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = (format) => {
        // TODO: Implement actual export logic for each format
        alert(`Exporting as ${format.toUpperCase()}...`);
    };

    const columns = [
        {
            id: 'date',
            label: 'Date',
            sortable: true,
            render: (value) => new Date(value).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        },
        {
            id: 'description',
            label: 'Description',
            sortable: false
        },
        {
            id: 'amount',
            label: 'Amount',
            sortable: true
        },
        {
            id: 'status',
            label: 'Status',
            sortable: true,
            render: (value) => (
                <Badge
                    variant="light"
                    type={value === 'paid' ? 'success' : value === 'pending' ? 'warning' : 'error'}
                >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </Badge>
            )
        },
        {
            id: 'actions',
            label: 'Invoice',
            sortable: false,
            render: (value, row) => (
                <Button
                    variant="ghost"
                    size="s"
                    onClick={() => window.open(row.invoiceUrl, '_blank')}
                >
                    <Download size={16} className="margin-right-2" />
                    Download
                </Button>
            )
        }
    ];

    return (
        <div className="billing-history">
            <div className="profile-section__header">
                <div>
                    {onBack && (
                        <Button
                            variant="ghost"
                            size="s"
                            onClick={onBack}
                            className="margin-bottom-3"
                        >
                            <ArrowLeft size={16} className="margin-right-2" />
                            Back to Billing
                        </Button>
                    )}
                    <h2 className="profile-section__title">
                        <FileText size={24} className="margin-right-2" />
                        Billing History
                    </h2>
                    <p className="profile-section__subtitle">View and download your past invoices</p>
                </div>
                <div className="flex items-center gap-3">
                    <OrganizationSelector
                        value={selectedOrg}
                        onChange={setSelectedOrg}
                    />
                    {billingHistory.length > 0 && (
                        <Dropdown
                            trigger={
                                <Button variant="outline" size="s">
                                    <Download size={16} className="margin-right-2" />
                                    Export
                                </Button>
                            }
                        >
                            <DropdownItem onClick={() => handleExport('pdf')}>
                                Export as PDF
                            </DropdownItem>
                            <DropdownItem onClick={() => handleExport('csv')}>
                                Export as CSV
                            </DropdownItem>
                            <DropdownItem onClick={() => handleExport('xls')}>
                                Export as Excel
                            </DropdownItem>
                        </Dropdown>
                    )}
                </div>
            </div>

            <div className="profile-section__content margin-top-6">
                <Card>
                    {loading ? (
                        <div className="padding-6">Loading...</div>
                    ) : billingHistory.length > 0 ? (
                        <DataTable
                            data={billingHistory}
                            columns={columns}
                            searchable={false}
                            pagination={true}
                            itemsPerPage={10}
                        />
                    ) : (
                        <div className="text-center padding-6">
                            <FileText size={48} className="margin-x-auto margin-bottom-4 text-secondary" />
                            <h3 className="margin-bottom-2">No billing history</h3>
                            <p className="text-secondary">Your invoices will appear here once you subscribe to a paid plan.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default BillingHistory;
