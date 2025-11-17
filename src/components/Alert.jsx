// src/components/Alert.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Alert = ({ 
  type = 'info', 
  variant = 'inline',
  dismissible = false,
  onDismiss,
  autoHideDuration,
  children 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHideDuration && variant === 'toast') {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, variant]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  // Mapping types to the specific icons seen in your image
  const icons = {
    success: '✓',
    info: 'i',
    warning: '▲',
    error: '✕',
  };

  return (
    <div 
      className={clsx(
        'alert',
        `alert--${type}`,
        `alert--${variant}`,
        dismissible && 'alert--dismissible'
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="alert__icon" aria-hidden="true">
        {icons[type]}
      </div>
      
      <div className="alert__content">
        {children}
      </div>
      
      {(dismissible || variant === 'toast') && (
        <button
          type="button"
          className="alert__close"
          onClick={handleDismiss}
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']).isRequired,
  variant: PropTypes.oneOf(['inline', 'toast']),
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func,
  autoHideDuration: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export default Alert;