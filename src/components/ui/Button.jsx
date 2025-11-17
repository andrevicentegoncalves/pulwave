// src/components/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  disabled = false,
  className,
  onClick,
  ...rest
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className={clsx(
        'btn',
        `btn--${variant}`,
        size !== 'md' && `btn--${size}`,
        disabled && 'btn--disabled',
        className
      )}
      {...rest}
    >
      {iconLeft && <span className="btn__icon">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span className="btn__icon">{iconRight}</span>}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'destructive', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;