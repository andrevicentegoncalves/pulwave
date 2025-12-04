import React, { useState, useEffect } from 'react';
import { Modal, Card, Input, Button, Checkbox, Select } from '../../../../components/ui';
import { CreditCard, Lock, X, AlertCircle } from 'lucide-react';
import { useCardValidation } from '../../../../hooks/useCardValidation';
import { supabase } from '../../../../lib/supabaseClient';
import './AddPaymentMethod.scss';

const AddPaymentMethod = ({ organizationId, onClose, onSuccess }) => {
    const [paymentType, setPaymentType] = useState('card');
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        paypalEmail: '',
        bankAccountNumber: '',
        routingNumber: '',
        isDefault: false,
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [cardBrand, setCardBrand] = useState(null);

    const {
        detectCardBrand,
        formatCardNumber,
        formatExpiry,
        validateCardNumber,
        validateExpiry,
        validateCVV,
        validateName,
        getCVVLength,
        getCardBrandName,
    } = useCardValidation();

    // Detect card brand as user types
    useEffect(() => {
        if (formData.cardNumber) {
            const brand = detectCardBrand(formData.cardNumber);
            setCardBrand(brand);
        } else {
            setCardBrand(null);
        }
    }, [formData.cardNumber, detectCardBrand]);

    const handleInputChange = (field, value) => {
        let formattedValue = value;

        // Apply formatting
        if (field === 'cardNumber') {
            formattedValue = formatCardNumber(value);
            const maxLength = cardBrand === 'amex' ? 17 : 19;
            formattedValue = formattedValue.slice(0, maxLength);
        } else if (field === 'expiryDate') {
            formattedValue = formatExpiry(value);
            formattedValue = formattedValue.slice(0, 5);
        } else if (field === 'cvv') {
            formattedValue = value.replace(/\D/g, '');
            const maxLength = getCVVLength(cardBrand);
            formattedValue = formattedValue.slice(0, maxLength);
        }

        setFormData(prev => ({ ...prev, [field]: formattedValue }));

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field);
    };

    const validateField = (field) => {
        let validation;

        switch (field) {
            case 'cardNumber':
                validation = validateCardNumber(formData.cardNumber);
                break;
            case 'expiryDate':
                validation = validateExpiry(formData.expiryDate);
                break;
            case 'cvv':
                validation = validateCVV(formData.cvv, cardBrand);
                break;
            case 'cardholderName':
                validation = validateName(formData.cardholderName);
                break;
            default:
                return;
        }

        if (!validation.valid) {
            setErrors(prev => ({ ...prev, [field]: validation.error }));
        }
    };

    const validateForm = () => {
        if (paymentType !== 'card') return true;

        const newErrors = {};

        const cardValidation = validateCardNumber(formData.cardNumber);
        if (!cardValidation.valid) newErrors.cardNumber = cardValidation.error;

        const expiryValidation = validateExpiry(formData.expiryDate);
        if (!expiryValidation.valid) newErrors.expiryDate = expiryValidation.error;

        const cvvValidation = validateCVV(formData.cvv, cardBrand);
        if (!cvvValidation.valid) newErrors.cvv = cvvValidation.error;

        const nameValidation = validateName(formData.cardholderName);
        if (!nameValidation.valid) newErrors.cardholderName = nameValidation.error;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            let paymentData = {
                organization_id: organizationId,
                profile_id: user.id,
                payment_type: paymentType,
                is_default: formData.isDefault,
            };

            if (paymentType === 'card') {
                const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
                const lastFour = cleanCardNumber.slice(-4);
                const [expiryMonth, expiryYear] = formData.expiryDate.split('/');

                paymentData = {
                    ...paymentData,
                    card_brand: cardBrand,
                    last_four: lastFour,
                    expiry_month: expiryMonth,
                    expiry_year: expiryYear,
                    cardholder_name: formData.cardholderName,
                };
            } else if (paymentType === 'paypal') {
                paymentData = {
                    ...paymentData,
                    paypal_email: formData.paypalEmail,
                };
            } else if (paymentType === 'bank_account') {
                paymentData = {
                    ...paymentData,
                    last_four: formData.bankAccountNumber.slice(-4),
                    routing_number_last_four: formData.routingNumber.slice(-4),
                    cardholder_name: formData.cardholderName,
                };
            }

            const { error } = await supabase
                .from('payment_methods')
                .insert(paymentData);

            if (error) throw error;

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving payment method:', error);
            setErrors({ submit: 'Failed to save payment method. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const getCardIcon = () => {
        if (!cardBrand) return <CreditCard size={20} />;
        return <CreditCard size={20} />;
    };

    return (
        <Modal isOpen onClose={onClose} size="s">
            <div className="add-payment-method">
                <div className="add-payment-method__header">
                    <h2>
                        <CreditCard size={20} className="margin-right-2" />
                        Add Payment Method
                    </h2>
                    <Button variant="ghost" size="s" onClick={onClose}>
                        <X size={18} />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="add-payment-method__form">
                    {/* Payment Type Selector */}
                    <div className="form-group">
                        <Select
                            label="Payment Method Type"
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
                        >
                            <option value="card">Credit/Debit Card</option>
                            <option value="paypal">PayPal</option>
                            <option value="bank_account">Bank Account</option>
                        </Select>
                    </div>

                    {/* Card Payment Form */}
                    {paymentType === 'card' && (
                        <>
                            <div className="form-group">
                                <Input
                                    label="Card Number"
                                    value={formData.cardNumber}
                                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                    onBlur={() => handleBlur('cardNumber')}
                                    placeholder="1234 5678 9012 3456"
                                    error={touched.cardNumber && errors.cardNumber}
                                    icon={<CreditCard size={16} />}
                                    autoComplete="cc-number"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <Input
                                        label="Expiry"
                                        value={formData.expiryDate}
                                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                        onBlur={() => handleBlur('expiryDate')}
                                        placeholder="MM/YY"
                                        error={touched.expiryDate && errors.expiryDate}
                                        autoComplete="cc-exp"
                                    />
                                </div>

                                <div className="form-group">
                                    <Input
                                        label="CVV"
                                        value={formData.cvv}
                                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                                        onBlur={() => handleBlur('cvv')}
                                        placeholder="123"
                                        error={touched.cvv && errors.cvv}
                                        type="password"
                                        autoComplete="cc-csc"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <Input
                                    label="Cardholder Name"
                                    value={formData.cardholderName}
                                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                                    onBlur={() => handleBlur('cardholderName')}
                                    placeholder="John Doe"
                                    error={touched.cardholderName && errors.cardholderName}
                                    autoComplete="cc-name"
                                />
                            </div>
                        </>
                    )}

                    {/* PayPal Payment Form */}
                    {paymentType === 'paypal' && (
                        <div className="form-group">
                            <Input
                                label="PayPal Email"
                                type="email"
                                value={formData.paypalEmail}
                                onChange={(e) => handleInputChange('paypalEmail', e.target.value)}
                                placeholder="your@email.com"
                                autoComplete="email"
                            />
                        </div>
                    )}

                    {/* Bank Account Payment Form */}
                    {paymentType === 'bank_account' && (
                        <>
                            <div className="form-group">
                                <Input
                                    label="Account Holder Name"
                                    value={formData.cardholderName}
                                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <Input
                                        label="Account Number"
                                        value={formData.bankAccountNumber}
                                        onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                                        placeholder="000123456789"
                                    />
                                </div>
                                <div className="form-group">
                                    <Input
                                        label="Routing Number"
                                        value={formData.routingNumber}
                                        onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                                        placeholder="110000000"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <Checkbox
                            checked={formData.isDefault}
                            onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                            label="Set as default payment method"
                        />
                    </div>

                    {/* Security Notice */}
                    <div className="security-notice">
                        <Lock size={14} />
                        <span>Your payment information is encrypted and secure</span>
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="error-message">
                            <AlertCircle size={14} />
                            <span>{errors.submit}</span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="add-payment-method__actions">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            disabled={loading}
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddPaymentMethod;
