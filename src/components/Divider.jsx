// src/components/Divider.jsx
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Divider = ({
  orientation = 'horizontal',
  variant = 'solid',
  spacing = 'md',
  text,
  textAlign = 'center',
  className,
}) => {
  const hasDividerText = !!text;

  if (hasDividerText) {
    return (
      <div
        className={clsx(
          'divider',
          'divider--with-text',
          `divider--${orientation}`,
          `divider--${variant}`,
          `divider--spacing-${spacing}`,
          `divider--text-${textAlign}`,
          className
        )}
        role="separator"
      >
        <span className="divider__line" />
        <span className="divider__text">{text}</span>
        <span className="divider__line" />
      </div>
    );
  }

  return (
    <hr
      className={clsx(
        'divider',
        `divider--${orientation}`,
        `divider--${variant}`,
        `divider--spacing-${spacing}`,
        className
      )}
      role="separator"
    />
  );
};

Divider.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  variant: PropTypes.oneOf(['solid', 'dashed', 'dotted']),
  spacing: PropTypes.oneOf(['sm', 'md', 'lg']),
  text: PropTypes.string,
  textAlign: PropTypes.oneOf(['left', 'center', 'right']),
  className: PropTypes.string,
};

export default Divider;