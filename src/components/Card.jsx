// src/components/Card.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ header, footer, children }) => {
  return (
    <div className="card">
      {header && <div className="card__header">{header}</div>}
      
      <div className="card__body">
        {children}
      </div>
      
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  header: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export default Card;
