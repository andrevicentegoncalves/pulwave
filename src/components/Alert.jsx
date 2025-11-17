// src/components/Alert.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Alert = ({ type, children }) => {
  const classes = `alert alert--${type}`;

  // Mapping types to the specific icons seen in your image
  const icons = {
    success: '✓',
    info: 'i',
    warning: '▲', // Using a triangle character
    error: '✕', // Using a multiplication sign character
  };

  return (
    <div className={classes}>
      <div className="alert__icon">
        {icons[type]}
      </div>
      <div className="alert__content">
        {children}
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']).isRequired,
  children: PropTypes.node.isRequired,
};

export default Alert;
