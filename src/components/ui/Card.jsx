// src/components/Card.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ header, footer, children, variant = 'default', style, className, onClick, noPadding = false }) => {
  return (
    <div 
      className={`card ${variant ? `card--${variant}` : ''} ${noPadding ? 'card--no-padding' : ''} ${className || ''}`}
      style={style}
      onClick={onClick}
    >
      {header && <div className="card__header">{header}</div>}
      
      {noPadding ? children : <div className="card__body">{children}</div>}
      
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  header: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined']),
  style: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
  noPadding: PropTypes.bool,
};

export default Card;