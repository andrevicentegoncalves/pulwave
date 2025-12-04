import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../../components/ui';
import OrganizationSelector from '../../../../components/shared/OrganizationSelector';
import AddPaymentMethod from './AddPaymentMethod';
import { CreditCard, Plus, Trash2, Check, ArrowLeft } from 'lucide-react';
import { supabase } from '../../../../lib/supabaseClient';

const PaymentMethods = ({ onBack }) => {
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        if (selectedOrg) {
            fetchPaymentMethods();
        }
    }, [selectedOrg]);

    const fetchPaymentMethods = async () => {
        try {
            setLoading(true);
            const { data: methods, error } = await supabase
                .from('payment_methods')
                .select('*')
                .eq('organization_id', selectedOrg)
                .eq('is_active', true)
                .order('is_default', { ascending: false });

            if (error) throw error;

            // Transform data to match expected format
            const formattedData = methods?.map(method => ({
                id: method.id,
                type: method.payment_type,
                brand: method.card_brand,
                last4: method.last_four,
                expiryMonth: method.expiry_month,
                expiryYear: method.expiry_year,
                isDefault: method.is_default
            })) || [];

            setPaymentMethods(formattedData);
        } catch (error) {
            console.error('Error fetching payment methods:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const { error } = await supabase
                .from('payment_methods')
                .update({ is_default: true })
                .eq('id', id);

            if (error) throw error;

            // Refresh list
            fetchPaymentMethods();
        } catch (error) {
            console.error('Error setting default payment method:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this payment method?')) {
            try {
                const { error } = await supabase
                    .from('payment_methods')
                    .update({ is_active: false })
                    .eq('id', id);

                if (error) throw error;

                // Refresh list
                fetchPaymentMethods();
            } catch (error) {
                console.error('Error deleting payment method:', error);
            }
        }
    };

    const getCardIcon = (brand) => {
        return <CreditCard size={24} />;
    };

    return (
        <div className="payment-methods">
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
                        <CreditCard size={24} className="margin-right-2" />
                        Payment Methods
                    </h2>
                    <p className="profile-section__subtitle">Manage your saved payment methods</p>
                </div>
                <OrganizationSelector
                    value={selectedOrg}
                    onChange={setSelectedOrg}
                />
            </div>

            <div className="profile-section__content">
                <Card className="margin-bottom-4">
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={() => setShowAddModal(true)}
                    >
                        <Plus size={16} className="margin-right-2" />
                        Add New Payment Method
                    </Button>
                </Card>

                {loading ? (
                    <Card><div className="padding-6">Loading...</div></Card>
                ) : paymentMethods.length > 0 ? (
                    <div className="flex flex-column gap-4">
                        {paymentMethods.map((method) => (
                            <Card key={method.id}>
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="text-primary">
                                            {getCardIcon(method.brand)}
                                        </div>
                                        <div>
                                            <div className="font-semibold margin-bottom-1">
                                                {method.brand} •••• {method.last4}
                                            </div>
                                            <div className="text-sm text-secondary">
                                                Expires {method.expiryMonth}/{method.expiryYear}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {method.isDefault ? (
                                            <Badge variant="light" type="success">
                                                <Check size={12} className="margin-right-1" />
                                                Default
                                            </Badge>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="s"
                                                onClick={() => handleSetDefault(method.id)}
                                            >
                                                Set as Default
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="s"
                                            onClick={() => handleDelete(method.id)}
                                            disabled={method.isDefault && paymentMethods.length === 1}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <div className="text-center padding-6">
                            <CreditCard size={48} className="margin-x-auto margin-bottom-4 text-secondary" />
                            <h3 className="margin-bottom-2">No payment methods</h3>
                            <p className="text-secondary margin-bottom-4">
                                Add a payment method to subscribe to paid plans.
                            </p>
                            <Button
                                variant="primary"
                                onClick={() => setShowAddModal(true)}
                            >
                                <Plus size={16} className="margin-right-2" />
                                Add Payment Method
                            </Button>
                        </div>
                    </Card>
                )}
            </div>

            {/* Add Payment Method Modal */}
            {showAddModal && (
                <AddPaymentMethod
                    organizationId={selectedOrg}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={fetchPaymentMethods}
                />
            )}
        </div>
    );
};

export default PaymentMethods;
