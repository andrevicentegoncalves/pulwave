import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// Icon components with improved visuals
const IconInfo = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 9V14M10 6V6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconSuccess = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 10L9 13L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconWarning = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2L18 17H2L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 7V11M10 14V14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconError = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 7L13 13M13 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const Alert = ({ 
  type = 'info', 
  children, 
  variant = 'inline',
  dismissible = false,
  onDismiss,
  className 
}) => {
  const iconMap = {
    info: <IconInfo />,
    success: <IconSuccess />,
    warning: <IconWarning />,
    error: <IconError />
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
        {iconMap[type]}
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
          <IconClose />
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