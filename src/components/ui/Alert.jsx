import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Alert = ({ 
  type = 'info', 
  children, 
  variant = 'inline',
  dismissible = false,
  onDismiss,
  className 
}) => {
  const icons = {
    info: 'ℹ',
    success: '✓',
    warning: '⚠',
    error: '×'
  };

  return (
    <div 
      className={clsx(
        'alert',
        `alert--${type}`,
        variant === 'modal' && 'alert--modal',
        variant === 'toast' && 'alert--toast',
        className
      )}
      role="alert"
    >
      <div className="alert__icon" aria-hidden="true">
        {icons[type]}
      </div>
      
      <div className="alert__content">
        {children}
      </div>
      
      {dismissible && (
        <button
          className="alert__close"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['inline', 'modal', 'toast']),
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func,
  className: PropTypes.string,
};

export default Alert;