// src/components/Badge.jsx
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// Icon components matching the design
const IconInfo = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 7.5V11.5M8 5.5V5.51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconSuccess = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconWarning = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2L14.5 13.5H1.5L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8 6.5V9.5M8 11.5V11.51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconError = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 5L11 11M11 5L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const iconMap = {
  info: <IconInfo />,
  success: <IconSuccess />,
  warning: <IconWarning />,
  error: <IconError />,
  neutral: null,
};

const Badge = ({
  variant = 'heavy',
  type = 'neutral',
  icon,
  children,
  className,
  onClick,
  ...rest
}) => {
  const badgeIcon = icon !== undefined ? icon : iconMap[type];
  const hasIcon = badgeIcon !== null && badgeIcon !== undefined;

  return (
    <span
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}
      className={clsx(
        'badge',
        `badge--${variant}`,
        `badge--${type}`,
        onClick && 'badge--clickable',
        className
      )}
      {...rest}
    >
      {hasIcon && (
        <span className="badge__icon" aria-hidden="true">
          {badgeIcon}
        </span>
      )}
      <span className="badge__text">{children}</span>
    </span>
  );
};

Badge.propTypes = {
  variant: PropTypes.oneOf(['heavy', 'medium', 'light']),
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error', 'neutral']),
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Badge;