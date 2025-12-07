import React, { useState, useEffect, useMemo } from 'react';
import {
    Modal, Card, Input, Button, Checkbox, Select, Badge,
    CreditCard, Lock, X, AlertCircle, Building2, Wallet,
    Smartphone, Bitcoin, Globe, ChevronRight, Info, CheckCircle2
} from '../../../../../components/ui';
import { useCardValidation } from '../../../../../hooks/useCardValidation';
import { supabase } from '../../../../../lib/supabaseClient';
import clsx from 'clsx';

/**
 * AddPaymentMethod - Comprehensive payment method creation modal
 * 
 * Supports:
 * - Credit/Debit Cards (Visa, Mastercard, Amex, Discover, JCB, UnionPay, Diners)
 * - Bank Accounts (ACH, SEPA, Wire)
 * - Digital Wallets (PayPal, Apple Pay, Google Pay)
 * - Regional Methods (Multibanco, MB WAY, PIX, iDEAL, Bancontact, etc.)
 * - Cryptocurrency (Bitcoin, Ethereum, USDC, USDT)
 */
const AddPaymentMethod = ({ organizationId, onClose, onSuccess }) => {
    // State
    const [activeTab, setActiveTab] = useState('card');
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [formData, setFormData] = useState({
        // Card fields
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        // Bank fields
        bankName: '',
        accountHolderName: '',
        accountNumber: '',
        routingNumber: '',
        accountType: 'checking',
        iban: '',
        swiftBic: '',
        // PayPal
        paypalEmail: '',
        // Crypto
        cryptoCurrency: 'bitcoin',
        walletAddress: '',
        cryptoNetwork: 'mainnet',
        // Regional
        phoneNumber: '', // For MB WAY
        // Common
        displayLabel: '',
        isDefault: false,
        country: 'US',
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [cardBrand, setCardBrand] = useState(null);
    const [availableIcons, setAvailableIcons] = useState([]);
    const [step, setStep] = useState(1); // 1: Select method, 2: Enter details

    // Card validation hook
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

    // Fetch available payment method icons
    useEffect(() => {
        const fetchIcons = async () => {
            const { data, error } = await supabase
                .from('payment_method_icons')
                .select('*')
                .eq('is_enabled', true)
                .order('display_order');

            if (!error && data) {
                setAvailableIcons(data);
            }
        };
        fetchIcons();
    }, []);

    // Detect card brand
    useEffect(() => {
        if (formData.cardNumber) {
            const brand = detectCardBrand(formData.cardNumber);
            setCardBrand(brand);
        } else {
            setCardBrand(null);
        }
    }, [formData.cardNumber, detectCardBrand]);

    // Payment method categories
    const methodCategories = useMemo(() => [
        {
            id: 'card',
            label: 'Cards',
            icon: <CreditCard size={20} />,
            description: 'Credit or debit cards',
            methods: availableIcons.filter(i =>
                ['visa', 'mastercard', 'amex', 'discover', 'diners', 'jcb', 'unionpay'].includes(i.method_code)
            )
        },
        {
            id: 'bank',
            label: 'Bank',
            icon: <Building2 size={20} />,
            description: 'Bank transfers & direct debit',
            methods: availableIcons.filter(i =>
                ['bank_transfer', 'ach', 'sepa', 'wire'].includes(i.method_code)
            )
        },
        {
            id: 'wallet',
            label: 'Wallets',
            icon: <Wallet size={20} />,
            description: 'Digital payment wallets',
            methods: availableIcons.filter(i =>
                ['paypal', 'apple_pay', 'google_pay'].includes(i.method_code)
            )
        },
        {
            id: 'regional',
            label: 'Regional',
            icon: <Globe size={20} />,
            description: 'Local payment methods',
            methods: availableIcons.filter(i =>
                ['multibanco', 'mbway', 'pix', 'ideal', 'boleto', 'bancontact', 'sofort', 'giropay'].includes(i.method_code)
            )
        },
        {
            id: 'crypto',
            label: 'Crypto',
            icon: <Bitcoin size={20} />,
            description: 'Cryptocurrency payments',
            methods: availableIcons.filter(i =>
                ['bitcoin', 'ethereum', 'usdc', 'usdt', 'crypto_other'].includes(i.method_code)
            )
        },
    ], [availableIcons]);

    // Get icon for method
    const getIconForMethod = (methodCode) => {
        const icon = availableIcons.find(i => i.method_code === methodCode);
        return icon?.icon_url;
    };

    // Handle input change
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
        } else if (field === 'accountNumber') {
            formattedValue = value.replace(/\D/g, '').slice(0, 17);
        } else if (field === 'routingNumber') {
            formattedValue = value.replace(/\D/g, '').slice(0, 9);
        } else if (field === 'phoneNumber') {
            formattedValue = value.replace(/\D/g, '').slice(0, 15);
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
        let validation = { valid: true, error: null };

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
            case 'accountHolderName':
                validation = validateName(formData[field]);
                break;
            case 'paypalEmail':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.paypalEmail)) {
                    validation = { valid: false, error: 'Invalid email address' };
                }
                break;
            case 'walletAddress':
                if (formData.walletAddress.length < 26) {
                    validation = { valid: false, error: 'Invalid wallet address' };
                }
                break;
            case 'routingNumber':
                if (formData.routingNumber.length !== 9) {
                    validation = { valid: false, error: 'Routing number must be 9 digits' };
                }
                break;
            case 'accountNumber':
                if (formData.accountNumber.length < 4) {
                    validation = { valid: false, error: 'Invalid account number' };
                }
                break;
            case 'phoneNumber':
                if (formData.phoneNumber.length < 9) {
                    validation = { valid: false, error: 'Invalid phone number' };
                }
                break;
            default:
                break;
        }

        if (!validation.valid) {
            setErrors(prev => ({ ...prev, [field]: validation.error }));
        }
        return validation.valid;
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (activeTab === 'card') {
            const cardValidation = validateCardNumber(formData.cardNumber);
            if (!cardValidation.valid) {
                newErrors.cardNumber = cardValidation.error;
                isValid = false;
            }

            const expiryValidation = validateExpiry(formData.expiryDate);
            if (!expiryValidation.valid) {
                newErrors.expiryDate = expiryValidation.error;
                isValid = false;
            }

            const cvvValidation = validateCVV(formData.cvv, cardBrand);
            if (!cvvValidation.valid) {
                newErrors.cvv = cvvValidation.error;
                isValid = false;
            }

            const nameValidation = validateName(formData.cardholderName);
            if (!nameValidation.valid) {
                newErrors.cardholderName = nameValidation.error;
                isValid = false;
            }
        } else if (activeTab === 'bank') {
            if (!formData.accountHolderName.trim()) {
                newErrors.accountHolderName = 'Account holder name is required';
                isValid = false;
            }
            if (selectedMethod === 'ach') {
                if (formData.routingNumber.length !== 9) {
                    newErrors.routingNumber = 'Routing number must be 9 digits';
                    isValid = false;
                }
                if (formData.accountNumber.length < 4) {
                    newErrors.accountNumber = 'Invalid account number';
                    isValid = false;
                }
            } else if (selectedMethod === 'sepa' && !formData.iban) {
                newErrors.iban = 'IBAN is required';
                isValid = false;
            }
        } else if (activeTab === 'wallet') {
            if (selectedMethod === 'paypal' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.paypalEmail)) {
                newErrors.paypalEmail = 'Invalid email address';
                isValid = false;
            }
        } else if (activeTab === 'regional') {
            if (selectedMethod === 'mbway' && formData.phoneNumber.length < 9) {
                newErrors.phoneNumber = 'Valid phone number is required for MB WAY';
                isValid = false;
            }
        } else if (activeTab === 'crypto') {
            if (formData.walletAddress.length < 26) {
                newErrors.walletAddress = 'Invalid wallet address';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            // Determine method type and icon
            let methodType = activeTab;
            let iconId = null;
            let paymentData = {
                organization_id: organizationId,
                profile_id: user.id,
                is_default: formData.isDefault,
                display_label: formData.displayLabel || null,
                country: formData.country,
            };

            if (activeTab === 'card') {
                const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
                const [expiryMonth, expiryYear] = formData.expiryDate.split('/');

                // Find icon for card brand
                const brandIcon = availableIcons.find(i => i.method_code === cardBrand);

                paymentData = {
                    ...paymentData,
                    payment_type: 'card',
                    method_type: 'card',
                    card_brand: cardBrand,
                    last_four: cleanCardNumber.slice(-4),
                    expiry_month: expiryMonth,
                    expiry_year: expiryYear,
                    cardholder_name: formData.cardholderName,
                    icon_id: brandIcon?.id || null,
                    verification_status: 'pending',
                };
            } else if (activeTab === 'bank') {
                const bankIcon = availableIcons.find(i => i.method_code === selectedMethod);

                paymentData = {
                    ...paymentData,
                    payment_type: selectedMethod === 'ach' ? 'ach' : selectedMethod === 'sepa' ? 'bank-transfer' : 'wire-transfer',
                    method_type: 'bank_account',
                    bank_name: formData.bankName,
                    cardholder_name: formData.accountHolderName,
                    account_number_last_four: formData.accountNumber.slice(-4),
                    routing_number_last_four: formData.routingNumber ? formData.routingNumber.slice(-4) : null,
                    account_type: formData.accountType,
                    icon_id: bankIcon?.id || null,
                    verification_status: 'pending',
                };
            } else if (activeTab === 'wallet') {
                const walletIcon = availableIcons.find(i => i.method_code === selectedMethod);

                if (selectedMethod === 'paypal') {
                    paymentData = {
                        ...paymentData,
                        payment_type: 'paypal',
                        method_type: 'paypal',
                        paypal_email: formData.paypalEmail,
                        icon_id: walletIcon?.id || null,
                        verification_status: 'verified', // PayPal self-verifies
                    };
                } else {
                    // Apple Pay / Google Pay - requires device verification
                    paymentData = {
                        ...paymentData,
                        payment_type: selectedMethod === 'apple_pay' ? 'apple-pay' : 'google-pay',
                        method_type: 'digital_wallet',
                        icon_id: walletIcon?.id || null,
                        verification_status: 'requires_action',
                    };
                }
            } else if (activeTab === 'regional') {
                const regionalIcon = availableIcons.find(i => i.method_code === selectedMethod);

                paymentData = {
                    ...paymentData,
                    payment_type: selectedMethod,
                    method_type: 'other',
                    icon_id: regionalIcon?.id || null,
                    verification_status: selectedMethod === 'mbway' ? 'pending' : 'verified',
                    metadata: selectedMethod === 'mbway' ? { phone_number: formData.phoneNumber } : null,
                };
            } else if (activeTab === 'crypto') {
                const cryptoIcon = availableIcons.find(i => i.method_code === formData.cryptoCurrency);

                paymentData = {
                    ...paymentData,
                    payment_type: 'crypto',
                    method_type: 'crypto',
                    crypto_currency: formData.cryptoCurrency,
                    crypto_network: formData.cryptoNetwork,
                    wallet_address: formData.walletAddress,
                    icon_id: cryptoIcon?.id || null,
                    verification_status: 'verified',
                };
            }

            const { error } = await supabase
                .from('payment_methods')
                .insert(paymentData);

            if (error) throw error;

            onSuccess?.();
        } catch (error) {
            console.error('Error saving payment method:', error);
            setErrors({ submit: error.message || 'Failed to save payment method. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    // Render method selection grid
    const renderMethodSelector = (category) => {
        const cat = methodCategories.find(c => c.id === category);
        if (!cat || cat.methods.length === 0) {
            return (
                <div className="method-selector__empty">
                    <Info size={20} />
                    <span>No {cat?.label.toLowerCase()} methods available</span>
                </div>
            );
        }

        return (
            <div className="method-selector__grid">
                {cat.methods.map((method) => (
                    <button
                        key={method.method_code}
                        type="button"
                        className={clsx(
                            'method-selector__item',
                            selectedMethod === method.method_code && 'method-selector__item--selected'
                        )}
                        onClick={() => {
                            setSelectedMethod(method.method_code);
                            if (category === 'card') {
                                setStep(2);
                            }
                        }}
                    >
                        {method.icon_url ? (
                            <img
                                src={method.icon_url}
                                alt={method.display_name}
                                className="method-selector__icon"
                            />
                        ) : (
                            <div className="method-selector__icon-fallback">
                                {cat.icon}
                            </div>
                        )}
                        <span className="method-selector__name">{method.display_name}</span>
                        {selectedMethod === method.method_code && (
                            <CheckCircle2 size={16} className="method-selector__check" />
                        )}
                    </button>
                ))}
            </div>
        );
    };

    // Render card form
    const renderCardForm = () => (
        <div className="add-payment-method__form-section">
            {/* Card Number */}
            <div className="form-group">
                <Input
                    label="Card Number"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    onBlur={() => handleBlur('cardNumber')}
                    placeholder="1234 5678 9012 3456"
                    error={touched.cardNumber && errors.cardNumber}
                    leftIcon={
                        cardBrand && getIconForMethod(cardBrand) ? (
                            <img
                                src={getIconForMethod(cardBrand)}
                                alt={cardBrand}
                                className="payment-input-icon"
                            />
                        ) : (
                            <CreditCard size={16} />
                        )
                    }
                    autoComplete="cc-number"
                    inputMode="numeric"
                />
                {cardBrand && (
                    <span className="form-group__hint">
                        {getCardBrandName(cardBrand)} detected
                    </span>
                )}
            </div>

            {/* Expiry & CVV Row */}
            <div className="form-row">
                <div className="form-group">
                    <Input
                        label="Expiry Date"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        onBlur={() => handleBlur('expiryDate')}
                        placeholder="MM/YY"
                        error={touched.expiryDate && errors.expiryDate}
                        autoComplete="cc-exp"
                        inputMode="numeric"
                    />
                </div>
                <div className="form-group">
                    <Input
                        label={`CVV${cardBrand === 'amex' ? ' (4 digits)' : ''}`}
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        onBlur={() => handleBlur('cvv')}
                        placeholder={cardBrand === 'amex' ? '1234' : '123'}
                        error={touched.cvv && errors.cvv}
                        type="password"
                        autoComplete="cc-csc"
                        inputMode="numeric"
                    />
                </div>
            </div>

            {/* Cardholder Name */}
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
        </div>
    );

    // Render bank form
    const renderBankForm = () => (
        <div className="add-payment-method__form-section">
            {/* Select Bank Method Type */}
            {!selectedMethod && renderMethodSelector('bank')}

            {selectedMethod && (
                <>
                    {/* Account Holder Name */}
                    <div className="form-group">
                        <Input
                            label="Account Holder Name"
                            value={formData.accountHolderName}
                            onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                            onBlur={() => handleBlur('accountHolderName')}
                            placeholder="John Doe"
                            error={touched.accountHolderName && errors.accountHolderName}
                        />
                    </div>

                    {/* Bank Name */}
                    <div className="form-group">
                        <Input
                            label="Bank Name"
                            value={formData.bankName}
                            onChange={(e) => handleInputChange('bankName', e.target.value)}
                            placeholder="Chase Bank"
                        />
                    </div>

                    {/* ACH Fields */}
                    {selectedMethod === 'ach' && (
                        <>
                            <div className="form-row">
                                <div className="form-group">
                                    <Input
                                        label="Routing Number"
                                        value={formData.routingNumber}
                                        onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                                        onBlur={() => handleBlur('routingNumber')}
                                        placeholder="110000000"
                                        error={touched.routingNumber && errors.routingNumber}
                                        inputMode="numeric"
                                    />
                                </div>
                                <div className="form-group">
                                    <Input
                                        label="Account Number"
                                        value={formData.accountNumber}
                                        onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                                        onBlur={() => handleBlur('accountNumber')}
                                        placeholder="000123456789"
                                        error={touched.accountNumber && errors.accountNumber}
                                        type="password"
                                        inputMode="numeric"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <Select
                                    label="Account Type"
                                    value={formData.accountType}
                                    onChange={(e) => handleInputChange('accountType', e.target.value)}
                                >
                                    <option value="checking">Checking</option>
                                    <option value="savings">Savings</option>
                                </Select>
                            </div>
                        </>
                    )}

                    {/* SEPA Fields */}
                    {selectedMethod === 'sepa' && (
                        <div className="form-group">
                            <Input
                                label="IBAN"
                                value={formData.iban}
                                onChange={(e) => handleInputChange('iban', e.target.value.toUpperCase())}
                                onBlur={() => handleBlur('iban')}
                                placeholder="PT50 0002 0123 1234 5678 9015 4"
                                error={touched.iban && errors.iban}
                            />
                        </div>
                    )}

                    {/* Wire Transfer Fields */}
                    {selectedMethod === 'wire' && (
                        <>
                            <div className="form-group">
                                <Input
                                    label="Account Number"
                                    value={formData.accountNumber}
                                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                                    placeholder="000123456789"
                                    type="password"
                                />
                            </div>
                            <div className="form-group">
                                <Input
                                    label="SWIFT/BIC Code"
                                    value={formData.swiftBic}
                                    onChange={(e) => handleInputChange('swiftBic', e.target.value.toUpperCase())}
                                    placeholder="CHASUS33"
                                />
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );

    // Render wallet form
    const renderWalletForm = () => (
        <div className="add-payment-method__form-section">
            {!selectedMethod && renderMethodSelector('wallet')}

            {selectedMethod === 'paypal' && (
                <div className="form-group">
                    <Input
                        label="PayPal Email"
                        type="email"
                        value={formData.paypalEmail}
                        onChange={(e) => handleInputChange('paypalEmail', e.target.value)}
                        onBlur={() => handleBlur('paypalEmail')}
                        placeholder="your@email.com"
                        error={touched.paypalEmail && errors.paypalEmail}
                        autoComplete="email"
                    />
                </div>
            )}

            {(selectedMethod === 'apple_pay' || selectedMethod === 'google_pay') && (
                <div className="add-payment-method__wallet-info">
                    <Smartphone size={48} />
                    <h4>Set up {selectedMethod === 'apple_pay' ? 'Apple Pay' : 'Google Pay'}</h4>
                    <p>
                        After saving, you'll be prompted to verify this payment method
                        on your device. Make sure {selectedMethod === 'apple_pay' ? 'Apple Pay' : 'Google Pay'} is
                        configured on your device.
                    </p>
                </div>
            )}
        </div>
    );

    // Render regional form
    const renderRegionalForm = () => (
        <div className="add-payment-method__form-section">
            {!selectedMethod && renderMethodSelector('regional')}

            {selectedMethod === 'mbway' && (
                <div className="form-group">
                    <Input
                        label="Phone Number"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        onBlur={() => handleBlur('phoneNumber')}
                        placeholder="912345678"
                        error={touched.phoneNumber && errors.phoneNumber}
                        inputMode="tel"
                        leftIcon={<span className="text-secondary">+351</span>}
                    />
                    <span className="form-group__hint">
                        Your MB WAY registered phone number
                    </span>
                </div>
            )}

            {selectedMethod === 'multibanco' && (
                <div className="add-payment-method__info-card">
                    <Info size={20} />
                    <div>
                        <h4>Multibanco Reference</h4>
                        <p>
                            A payment reference will be generated when you make a payment.
                            Use this reference at any Multibanco ATM or through your bank's online service.
                        </p>
                    </div>
                </div>
            )}

            {selectedMethod === 'pix' && (
                <div className="add-payment-method__info-card">
                    <Info size={20} />
                    <div>
                        <h4>PIX Payments</h4>
                        <p>
                            A PIX QR code will be generated for each payment.
                            Scan it with your Brazilian bank app to complete the payment instantly.
                        </p>
                    </div>
                </div>
            )}

            {(selectedMethod === 'ideal' || selectedMethod === 'bancontact' || selectedMethod === 'sofort' || selectedMethod === 'giropay') && (
                <div className="add-payment-method__info-card">
                    <Info size={20} />
                    <div>
                        <h4>Bank Redirect</h4>
                        <p>
                            You'll be redirected to your bank to authorize each payment.
                            This is a secure and instant payment method.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );

    // Render crypto form
    const renderCryptoForm = () => (
        <div className="add-payment-method__form-section">
            {!selectedMethod && renderMethodSelector('crypto')}

            {selectedMethod && (
                <>
                    <div className="form-group">
                        <Select
                            label="Cryptocurrency"
                            value={formData.cryptoCurrency}
                            onChange={(e) => {
                                handleInputChange('cryptoCurrency', e.target.value);
                                setSelectedMethod(e.target.value);
                            }}
                        >
                            <option value="bitcoin">Bitcoin (BTC)</option>
                            <option value="ethereum">Ethereum (ETH)</option>
                            <option value="usdc">USD Coin (USDC)</option>
                            <option value="usdt">Tether (USDT)</option>
                        </Select>
                    </div>

                    <div className="form-group">
                        <Input
                            label="Wallet Address"
                            value={formData.walletAddress}
                            onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                            onBlur={() => handleBlur('walletAddress')}
                            placeholder={
                                formData.cryptoCurrency === 'bitcoin'
                                    ? 'bc1q...'
                                    : '0x...'
                            }
                            error={touched.walletAddress && errors.walletAddress}
                        />
                    </div>

                    {(formData.cryptoCurrency === 'usdc' || formData.cryptoCurrency === 'usdt' || formData.cryptoCurrency === 'ethereum') && (
                        <div className="form-group">
                            <Select
                                label="Network"
                                value={formData.cryptoNetwork}
                                onChange={(e) => handleInputChange('cryptoNetwork', e.target.value)}
                            >
                                <option value="ethereum">Ethereum Mainnet</option>
                                <option value="polygon">Polygon</option>
                                <option value="arbitrum">Arbitrum</option>
                                <option value="optimism">Optimism</option>
                                <option value="base">Base</option>
                            </Select>
                        </div>
                    )}
                </>
            )}
        </div>
    );

    // Render active form based on tab
    const renderActiveForm = () => {
        switch (activeTab) {
            case 'card':
                return renderCardForm();
            case 'bank':
                return renderBankForm();
            case 'wallet':
                return renderWalletForm();
            case 'regional':
                return renderRegionalForm();
            case 'crypto':
                return renderCryptoForm();
            default:
                return null;
        }
    };

    // Check if form can be submitted
    const canSubmit = () => {
        if (activeTab === 'card') {
            return formData.cardNumber && formData.expiryDate && formData.cvv && formData.cardholderName;
        }
        if (activeTab === 'bank') {
            if (!selectedMethod) return false;
            if (selectedMethod === 'ach') return formData.routingNumber && formData.accountNumber && formData.accountHolderName;
            if (selectedMethod === 'sepa') return formData.iban && formData.accountHolderName;
            return formData.accountNumber && formData.accountHolderName;
        }
        if (activeTab === 'wallet') {
            if (!selectedMethod) return false;
            if (selectedMethod === 'paypal') return formData.paypalEmail;
            return true; // Apple Pay / Google Pay
        }
        if (activeTab === 'regional') {
            if (!selectedMethod) return false;
            if (selectedMethod === 'mbway') return formData.phoneNumber;
            return true;
        }
        if (activeTab === 'crypto') {
            return selectedMethod && formData.walletAddress;
        }
        return false;
    };

    return (
        <Modal isOpen onClose={onClose} size="m">
            <div className="add-payment-method">
                {/* Header */}
                <div className="add-payment-method__header">
                    <h2>
                        <CreditCard size={20} className="margin-right-2" />
                        Add Payment Method
                    </h2>
                    <Button variant="ghost" size="s" onClick={onClose} aria-label="Close">
                        <X size={18} />
                    </Button>
                </div>

                {/* Tabs */}
                <div className="add-payment-method__tabs">
                    {methodCategories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            className={clsx(
                                'add-payment-method__tab',
                                activeTab === cat.id && 'add-payment-method__tab--active'
                            )}
                            onClick={() => {
                                setActiveTab(cat.id);
                                setSelectedMethod(null);
                                setErrors({});
                                setTouched({});
                            }}
                        >
                            {cat.icon}
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>

                {/* Form */}
                <form className="add-payment-method__form" onSubmit={handleSubmit}>
                    {renderActiveForm()}

                    {/* Common Fields */}
                    {(activeTab !== 'card' || (activeTab === 'card' && formData.cardNumber)) && (
                        <div className="add-payment-method__common-fields">
                            <div className="form-group">
                                <Input
                                    label="Display Label (Optional)"
                                    value={formData.displayLabel}
                                    onChange={(e) => handleInputChange('displayLabel', e.target.value)}
                                    placeholder="e.g., Personal Card, Business Account"
                                    helperText="A custom name to help you identify this payment method"
                                />
                            </div>

                            <div className="form-group">
                                <Checkbox
                                    checked={formData.isDefault}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                                    label="Set as default payment method"
                                />
                            </div>
                        </div>
                    )}

                    {/* Security Notice */}
                    <div className="add-payment-method__security">
                        <Lock size={14} />
                        <span>Your payment information is encrypted and transmitted securely using TLS 1.3</span>
                    </div>

                    {/* Error Message */}
                    {errors.submit && (
                        <div className="add-payment-method__error">
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
                            disabled={loading || !canSubmit()}
                        >
                            Save Payment Method
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddPaymentMethod;