import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Badge = ({ 
  children, 
  variant = 'medium', 
  type = 'neutral',
  size = 'm',
  icon,
  removable = false,
  onRemove,
  onClick,
  className 
}) => {
  const isClickable = !!onClick;

  return (
    <span 
      className={clsx(
        'badge',
        `badge--${variant}`,
        `badge--${type}`,
        `badge--${size}`,
        isClickable && 'badge--clickable',
        className
      )}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {icon && (
        <span className="badge__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      
      {children}
      
      {removable && (
        <button
          className="badge__close"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          aria-label="Remove badge"
          type="button"
        >
          <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['heavy', 'medium', 'light']),
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error', 'danger', 'neutral']),
  size: PropTypes.oneOf(['s', 'm', 'l']),
  icon: PropTypes.node,
  removable: PropTypes.bool,
  onRemove: PropTypes.func,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Badge;