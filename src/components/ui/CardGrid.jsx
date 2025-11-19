// src/components/ui/CardGrid.jsx
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * CardGrid Component
 * A responsive grid container for displaying card components
 * Uses CSS Grid with auto-fit for automatic responsive behavior
 * 
 * @param {node} children - Card components to display in the grid
 * @param {string} className - Additional CSS classes
 * @param {string} minCardWidth - Minimum width for cards (default: 280px)
 * @param {string} gap - Gap between cards using design tokens (default: var(--space-4))
 */
const CardGrid = ({ 
  children, 
  className,
  minCardWidth = '280px',
  gap = 'var(--space-4)'
}) => {
  return (
    <div 
      className={clsx('card-grid', className)}
      style={{
        '--card-grid-min-width': minCardWidth,
        '--card-grid-gap': gap
      }}
    >
      {children}
    </div>
  );
};

CardGrid.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  minCardWidth: PropTypes.string,
  gap: PropTypes.string,
};

export default CardGrid;