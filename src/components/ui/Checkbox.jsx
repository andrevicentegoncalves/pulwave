import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * Checkbox Component
 * A styled checkbox input with label support
 */
const Checkbox = ({
    label,
    name,
    id,
    checked = false,
    disabled = false,
    required = false,
    helperText,
    error,
    onChange,
    className,
    ...rest
}) => {
    const checkboxId = id || name;

    return (
        <div className={clsx('checkbox-wrapper', className)}>
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    id={checkboxId}
                    name={name}
                    checked={checked}
                    disabled={disabled}
                    required={required}
                    onChange={onChange}
                    className={clsx(
                        'checkbox__input',
                        error && 'checkbox__input--error'
                    )}
                    aria-invalid={!!error}
                    aria-describedby={
                        (error || helperText) ? `${checkboxId}-helper` : undefined
                    }
                    {...rest}
                />
                {label && (
                    <label
                        htmlFor={checkboxId}
                        className={clsx(
                            'checkbox__label',
                            disabled && 'checkbox__label--disabled'
                        )}
                    >
                        {label}
                        {required && <span className="checkbox__required" aria-label="required">*</span>}
                    </label>
                )}
            </div>

            {/* Helper Text / Error Message */}
            {(helperText || error) && (
                <div
                    id={`${checkboxId}-helper`}
                    className={clsx(
                        'checkbox__helper',
                        error && 'checkbox__helper--error'
                    )}
                    role={error ? 'alert' : undefined}
                >
                    {error || helperText}
                </div>
            )}
        </div>
    );
};

Checkbox.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    helperText: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
};

export default Checkbox;
