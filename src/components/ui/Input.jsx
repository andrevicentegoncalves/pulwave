// src/components/ui/Input.jsx
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Input = forwardRef(({
  type = 'text',
  label,
  name,
  id,
  value,
  placeholder,
  disabled = false,
  readOnly = false,
  required = false,
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  size = 'md',
  fullWidth = false,
  className,
  onChange,
  onBlur,
  onFocus,
  as = 'input', // NEW: Support select elements
  children, // NEW: For select options
  ...rest
}, ref) => {
  const inputId = id || name;
  const hasError = !!error;
  const hasSuccess = !!success;
  const InputElement = as; // Can be 'input', 'select', or 'textarea'

  // ✅ FIX: Remove fullWidth from rest props to prevent passing to DOM
  const { fullWidth: _, ...domProps } = rest;

  return (
    <div className={clsx(
      'input-wrapper', 
      fullWidth && 'input-wrapper--full-width',
      className
    )}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className={clsx(
            'input__label',
            required && 'input__label--required'
          )}
        >
          {label}
          {required && <span className="input__required" aria-label="required">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className={clsx(
        'input-container',
        leftIcon && 'input-container--has-left-icon',
        rightIcon && 'input-container--has-right-icon',
        hasError && 'input-container--error',
        hasSuccess && 'input-container--success',
        disabled && 'input-container--disabled'
      )}>
        {/* Left Icon */}
        {leftIcon && (
          <span className="input__icon input__icon--left" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {/* Input/Select/Textarea Element */}
        <InputElement
          ref={ref}
          type={as === 'input' ? type : undefined}
          id={inputId}
          name={name}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={hasError}
          aria-describedby={
            (error || helperText) ? `${inputId}-helper` : undefined
          }
          className={clsx(
            'input',
            `input--${size}`,
            leftIcon && 'input--has-left-icon',
            rightIcon && 'input--has-right-icon'
          )}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          {...domProps}
        >
          {children}
        </InputElement>

        {/* Right Icon */}
        {rightIcon && (
          <span className="input__icon input__icon--right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>

      {/* Helper Text / Error / Success Message */}
      {(helperText || error || success) && (
        <div 
          id={`${inputId}-helper`}
          className={clsx(
            'input__helper',
            hasError && 'input__helper--error',
            hasSuccess && 'input__helper--success'
          )}
          role={hasError ? 'alert' : undefined}
        >
          {error || success || helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  success: PropTypes.string,
  helperText: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  as: PropTypes.oneOf(['input', 'select', 'textarea']),
  children: PropTypes.node,
};

export default Input;