// src/components/ui/TextArea.jsx
import React, { useState } from 'react';
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
  fullWidth = false,
  variant = 'outlined', // 'outlined' | 'contained'
  showCount = false,
  maxLength,
  className,
  ...rest
}) => {
  // Remove props that shouldn't be passed to DOM
  const { fullWidth: _, ...domProps } = rest;

  const charCount = value ? value.length : 0;
  const isOverLimit = maxLength && charCount > maxLength;

  return (
    <div className={clsx(
      'textarea',
      fullWidth && 'textarea--full-width',
      variant && `textarea--${variant}`,
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

      <div className="textarea__container">
        <textarea
          className={clsx(
            'textarea__field',
            `textarea__field--${variant}`,
            error && 'textarea__field--error'
          )}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          {...domProps}
        />
      </div>

      <div className="textarea__footer">
        <div className="textarea__helper-container">
          {error && (
            <span className="textarea__helper textarea__helper--error">{error}</span>
          )}

          {helperText && !error && (
            <span className="textarea__helper">{helperText}</span>
          )}
        </div>

        {showCount && (
          <span className={clsx(
            'textarea__count',
            isOverLimit && 'textarea__count--over-limit'
          )}>
            {charCount}{maxLength ? `/${maxLength}` : ''}
          </span>
        )}
      </div>
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
  fullWidth: PropTypes.bool,
  variant: PropTypes.oneOf(['outlined', 'contained']),
  showCount: PropTypes.bool,
  maxLength: PropTypes.number,
  className: PropTypes.string,
};

export default Textarea;