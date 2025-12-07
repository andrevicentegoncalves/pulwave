// src/pages/app/settings/sections/payment/PaymentMethods.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Card, Button, ConfirmationModal, Spinner,
    CreditCard, Plus, ArrowLeft, Shield, RefreshCw, Building2
} from '@ui';
import { OrganizationSelector, PaymentMethodCard } from '@shared';
import AddPaymentMethod from './AddPaymentMethod';
import EditPaymentMethod from './EditPaymentMethod';
import { usePaymentMethods, usePaymentMutations } from '@hooks/usePaymentMethods';
import { getMethodTypeIcon } from '@utils/paymentHelpers.jsx';

/**
 * PaymentMethods - Comprehensive payment method management
 * 
 * Features:
 * - Display payment methods with brand icons from database
 * - Verification status indicators
 * - Usage tracking (last used, failure count)
 * - Support for cards, bank accounts, PayPal, crypto, regional methods
 * - Set default, edit, delete functionality
 * - Expiring card warnings
 * 
 * Uses React Query for caching and optimistic updates.
 */
const PaymentMethods = ({ onBack }) => {
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editModal, setEditModal] = useState({ isOpen: false, method: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });

    // React Query hooks for data fetching and mutations
    const {
        data: paymentMethods = [],
        isLoading: loading,
        isFetching: refreshing,
        refetch
    } = usePaymentMethods(selectedOrg);

    const {
        setDefaultPaymentMethod,
        deletePaymentMethod
    } = usePaymentMutations(selectedOrg);

    const handleSetDefault = async (id) => {
        try {
            await setDefaultPaymentMethod.mutateAsync(id);
        } catch (error) {
            console.error('Error setting default payment method:', error);
        }
    };

    const confirmDelete = (method) => {
        setDeleteModal({
            isOpen: true,
            id: method.id,
            name: method.computed_display_name || `${method.card_brand} •••• ${method.last_four}`
        });
    };

    const handleDelete = async () => {
        const id = deleteModal.id;
        if (!id) return;

        try {
            await deletePaymentMethod.mutateAsync(id);
        } catch (error) {
            console.error('Error deleting payment method:', error);
        } finally {
            setDeleteModal({ isOpen: false, id: null, name: '' });
        }
    };

    const handleEdit = (method) => {
        setEditModal({ isOpen: true, method });
    };

    // Group methods by type
    const groupedMethods = paymentMethods.reduce((acc, method) => {
        const type = method.method_type || 'other';
        if (!acc[type]) acc[type] = [];
        acc[type].push(method);
        return acc;
    }, {});

    const typeLabels = {
        card: 'Cards',
        bank_account: 'Bank Accounts',
        paypal: 'PayPal',
        digital_wallet: 'Digital Wallets',
        crypto: 'Cryptocurrency',
        other: 'Other Methods'
    };

    return (
        <div className="payment-methods">
            {/* Header */}
            <div className="payment-methods__header">
                <div className="payment-methods__header-content">
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
                    <h2 className="payment-methods__title">
                        <CreditCard size={24} className="margin-right-3" />
                        Payment Methods
                    </h2>
                    <p className="payment-methods__subtitle">
                        Manage your saved payment methods for subscriptions and one-time payments
                    </p>
                </div>

                <div className="payment-methods__header-actions">
                    <OrganizationSelector
                        value={selectedOrg}
                        onChange={setSelectedOrg}
                    />
                    <Button
                        variant="ghost"
                        size="s"
                        onClick={() => refetch()}
                        disabled={refreshing}
                        aria-label="Refresh payment methods"
                    >
                        <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="payment-methods__content">
                {/* Add New Button */}
                <Card className="payment-methods__add-card">
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={() => setShowAddModal(true)}
                        disabled={!selectedOrg}
                    >
                        <Plus size={16} className="margin-right-2" />
                        Add New Payment Method
                    </Button>
                </Card>

                {/* Loading State */}
                {loading ? (
                    <Card className="payment-methods__loading">
                        <Spinner size="m" />
                        <span>Loading payment methods...</span>
                    </Card>
                ) : !selectedOrg ? (
                    <Card className="payment-methods__empty">
                        <Building2 size={48} className="payment-methods__empty-icon" />
                        <h3>Select an Organization</h3>
                        <p>Choose an organization to manage its payment methods.</p>
                    </Card>
                ) : paymentMethods.length > 0 ? (
                    /* Payment Methods List - Grouped by Type */
                    <div className="payment-methods__list">
                        {Object.entries(groupedMethods).map(([type, methods]) => (
                            <div key={type} className="payment-methods__group">
                                {Object.keys(groupedMethods).length > 1 && (
                                    <h3 className="payment-methods__group-title">
                                        {getMethodTypeIcon(type)}
                                        {typeLabels[type] || type}
                                        <span className="payment-methods__group-count">
                                            {methods.length}
                                        </span>
                                    </h3>
                                )}
                                <div className="payment-methods__group-list">
                                    {methods.map((method) => (
                                        <PaymentMethodCard
                                            key={method.id}
                                            method={method}
                                            onSetDefault={handleSetDefault}
                                            onEdit={handleEdit}
                                            onDelete={confirmDelete}
                                            isOnlyDefault={method.is_default && paymentMethods.length === 1}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <Card className="payment-methods__empty">
                        <CreditCard size={48} className="payment-methods__empty-icon" />
                        <h3>No payment methods</h3>
                        <p>Add a payment method to subscribe to paid plans or make payments.</p>
                        <Button
                            variant="primary"
                            onClick={() => setShowAddModal(true)}
                        >
                            <Plus size={16} className="margin-right-2" />
                            Add Payment Method
                        </Button>
                    </Card>
                )}

                {/* Security Notice */}
                <div className="payment-methods__security-notice">
                    <Shield size={14} />
                    <span>
                        Your payment information is encrypted using industry-standard TLS and stored securely.
                        We never store full card numbers on our servers.
                    </span>
                </div>
            </div>

            {/* Add Payment Method Modal */}
            {showAddModal && (
                <AddPaymentMethod
                    organizationId={selectedOrg}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        refetch();
                        setShowAddModal(false);
                    }}
                />
            )}

            {/* Edit Payment Method Modal */}
            {editModal.isOpen && (
                <EditPaymentMethod
                    method={editModal.method}
                    onClose={() => setEditModal({ isOpen: false, method: null })}
                    onSuccess={() => {
                        refetch();
                        setEditModal({ isOpen: false, method: null });
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null, name: '' })}
                onConfirm={handleDelete}
                title="Remove Payment Method"
                message={`Are you sure you want to remove "${deleteModal.name}"? This action cannot be undone.`}
                confirmText="Remove"
                variant="danger"
            />
        </div>
    );
};

PaymentMethods.propTypes = {
    /** Callback to navigate back to billing */
    onBack: PropTypes.func
};

export default PaymentMethods;