// src/components/ui/TextArea.jsx
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  disabled = false,
  error,
  helperText,
  fullWidth = false, // NEW: Add fullWidth prop
  className,
  ...rest
}) => {
  // ✅ FIX: Remove fullWidth from rest props to prevent passing to DOM
  const { fullWidth: _, ...domProps } = rest;

  return (
    <div className={clsx(
      'textarea', 
      fullWidth && 'textarea--full-width', // Apply fullWidth class
      className
    )}>
      {label && (
        <label className={clsx(
          'textarea__label', 
          required && 'textarea__label--required'
        )}>
          {label}
          {required && <span className="textarea__required" aria-label="required">*</span>}
        </label>
      )}
      
      <textarea
        className={clsx(
          'textarea__field',
          error && 'textarea__field--error'
        )}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        {...domProps}
      />
      
      {error && (
        <span className="textarea__error">{error}</span>
      )}
      
      {helperText && !error && (
        <span className="textarea__helper-text">{helperText}</span>
      )}
    </div>
  );
};

Textarea.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  fullWidth: PropTypes.bool, // NEW: Add to propTypes
  className: PropTypes.string,
};

export default Textarea;