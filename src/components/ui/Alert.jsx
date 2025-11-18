import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Icon from './Icon';
import { AlertCircle, CheckCircle, AlertTriangle, XCircle, XClose } from './iconLibrary';

/**
 * Alert Component with Icon support
 * Uses design system tokens and Icon component for consistent sizing
 */
const Alert = ({ 
  type = 'info', 
  children, 
  variant = 'inline',
  dismissible = false,
  onDismiss,
  iconSize = 's',
  className 
}) => {
  const iconMap = {
    info: <AlertCircle />,
    success: <CheckCircle />,
    warning: <AlertTriangle />,
    error: <XCircle />
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
        <Icon size={iconSize}>
          {iconMap[type]}
        </Icon>
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
          <Icon size="xs">
            <XClose />
          </Icon>
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
  iconSize: PropTypes.oneOf(['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl']),
  className: PropTypes.string,
};

export default Alert;