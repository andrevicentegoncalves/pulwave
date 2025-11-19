// src/components/ui/FloatingActionButton.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Icon from './Icon';
import { Plus, XClose, Building, Home } from './iconLibrary';

/**
 * FloatingActionButton Component
 * A mobile-first FAB with expandable actions
 * Shows on mobile/tablet, hides on desktop
 * 
 * @param {Array} actions - Array of action objects with { icon, label, onClick }
 * @param {string} position - Position of FAB ('bottom-right', 'bottom-left', 'bottom-center')
 */
const FloatingActionButton = ({ 
  actions = [],
  position = 'bottom-right',
  className 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={clsx(
      'fab-container',
      `fab-container--${position}`,
      isExpanded && 'fab-container--expanded',
      className
    )}>
      {/* Action Items */}
      {isExpanded && (
        <div className="fab-actions">
          {actions.map((action, index) => (
            <button
              key={index}
              className="fab-action"
              onClick={() => {
                action.onClick();
                setIsExpanded(false);
              }}
              aria-label={action.label}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <Icon size="m" className="fab-action__icon">
                {action.icon}
              </Icon>
              <span className="fab-action__label">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main FAB Button */}
      <button
        className={clsx(
          'fab',
          isExpanded && 'fab--active'
        )}
        onClick={toggleExpanded}
        aria-label={isExpanded ? 'Close actions menu' : 'Open actions menu'}
        aria-expanded={isExpanded}
      >
        <Icon size="l" className="fab__icon">
          {isExpanded ? <XClose /> : <Plus />}
        </Icon>
      </button>

      {/* Overlay/Backdrop */}
      {isExpanded && (
        <div 
          className="fab-overlay"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

FloatingActionButton.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.element.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  })),
  position: PropTypes.oneOf(['bottom-right', 'bottom-left', 'bottom-center']),
  className: PropTypes.string,
};

export default FloatingActionButton;