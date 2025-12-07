import React from 'react';

export const Divider = ({
  variant = 'solid',
  orientation = 'horizontal',
  spacing = 'default'
}) => {
  return (
    <div
      className={`divider divider--${variant} divider--${orientation} divider--spacing-${spacing}`}
      role="separator"
      aria-orientation={orientation}
    />
  );
};

export default Divider;