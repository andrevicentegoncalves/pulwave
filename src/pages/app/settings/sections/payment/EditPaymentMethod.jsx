import { Modal, Input, Button, Checkbox, Select, Badge } from '../../../../../components/ui';
import {
    CreditCard, X, AlertCircle, Save, Shield, Calendar,
    Building2, Wallet, Bitcoin, Globe
} from 'lucide-react';
import { paymentService } from '../../../../../services';
import clsx from 'clsx';

/**
 * EditPaymentMethod - Edit existing payment method details
 * 
 * Allows editing:
 * - Display label
 * - Expiry date (for cards)
 * - Default status
 * - Verification retry
 * 
 * Note: Sensitive data like card numbers cannot be edited - 
 * user must delete and re-add for security
 */
const EditPaymentMethod = ({ method, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        displayLabel: method?.display_label || '',
        expiryMonth: method?.expiry_month || '',
        expiryYear: method?.expiry_year || '',
        isDefault: method?.is_default || false,
        // For bank accounts
        bankName: method?.bank_name || '',
        // For PayPal
        paypalEmail: method?.paypal_email || '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [retryingVerification, setRetryingVerification] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (method?.method_type === 'card') {
            // Validate expiry
            const month = parseInt(formData.expiryMonth);
            const year = parseInt(formData.expiryYear);

            if (month < 1 || month > 12) {
                newErrors.expiryMonth = 'Invalid month';
            }

            const now = new Date();
            const currentYear = now.getFullYear() % 100;
            const currentMonth = now.getMonth() + 1;

            if (year < currentYear || (year === currentYear && month < currentMonth)) {
                newErrors.expiryYear = 'Card has expired';
            }
        }

        if (method?.method_type === 'paypal' && formData.paypalEmail) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.paypalEmail)) {
                newErrors.paypalEmail = 'Invalid email address';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const updateData = {
                display_label: formData.displayLabel || null,
                is_default: formData.isDefault,
            };

            // Method-specific updates
            if (method?.method_type === 'card') {
                updateData.expiry_month = formData.expiryMonth;
                updateData.expiry_year = formData.expiryYear;
            } else if (method?.method_type === 'bank_account') {
                updateData.bank_name = formData.bankName;
            } else if (method?.method_type === 'paypal') {
                updateData.paypal_email = formData.paypalEmail;
            }

            // Using service instead of direct update
            await paymentService.updatePaymentMethod(method.id, updateData);

            onSuccess?.();
        } catch (error) {
            console.error('Error updating payment method:', error);
            setErrors({ submit: error.message || 'Failed to update payment method. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleRetryVerification = async () => {
        setRetryingVerification(true);

        try {
            // Use service for retry
            await paymentService.retryVerification(method.id);

            // In production, this would trigger a verification webhook/process
            // For now, just refresh the data
            onSuccess?.();
        } catch (error) {
            console.error('Error retrying verification:', error);
            setErrors({ submit: 'Failed to retry verification. Please try again.' });
        } finally {
            setRetryingVerification(false);
        }
    };

    // Get method type icon
    const getMethodTypeIcon = () => {
        switch (method?.method_type) {
            case 'card':
                return <CreditCard size={20} />;
            case 'bank_account':
                return <Building2 size={20} />;
            case 'paypal':
                return <Wallet size={20} />;
            case 'crypto':
                return <Bitcoin size={20} />;
            default:
                return <Globe size={20} />;
        }
    };

    // Get verification status display
    const getVerificationStatus = () => {
        switch (method?.verification_status) {
            case 'verified':
                return <Badge variant="light" type="success">Verified</Badge>;
            case 'pending':
                return <Badge variant="light" type="warning">Pending Verification</Badge>;
            case 'failed':
                return <Badge variant="light" type="error">Verification Failed</Badge>;
            case 'requires_action':
                return <Badge variant="light" type="warning">Action Required</Badge>;
            default:
                return null;
        }
    };

    if (!method) return null;

    return (
        <Modal isOpen onClose={onClose} size="s">
            <div className="edit-payment-method">
                {/* Header */}
                <div className="edit-payment-method__header">
                    <h2>
                        {getMethodTypeIcon()}
                        <span className="margin-left-2">Edit Payment Method</span>
                    </h2>
                    <Button variant="ghost" size="s" onClick={onClose} aria-label="Close">
                        <X size={18} />
                    </Button>
                </div>

                {/* Current Method Info */}
                <div className="edit-payment-method__info">
                    <div className="edit-payment-method__info-row">
                        {method.icon_url && (
                            <img
                                src={method.icon_url}
                                alt={method.card_brand || method.method_type}
                                className="edit-payment-method__brand-icon"
                            />
                        )}
                        <div className="edit-payment-method__info-details">
                            <span className="edit-payment-method__info-name">
                                {method.computed_display_name || method.card_brand}
                            </span>
                            {method.method_type === 'card' && method.last_four && (
                                <span className="edit-payment-method__info-secondary">
                                    •••• {method.last_four}
                                </span>
                            )}
                        </div>
                        {getVerificationStatus()}
                    </div>

                    {/* Verification failure info */}
                    {method.verification_status === 'failed' && method.last_failure_reason && (
                        <div className="edit-payment-method__failure-info">
                            <AlertCircle size={14} />
                            <span>Last failure: {method.last_failure_reason}</span>
                            <Button
                                variant="outline"
                                size="s"
                                onClick={handleRetryVerification}
                                loading={retryingVerification}
                            >
                                Retry Verification
                            </Button>
                        </div>
                    )}
                </div>

                {/* Form */}
                <form className="edit-payment-method__form" onSubmit={handleSubmit}>
                    {/* Display Label */}
                    <div className="form-group">
                        <Input
                            label="Display Label"
                            value={formData.displayLabel}
                            onChange={(e) => handleInputChange('displayLabel', e.target.value)}
                            placeholder="e.g., Personal Card, Business Account"
                            helperText="A custom name to help you identify this payment method"
                        />
                    </div>

                    {/* Card-specific fields */}
                    {method.method_type === 'card' && (
                        <div className="form-group">
                            <label className="form-label">
                                <Calendar size={14} className="margin-right-1" />
                                Expiry Date
                            </label>
                            <div className="form-row">
                                <Select
                                    value={formData.expiryMonth}
                                    onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                                    error={errors.expiryMonth}
                                >
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const month = String(i + 1).padStart(2, '0');
                                        return <option key={month} value={month}>{month}</option>;
                                    })}
                                </Select>
                                <Select
                                    value={formData.expiryYear}
                                    onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                                    error={errors.expiryYear}
                                >
                                    {Array.from({ length: 10 }, (_, i) => {
                                        const year = String((new Date().getFullYear() % 100) + i).padStart(2, '0');
                                        return <option key={year} value={year}>{year}</option>;
                                    })}
                                </Select>
                            </div>
                            {errors.expiryYear && (
                                <span className="form-error">{errors.expiryYear}</span>
                            )}
                        </div>
                    )}

                    {/* Bank-specific fields */}
                    {method.method_type === 'bank_account' && (
                        <div className="form-group">
                            <Input
                                label="Bank Name"
                                value={formData.bankName}
                                onChange={(e) => handleInputChange('bankName', e.target.value)}
                                placeholder="Chase Bank"
                            />
                        </div>
                    )}

                    {/* PayPal-specific fields */}
                    {method.method_type === 'paypal' && (
                        <div className="form-group">
                            <Input
                                label="PayPal Email"
                                type="email"
                                value={formData.paypalEmail}
                                onChange={(e) => handleInputChange('paypalEmail', e.target.value)}
                                placeholder="your@email.com"
                                error={errors.paypalEmail}
                            />
                        </div>
                    )}

                    {/* Default checkbox */}
                    <div className="form-group">
                        <Checkbox
                            checked={formData.isDefault}
                            onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                            label="Set as default payment method"
                        />
                    </div>

                    {/* Security Notice */}
                    <div className="edit-payment-method__security">
                        <Shield size={14} />
                        <span>
                            For security, card numbers and bank account details cannot be changed.
                            To update these, please remove this method and add a new one.
                        </span>
                    </div>

                    {/* Error Message */}
                    {errors.submit && (
                        <div className="edit-payment-method__error">
                            <AlertCircle size={14} />
                            <span>{errors.submit}</span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="edit-payment-method__actions">
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
                            <Save size={16} className="margin-right-2" />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EditPaymentMethod;