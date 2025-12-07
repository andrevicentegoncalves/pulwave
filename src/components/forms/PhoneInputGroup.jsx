import React from 'react';
import PropTypes from 'prop-types';
import PhoneSelect from './PhoneSelect';
import Input from '../ui/Input';

/**
 * PhoneInputGroup Component
 * A grouped input for phone numbers with country code selector and number input.
 * 
 * @example
 * <PhoneInputGroup
 *   label="Primary Phone"
 *   codeValue="+1"
 *   numberValue="5551234567"
 *   onCodeChange={(val) => setCode(val)}
 *   onNumberChange={(e) => setNumber(e.target.value)}
 * />
 */
const PhoneInputGroup = ({
    label,
    codeName = 'phone_code',
    numberName = 'phone_number',
    codeValue,
    numberValue,
    onCodeChange,
    onNumberChange,
    codePlaceholder = '+1',
    numberPlaceholder = '(555) 000-0000',
    loading = false,
    required = false,
    disabled = false,
    error,
    className,
    ...props
}) => {
    return (
        <div className={`phone-input-group ${className || ''}`} {...props}>
            {label && (
                <label className="phone-input-group__label form-label">
                    {label}
                    {required && <span className="form-label__required">*</span>}
                </label>
            )}
            <div className="phone-input-group__inputs">
                <div className="phone-input-group__code">
                    <PhoneSelect
                        label=""
                        name={codeName}
                        value={codeValue}
                        onChange={onCodeChange}
                        placeholder={codePlaceholder}
                        loading={loading}
                        disabled={disabled}
                    />
                </div>
                <div className="phone-input-group__number">
                    <Input
                        name={numberName}
                        type="tel"
                        value={numberValue || ''}
                        onChange={onNumberChange}
                        placeholder={numberPlaceholder}
                        fullWidth
                        loading={loading}
                        disabled={disabled}
                        error={error}
                    />
                </div>
            </div>
            {error && typeof error === 'string' && (
                <span className="phone-input-group__error">{error}</span>
            )}
        </div>
    );
};

PhoneInputGroup.propTypes = {
    /** Label for the input group */
    label: PropTypes.string,
    /** Name attribute for the code input */
    codeName: PropTypes.string,
    /** Name attribute for the number input */
    numberName: PropTypes.string,
    /** Current value of the country code */
    codeValue: PropTypes.string,
    /** Current value of the phone number */
    numberValue: PropTypes.string,
    /** Handler for code changes */
    onCodeChange: PropTypes.func.isRequired,
    /** Handler for number changes */
    onNumberChange: PropTypes.func.isRequired,
    /** Placeholder for code input */
    codePlaceholder: PropTypes.string,
    /** Placeholder for number input */
    numberPlaceholder: PropTypes.string,
    /** Loading state */
    loading: PropTypes.bool,
    /** Required field */
    required: PropTypes.bool,
    /** Disabled state */
    disabled: PropTypes.bool,
    /** Error message or state */
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    /** Additional CSS classes */
    className: PropTypes.string,
};

export default PhoneInputGroup;
