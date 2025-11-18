import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Vector from './Vector';

/**
 * Icon Component
 * Wraps SVG content with consistent sizing and styling based on design tokens
 * 
 * Design Token Sizes from your system:
 * - 2xs: --icon-size-2xs (12px)
 * - xs:  --icon-size-xs (16px)  
 * - s:   --icon-size-s (20px)
 * - m:   --icon-size-m (24px) - DEFAULT
 * - l:   --icon-size-l (32px)
 * - xl:  --icon-size-xl (40px)
 * - 2xl: --icon-size-2xl (48px)
 */
const Icon = ({ 
  children,
  size = 'm',
  className = '',
  title,
  ...props 
}) => {
  const sizeClasses = {
    '2xs': 'icon-2xs',
    'xs': 'icon-xs', 
    's': 'icon-s',
    'm': 'icon-m',
    'l': 'icon-l',
    'xl': 'icon-xl',
    '2xl': 'icon-2xl',
  };

  return (
    <span 
      className={clsx('icon', sizeClasses[size], className)}
      style={{
        width: `var(--icon-size-${size})`,
        height: `var(--icon-size-${size})`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Vector title={title} {...props}>
        {children}
      </Vector>
    </span>
  );
};

Icon.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl']),
  className: PropTypes.string,
  title: PropTypes.string,
};

export default Icon;