import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const iconMap = {
  info: 'i',
  success: 'Check',
  warning: '',
  error: '!',
  neutral: '',
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
  const hasIcon = icon !== undefined || iconMap[type];

  // No longer need to map 'neutral' to 'default', as CSS is updated
  // const cssType = type === 'neutral' ? 'default' : type;

  return (
    <span
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}
      className={clsx(
        'badge',
        `badge--${variant}`,
        `badge--${type}`, // Using 'type' directly now
        onClick && 'badge--clickable',
        className
      )}
      {...rest}
    >
      {hasIcon && (
        <span className="badge__icon" aria-hidden="true">
          {icon ?? iconMap[type]}
        </span>
      )}
      <span className="badge__label">{children}</span>
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
