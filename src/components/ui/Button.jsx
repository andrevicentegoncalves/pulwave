// src/components/ui/Button.jsx
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Spinner from './Spinner';

/**
 * Button Component
 * Matches existing .btn CSS classes from design system
 * ✅ Uses: btn, btn--primary, btn--s, btn--l, btn--ghost, etc.
 */
const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'm',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  className,
  onClick,
  leftIcon,
  rightIcon,
  ...rest
}, ref) => {
  // Spinner size based on button size
  const spinnerSize = size === 's' ? 14 : size === 'l' ? 20 : 16;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={clsx(
        'btn',                              // Base class
        `btn--${variant}`,                  // Variant: primary, secondary, ghost, destructive, tertiary
        size === 's' && 'btn--s',          // Small size
        size === 'l' && 'btn--l',          // Large size
        // No class for 'm' (medium is default)
        fullWidth && 'btn--full-width',     // Full width modifier
        loading && 'btn--loading',          // Loading state
        className
      )}
      onClick={onClick}
      aria-busy={loading}
      {...rest}
    >
      {/* Show spinner in place of leftIcon when loading, or show leftIcon */}
      {loading ? (
        <span className="btn__icon btn__spinner">
          <Spinner size={spinnerSize} />
        </span>
      ) : (
        leftIcon && <span className="btn__icon">{leftIcon}</span>
      )}
      {children}
      {rightIcon && <span className="btn__icon">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'ghost', 'destructive', 'outline-primary', 'outline', 'icon-circle']),
  size: PropTypes.oneOf(['s', 'm', 'l']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
