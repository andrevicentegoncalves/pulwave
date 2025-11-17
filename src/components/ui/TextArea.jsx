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
  className,
  ...rest
}) => {
  return (
    <div className={clsx('textarea', className)}>
      {label && (
        <label className={clsx('textarea__label', { 'textarea__label--required': required })}>
          {label}
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
        {...rest}
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
  className: PropTypes.string,
};

export default Textarea;