import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// Icon components with bigger size (24x24)
const IconInfo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 11V16M12 8V8.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const IconSuccess = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconWarning = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L21 19H3L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 9V13M12 16V16.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const IconError = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 9L15 15M15 9L9 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
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