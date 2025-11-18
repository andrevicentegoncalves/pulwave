import React from 'react';
import PropTypes from 'prop-types';

/**
 * Base SVG wrapper component
 * Handles viewBox, accessibility, and passes through SVG content
 */
const Vector = ({ 
  children, 
  viewBox = '0 0 24 24',
  fill = 'none',
  className = '',
  title,
  ...props 
}) => {
  return (
    <Vector
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill={fill}
      className={className}
      role="img"
      aria-hidden={!title}
      aria-label={title}
      {...props}
    >
      {title && <title>{title}</title>}
      {children}
    </Vector>
  );
};

Vector.propTypes = {
  children: PropTypes.node.isRequired,
  viewBox: PropTypes.string,
  fill: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
};

export default Vector;